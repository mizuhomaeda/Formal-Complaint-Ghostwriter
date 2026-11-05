/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, InteractionStage, ErrorNotice } from '../types';
import { SAMPLE_JOURNEYS } from '../data/sampleJourneys';
import {
  Send,
  Mic,
  MicOff,
  User,
  Sparkles,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  ArrowDown,
  SplitSquareVertical,
  HelpCircle,
  RotateCw,
  X,
} from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  currentStage: InteractionStage;
  isLoading: boolean;
  errorNotice: ErrorNotice | null;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
  onCancel: () => void;
  onDismissError: () => void;
  onSelectJourney: (initialPrompt: string) => void;
  onSelectRevisionOption: (optionText: string) => void;
  onConfirmUnderstanding: (isConfirmed: boolean) => void;
  onJumpToDraft: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentStage,
  isLoading,
  errorNotice,
  onSendMessage,
  onRetry,
  onCancel,
  onDismissError,
  onSelectJourney,
  onSelectRevisionOption,
  onConfirmUnderstanding,
  onJumpToDraft,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check if scroll container is at the bottom
  const checkIfAtBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceToBottom <= 50;
  }, []);

  const handleScroll = () => {
    setIsAtBottom(checkIfAtBottom());
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
      setIsAtBottom(true);
    }
  };

  // Only auto-scroll on new messages / loading / error IF user is already at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom('smooth');
    }
  }, [messages.length, isLoading, errorNotice]);

  // Set up speech recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeech = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-stone-50 border-r border-stone-200 relative">
      {/* Dialogue scroll area - entire history is freely scrollable */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6"
      >
        {/* If no messages yet, show empathy welcome & sample journeys */}
        {messages.length === 0 && (
          <div className="max-w-xl mx-auto py-4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#003262] text-amber-300 flex items-center justify-center font-serif-body font-bold text-base">
                  M
                </div>
                <div>
                  <h3 className="font-serif-body font-semibold text-stone-900 text-lg">
                    Formal Complaint Ghostwriter
                  </h3>
                  <p className="text-xs text-stone-500">
                    Cohort 7 · Confidential drafting assistance
                  </p>
                </div>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed mb-4">
                I am here to help you articulate unsustainable workload and scheduling challenges into a
                firm, serious, collegial formal complaint letter to the UC Berkeley MDes Program Office.
              </p>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 text-xs text-stone-600 space-y-1">
                <p className="font-medium text-stone-800">How we work together:</p>
                <p>• Speak freely, even if your thoughts feel messy or unorganized.</p>
                <p>• I will listen, capture your key challenges, reflect them back, and draft the letter.</p>
                <p>• You retain final control over every word. I never send anything.</p>
              </div>
            </div>

            {/* Persona Journey Starters */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
                <span>Start with a fellow student's situation:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_JOURNEYS.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => onSelectJourney(j.initialPrompt)}
                    className="text-left p-4 bg-white hover:bg-stone-50/80 border border-stone-200 hover:border-[#003262]/40 rounded-xl transition-all shadow-2xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-body font-semibold text-stone-900 group-hover:text-[#003262]">
                          {j.name}'s Experience
                        </span>
                        <span className="text-[10px] text-stone-400">{j.persona}</span>
                      </div>
                      <p className="text-xs font-medium text-amber-800 mb-1.5">{j.tagline}</p>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {j.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center text-xs font-medium text-[#003262] gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Begin this journey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Starter Prompts */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-medium text-stone-500 block mb-2">
                Or describe your own experience directly:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Workload is too tight and affecting my health, physically and mentally",
                  "I went to office hours but nothing changed",
                  "I'm overwhelmed but not sure if my situation is bad enough",
                  "Concurrent studio milestones are affecting my physical and mental health",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-[#003262]/10 hover:text-[#003262] text-stone-700 rounded-lg transition-colors text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Feed */}
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-medium ${
                  isUser
                    ? 'bg-stone-800 text-white'
                    : 'bg-[#003262] text-amber-300 font-serif-body'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : 'M'}
              </div>

              {/* Message Bubble & Cards */}
              <div className="space-y-3 flex-1 min-w-0">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#003262] text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {!isUser && (
                    <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono-code">
                      <span>Model: {m.modelUsed || 'gemini-3.1-flash-lite'}</span>
                    </div>
                  )}
                </div>

                {/* If the Ghostwriter provided a Summary of Understanding (Reflect Step) */}
                {m.summaryOfUnderstanding && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2.5">
                    <div className="flex items-center gap-2 font-semibold text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>Summary of What I Understood (For Your Confirmation):</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap font-serif-body text-sm text-stone-800">
                      {m.summaryOfUnderstanding}
                    </p>
                    <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-amber-800">
                        Does this match what you experienced?
                      </span>
                      <button
                        onClick={() => onConfirmUnderstanding(true)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Yes, that is accurate</span>
                      </button>
                      <button
                        onClick={() => onConfirmUnderstanding(false)}
                        className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-amber-300 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        Let me clarify something
                      </button>
                    </div>
                  </div>
                )}

                {/* If Ghostwriter produced or revised the Draft, show full draft in chat */}
                {m.hasDraft && m.letterDraft && (
                  <div className="bg-white border-2 border-[#003262]/20 rounded-xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#003262]">
                        <FileText className="w-4 h-4" />
                        <span>Formal Complaint Letter Draft</span>
                      </div>
                      <button
                        onClick={onJumpToDraft}
                        className="flex items-center gap-1 text-xs text-[#003262] font-semibold hover:underline cursor-pointer"
                      >
                        <span>Open in Document Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-stone-50 rounded border border-stone-200 max-h-56 overflow-y-auto text-xs font-serif-body leading-relaxed whitespace-pre-wrap text-stone-800">
                      {m.letterDraft}
                    </div>

                    {/* Unresolved items checklist if any */}
                    {m.unresolvedItems && m.unresolvedItems.length > 0 && (
                      <div className="bg-stone-50 p-2.5 rounded border border-stone-200 text-xs">
                        <span className="font-medium text-stone-700 block mb-1 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Parts in [brackets] to decide or check:</span>
                        </span>
                        <ul className="list-disc list-inside text-stone-600 space-y-0.5 text-[11px]">
                          {m.unresolvedItems.map((item, idx) => (
                            <li key={idx} className="font-mono-code text-stone-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Revision options (Option A vs Option B) when refining */}
                {m.revisionOptions && m.revisionOptions.optionA && (
                  <div className="bg-stone-100/80 border border-stone-300/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                      <SplitSquareVertical className="w-4 h-4 text-[#003262]" />
                      <span>Choose Preferred Phrasing:</span>
                    </div>
                    {m.revisionOptions.explanation && (
                      <p className="text-xs text-stone-600 italic">
                        {m.revisionOptions.explanation}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() =>
                          onSelectRevisionOption(
                            `I prefer Version A: "${m.revisionOptions!.optionA}"`
                          )
                        }
                        className="text-left p-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#003262] rounded-lg transition-all text-xs font-serif-body text-stone-800 space-y-1 group cursor-pointer"
                      >
                        <span className="font-sans-body font-semibold text-[11px] text-[#003262] block">
                          Version A
                        </span>
                        <p>"{m.revisionOptions.optionA}"</p>
                      </button>
                      <button
                        onClick={() =>
                          onSelectRevisionOption(
                            `I prefer Version B: "${m.revisionOptions!.optionB}"`
                          )
                        }
                        className="text-left p-3 bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#003262] rounded-lg transition-all text-xs font-serif-body text-stone-800 space-y-1 group cursor-pointer"
                      >
                        <span className="font-sans-body font-semibold text-[11px] text-[#003262] block">
                          Version B
                        </span>
                        <p>"{m.revisionOptions.optionB}"</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* INLINE ERROR NOTICE: Small inline notice visually separate from agent replies */}
        {errorNotice && (
          <div className="max-w-2xl mx-auto my-2 p-3 bg-rose-50/90 border border-rose-200/90 rounded-xl text-xs text-rose-900 flex items-start justify-between gap-3 shadow-2xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-800">Connection or Model Call Failed</p>
                <p className="text-rose-700 text-[11px] mt-0.5 leading-relaxed">
                  {errorNotice.message}
                </p>
                <p className="text-stone-500 text-[10px] mt-1">
                  Your message has been saved in the conversation above. You can retry sending it or type a new message below.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onRetry}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Resend your last message"
              >
                <RotateCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
              <button
                type="button"
                onClick={onDismissError}
                className="p-1 text-rose-500 hover:text-rose-800 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                title="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Loading state indicator with Cancel control */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-[#003262] text-amber-300 font-serif-body shrink-0 flex items-center justify-center text-xs">
              M
            </div>
            <div className="p-4 bg-white border border-stone-200 rounded-2xl rounded-tl-xs shadow-2xs space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-600 font-medium truncate">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#003262] animate-pulse shrink-0"></span>
                  <span className="truncate">
                    {currentStage === 'listening' && 'Listening and capturing key challenges...'}
                    {currentStage === 'reflect' && 'Reflecting and structuring what you shared...'}
                    {currentStage === 'clarify' && 'Preparing clarifying questions...'}
                    {currentStage === 'draft' && 'Drafting the formal complaint letter...'}
                    {currentStage === 'revise' && 'Refining wording and tone...'}
                    {!['listening', 'reflect', 'clarify', 'draft', 'revise'].includes(currentStage) &&
                      'Ghostwriter is formulating response...'}
                  </span>
                </div>
                {/* Cancel control while call is in progress */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-rose-700 bg-stone-100 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="Stop waiting and cancel this request"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating "Jump to latest" button when user has scrolled up */}
      {!isAtBottom && messages.length > 0 && (
        <div className="absolute bottom-24 right-6 z-20">
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#003262] text-white shadow-md hover:bg-[#002244] rounded-full transition-all border border-white/20 animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Jump to latest</span>
          </button>
        </div>
      )}

      {/* Suggested quick follow-up chips when conversation is active */}
      {messages.length > 0 && !isLoading && (
        <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200/80 flex items-center gap-1.5 overflow-x-auto text-xs text-stone-600 shrink-0">
          <span className="text-[10px] text-stone-400 uppercase font-semibold shrink-0">
            Quick prompts:
          </span>
          <button
            onClick={() => onSendMessage('Can you generate the first full draft of the letter now?')}
            className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-300 rounded text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            Show me a draft
          </button>
          <button
            onClick={() =>
              onSendMessage("This one sentence doesn't sound like me, can you rephrase it?")
            }
            className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-300 rounded text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            Doesn't sound like me
          </button>
          <button
            onClick={() =>
              onSendMessage('Should I actually send this letter to the MDes office?')
            }
            className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-300 rounded text-[11px] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-stone-400" />
            <span>Should I send it?</span>
          </button>
          <button
            onClick={() =>
              onSendMessage(
                'Please emphasize the physical toll and lack of sleep more clearly without sounding whiny.'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-300 rounded text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            Emphasize physical toll
          </button>
        </div>
      )}

      {/* Input area: ALWAYS usable even after failure */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          {/* Dictation / Microphone button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              isListening
                ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
            }`}
            title={isListening ? 'Stop dictation' : 'Dictate your thoughts using microphone'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Textarea */}
          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me what you're experiencing, or ask to adjust the letter..."
              rows={2}
              className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262] resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#003262] text-white hover:bg-[#002244] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs cursor-pointer"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400 px-1">
          <span>Press Enter to send · Shift+Enter for new line</span>
          <span>Drafts are saved locally on your device</span>
        </div>
      </div>
    </div>
  );
};
