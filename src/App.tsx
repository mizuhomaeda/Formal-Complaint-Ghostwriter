/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { DocumentPanel } from './components/DocumentPanel';
import { PolicyGuideModal } from './components/PolicyGuideModal';
import { ToneAuditModal } from './components/ToneAuditModal';
import { QuickFillModal } from './components/QuickFillModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { Message, InteractionStage, DraftVersion, ErrorNotice } from './types';

const STORAGE_KEY = 'mdes_cohort7_ghostwriter_state_v1';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<InteractionStage>('listening');
  const [draft, setDraft] = useState<string>('');
  const [versions, setVersions] = useState<DraftVersion[]>([]);
  const [viewMode, setViewMode] = useState<'split' | 'chat' | 'document'>('split');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<ErrorNotice | null>(null);
  const [activeModel, setActiveModel] = useState<string>('gemini-flash-lite-latest');

  // Fetch model info from server
  useEffect(() => {
    fetch('/api/model-info')
      .then((r) => r.json())
      .then((d) => {
        if (d.currentModel) setActiveModel(d.currentModel);
      })
      .catch(() => {});
  }, []);

  // Modals
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
        if (parsed.currentStage) setCurrentStage(parsed.currentStage);
        if (typeof parsed.draft === 'string') setDraft(parsed.draft);
        if (Array.isArray(parsed.versions)) setVersions(parsed.versions);
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage:', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages,
          currentStage,
          draft,
          versions,
        })
      );
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [messages, currentStage, draft, versions]);

  // Adjust view mode automatically on small screens if split
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'split') {
        setViewMode('chat');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Active abort controller for 60s timeout and manual cancel controls
  const activeControllerRef = useRef<AbortController | null>(null);

  // Send request to server backend
  const executeCall = async (
    conversationMessages: Message[],
    failedUserTextForRetry: string
  ) => {
    // Abort any existing pending call before starting new one
    if (activeControllerRef.current) {
      activeControllerRef.current.abort('cancelled');
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;

    setIsLoading(true);
    setErrorNotice(null);

    // 60-second timeout requirement
    const timeoutId = setTimeout(() => {
      if (activeControllerRef.current === controller) {
        controller.abort('timeout');
      }
    }, 60000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentDraft: draft,
          currentStage,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with HTTP ${response.status} (${response.statusText})`
        );
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I hear you. Let us examine how to frame this clearly.',
        timestamp: new Date().toISOString(),
        stage: data.currentStage || currentStage,
        summaryOfUnderstanding: data.summaryOfUnderstanding || null,
        hasDraft: data.hasDraft || false,
        letterDraft: data.letterDraft || null,
        unresolvedItems: data.unresolvedItems || [],
        revisionOptions: data.revisionOptions?.optionA ? data.revisionOptions : null,
        modelUsed: data.modelUsed || activeModel,
      };

      if (data.modelUsed) {
        setActiveModel(data.modelUsed);
      }

      setMessages([...conversationMessages, assistantMessage]);
      setErrorNotice(null);

      // Only advance stage on success!
      if (data.currentStage) {
        setCurrentStage(data.currentStage as InteractionStage);
      }

      // If a new draft or revised draft was provided
      if (data.hasDraft && data.letterDraft) {
        const newDraftContent = data.letterDraft.trim();
        setDraft(newDraftContent);

        // Add to version history
        const newVersion: DraftVersion = {
          id: `v-${Date.now()}`,
          timestamp: new Date().toISOString(),
          content: newDraftContent,
          label:
            data.currentStage === 'revise'
              ? `Revision ${versions.length + 1}`
              : `Draft ${versions.length + 1}`,
        };
        setVersions((prev) => [...prev, newVersion]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);

      let errorMessage = err.message || 'Failed to communicate with ghostwriter service.';
      if (controller.signal.aborted) {
        if (controller.signal.reason === 'timeout') {
          errorMessage = 'The ghostwriter took longer than 60 seconds to respond. The request has been timed out.';
        } else if (controller.signal.reason === 'cancelled') {
          errorMessage = 'Request was cancelled.';
        }
      }

      // Requirement:
      // - Show error as inline notice with Retry button
      // - Keep user's message in the conversation
      // - Do NOT advance Interaction Loop indicator
      // - Keep input usable
      setErrorNotice({
        id: `err-${Date.now()}`,
        message: errorMessage,
        failedUserText: failedUserTextForRetry,
      });
    } finally {
      clearTimeout(timeoutId);
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (activeControllerRef.current) {
      activeControllerRef.current.abort('cancelled');
    }
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    await executeCall(newMessages, userText);
  };

  const handleRetry = async () => {
    if (isLoading || !errorNotice) return;
    const retryText = errorNotice.failedUserText;
    // Check if the last message in `messages` is already the user's failed message
    let conversationToSend = [...messages];
    if (
      conversationToSend.length === 0 ||
      conversationToSend[conversationToSend.length - 1].content !== retryText
    ) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: retryText,
        timestamp: new Date().toISOString(),
      };
      conversationToSend = [...conversationToSend, userMessage];
      setMessages(conversationToSend);
    }

    await executeCall(conversationToSend, retryText);
  };

  const handleSelectJourney = (initialPrompt: string) => {
    handleSendMessage(initialPrompt);
  };

  const handleSelectRevisionOption = (choiceText: string) => {
    handleSendMessage(choiceText);
  };

  const handleConfirmUnderstanding = (isConfirmed: boolean) => {
    if (isConfirmed) {
      handleSendMessage(
        'Yes, that captures my situation accurately. Please proceed with clarifying specific facts or generating the first draft with square brackets for missing information.'
      );
    } else {
      handleSendMessage(
        'Some details need adjustment. Let me clarify what actually happened and what is most important to me.'
      );
    }
  };

  const handleUpdateDraft = (newDraft: string) => {
    setDraft(newDraft);
  };

  const handleRestoreVersion = (version: DraftVersion) => {
    setDraft(version.content);
    const restoreNotice: Message = {
      id: `restore-${Date.now()}`,
      role: 'assistant',
      content: `Restored draft version: "${version.label}". You can continue refining this version.`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, restoreNotice]);
  };

  const handleReplacePlaceholder = (placeholder: string, replacement: string) => {
    if (!draft) return;
    const updated = draft.split(placeholder).join(replacement);
    setDraft(updated);

    // Save as updated version
    const newVersion: DraftVersion = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      content: updated,
      label: `Filled ${placeholder}`,
    };
    setVersions((prev) => [...prev, newVersion]);
  };

  // Requirement 3: Reset clears everything, sets stage to Step 1, works in error states
  const handleConfirmReset = () => {
    if (activeControllerRef.current) {
      activeControllerRef.current.abort('cancelled');
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed clearing localStorage:', e);
    }
    setMessages([]);
    setCurrentStage('listening');
    setDraft('');
    setVersions([]);
    setErrorNotice(null);
    setIsLoading(false);
  };

  const handleJumpToDraft = () => {
    if (viewMode === 'chat') {
      setViewMode('document');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-stone-50 overflow-hidden font-sans-body">
      {/* Header with Navigation and Interaction Loop status */}
      <Header
        currentStage={currentStage}
        viewMode={viewMode}
        activeModel={activeModel}
        setViewMode={setViewMode}
        onOpenPolicyGuide={() => setIsPolicyModalOpen(true)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenDiagram={() => setIsDiagramModalOpen(true)}
        hasDraft={Boolean(draft)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-0">
            <ChatPanel
              messages={messages}
              currentStage={currentStage}
              isLoading={isLoading}
              errorNotice={errorNotice}
              onSendMessage={handleSendMessage}
              onRetry={handleRetry}
              onCancel={handleCancel}
              onDismissError={() => setErrorNotice(null)}
              onSelectJourney={handleSelectJourney}
              onSelectRevisionOption={handleSelectRevisionOption}
              onConfirmUnderstanding={handleConfirmUnderstanding}
              onJumpToDraft={handleJumpToDraft}
            />
            <DocumentPanel
              draft={draft}
              onUpdateDraft={handleUpdateDraft}
              versions={versions}
              onRestoreVersion={handleRestoreVersion}
              onOpenQuickFill={(placeholder) => setActivePlaceholder(placeholder)}
              onRequestFirstDraft={() =>
                handleSendMessage(
                  'Please draft the formal complaint letter based on what we have discussed so far. Put any missing facts in square brackets.'
                )
              }
            />
          </div>
        ) : viewMode === 'chat' ? (
          <div className="h-full max-w-4xl mx-auto shadow-xs min-h-0">
            <ChatPanel
              messages={messages}
              currentStage={currentStage}
              isLoading={isLoading}
              errorNotice={errorNotice}
              onSendMessage={handleSendMessage}
              onRetry={handleRetry}
              onCancel={handleCancel}
              onDismissError={() => setErrorNotice(null)}
              onSelectJourney={handleSelectJourney}
              onSelectRevisionOption={handleSelectRevisionOption}
              onConfirmUnderstanding={handleConfirmUnderstanding}
              onJumpToDraft={() => setViewMode('document')}
            />
          </div>
        ) : (
          <div className="h-full min-h-0">
            <DocumentPanel
              draft={draft}
              onUpdateDraft={handleUpdateDraft}
              versions={versions}
              onRestoreVersion={handleRestoreVersion}
              onOpenQuickFill={(placeholder) => setActivePlaceholder(placeholder)}
              onRequestFirstDraft={() => {
                setViewMode('chat');
                handleSendMessage(
                  'Please draft the formal complaint letter based on what we have discussed so far. Put any missing facts in square brackets.'
                );
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <PolicyGuideModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      <ToneAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        draft={draft}
        onJumpToPlaceholder={(ph) => {
          setActivePlaceholder(ph);
        }}
      />

      <QuickFillModal
        isOpen={Boolean(activePlaceholder)}
        placeholder={activePlaceholder || ''}
        onClose={() => setActivePlaceholder(null)}
        onReplace={handleReplacePlaceholder}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <SystemDiagramModal
        isOpen={isDiagramModalOpen}
        onClose={() => setIsDiagramModalOpen(false)}
        activeModel={activeModel}
      />
    </div>
  );
}
