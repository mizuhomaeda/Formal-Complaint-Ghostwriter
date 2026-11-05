/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DraftVersion } from '../types';
import {
  Copy,
  Check,
  Printer,
  Download,
  Edit3,
  Eye,
  History,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface DocumentPanelProps {
  draft: string;
  onUpdateDraft: (newDraft: string) => void;
  versions: DraftVersion[];
  onRestoreVersion: (version: DraftVersion) => void;
  onOpenQuickFill: (placeholder: string) => void;
  onRequestFirstDraft: () => void;
}

export const DocumentPanel: React.FC<DocumentPanelProps> = ({
  draft,
  onUpdateDraft,
  versions,
  onRestoreVersion,
  onOpenQuickFill,
  onRequestFirstDraft,
}) => {
  const [isDirectEditing, setIsDirectEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Parse bracketed placeholders
  const placeholders = draft ? Array.from(new Set(draft.match(/\[(.*?)\]/g) || [])) : [];

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = draft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!draft) return;
    const blob = new Blob([draft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MDes_Cohort7_Workload_Letter_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to render letter with interactive brackets
  const renderInteractiveLetter = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <button
            key={index}
            onClick={() => onOpenQuickFill(part)}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 text-xs font-mono-code bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded font-semibold cursor-pointer transition-colors shadow-2xs hover:scale-105"
            title="Click to fill in this detail"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-stone-100/90 relative overflow-hidden">
      {/* Document Workspace Toolbar */}
      <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap no-print">
        <div className="flex items-center gap-2">
          <span className="font-serif-body font-bold text-stone-900 text-sm">
            Formal Letter Document
          </span>
          {draft && placeholders.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>{placeholders.length} in [brackets]</span>
            </span>
          )}
          {draft && placeholders.length === 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>All brackets filled</span>
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Toggle Direct Edit Mode */}
          {draft && (
            <button
              onClick={() => setIsDirectEditing(!isDirectEditing)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                isDirectEditing
                  ? 'bg-[#003262] text-white border-[#003262]'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
              title="Toggle direct text editing"
            >
              {isDirectEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isDirectEditing ? 'Preview Mode' : 'Direct Edit'}</span>
            </button>
          )}

          {/* Version History Toggle */}
          {versions.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg transition-colors"
              title="View revision history"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">History ({versions.length})</span>
            </button>
          )}

          {/* Copy Button */}
          {draft && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
              title="Copy letter to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}

          {/* Download Text */}
          {draft && (
            <button
              onClick={handleDownload}
              className="p-1.5 bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 rounded-lg transition-colors"
              title="Download text file (.txt)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Print / Save PDF */}
          {draft && (
            <button
              onClick={handlePrint}
              className="p-1.5 bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 rounded-lg transition-colors"
              title="Print / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Document Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
        {draft ? (
          <div className="w-full max-w-3xl space-y-4">
            {/* Version History Drawer (if open) */}
            {showHistory && (
              <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-md space-y-3 no-print">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs uppercase tracking-wider text-stone-700">
                    Draft Revision History
                  </span>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-xs text-stone-400 hover:text-stone-700"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {versions.map((v, idx) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs"
                    >
                      <div>
                        <span className="font-medium text-stone-900 block">{v.label}</span>
                        <span className="text-[11px] text-stone-500">
                          {new Date(v.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onRestoreVersion(v);
                          setShowHistory(false);
                        }}
                        className="px-2.5 py-1 text-xs text-[#003262] font-semibold hover:bg-white rounded border border-[#003262]/20 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If in Direct Edit Mode */}
            {isDirectEditing ? (
              <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                  <span>Direct Editing Mode (You have complete final control)</span>
                  <button
                    onClick={() => setIsDirectEditing(false)}
                    className="text-[#003262] font-semibold hover:underline"
                  >
                    Done Editing
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => onUpdateDraft(e.target.value)}
                  rows={25}
                  className="w-full text-stone-900 font-serif-body text-base leading-relaxed p-4 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262] resize-y"
                />
              </div>
            ) : (
              /* High-fidelity Letter Preview Paper */
              <div className="letter-paper-print bg-white rounded-xl shadow-lg border border-stone-200/90 p-8 sm:p-12 relative text-stone-900 font-serif-body text-base leading-relaxed min-h-[700px]">
                {/* Academic Letterhead Watermark / Header */}
                <div className="border-b-2 border-[#003262] pb-6 mb-8 flex justify-between items-start gap-4">
                  <div>
                    <h2 className="font-bold text-lg text-[#003262] tracking-wide uppercase font-sans-body">
                      University of California, Berkeley
                    </h2>
                    <p className="text-xs text-stone-600 font-sans-body tracking-wider uppercase">
                      Master of Design (MDes) · Jacobs Hall
                    </p>
                  </div>
                  <div className="text-right text-xs text-stone-500 font-sans-body hidden sm:block">
                    <p>Jacobs Institute for Design Innovation</p>
                    <p>2530 Ridge Road, Berkeley, CA</p>
                  </div>
                </div>

                {/* Letter Body with Interactive Brackets */}
                <div className="whitespace-pre-wrap selection:bg-amber-100">
                  {renderInteractiveLetter(draft)}
                </div>

                {/* Interactive helper banner at bottom of document */}
                {placeholders.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500 font-sans-body no-print bg-stone-50/70 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-4 rounded-b-xl">
                    <span className="flex items-center gap-1.5 text-amber-900 font-medium">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Click on any highlighted yellow badge above to fill in details.</span>
                    </span>
                    <button
                      onClick={() => onOpenQuickFill(placeholders[0])}
                      className="text-xs font-semibold text-[#003262] hover:underline"
                    >
                      Fill Next: {placeholders[0]}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Empty state before draft generation */
          <div className="my-auto max-w-md text-center p-8 bg-white/70 rounded-2xl border border-dashed border-stone-300 space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center font-serif-body font-bold text-xl">
              §
            </div>
            <div>
              <h3 className="font-serif-body font-semibold text-stone-900 text-lg mb-1">
                Your Formal Letter Will Form Here
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                As you speak with the Ghostwriter on the left, it will listen, capture your key
                challenges, summarize what it understood, and generate the full formal letter draft.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onRequestFirstDraft}
                className="px-4 py-2 bg-[#003262] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask Ghostwriter to Start First Draft</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-400 italic">
              Missing dates or course names will be placed in [brackets] for you to fill in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
