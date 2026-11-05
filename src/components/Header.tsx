/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InteractionStage } from '../types';
import {
  FileText,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Columns2,
  MessageSquare,
  FileCheck,
  Zap,
  Info,
} from 'lucide-react';

interface HeaderProps {
  currentStage: InteractionStage;
  viewMode: 'split' | 'chat' | 'document';
  activeModel?: string;
  setViewMode: (mode: 'split' | 'chat' | 'document') => void;
  onOpenPolicyGuide: () => void;
  onOpenAudit: () => void;
  onOpenResetModal: () => void;
  onOpenDiagram: () => void;
  hasDraft: boolean;
}

const STAGES: { key: InteractionStage; label: string; step: number }[] = [
  { key: 'listening', label: 'Listen', step: 1 },
  { key: 'capture', label: 'Capture', step: 2 },
  { key: 'reflect', label: 'Reflect', step: 3 },
  { key: 'clarify', label: 'Clarify', step: 4 },
  { key: 'draft', label: 'Draft', step: 5 },
  { key: 'revise', label: 'Revise', step: 6 },
];

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  viewMode,
  activeModel,
  setViewMode,
  onOpenPolicyGuide,
  onOpenAudit,
  onOpenResetModal,
  onOpenDiagram,
  hasDraft,
}) => {
  const currentStepIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <header className="bg-[#003262] text-white border-b border-[#002244] shadow-sm sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif-body text-xl font-bold tracking-tight text-white">
                  Formal Complaint Ghostwriter
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30 font-medium">
                  Cohort 7
                </span>
                <span
                  className="text-[11px] px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-mono-code font-medium flex items-center gap-1"
                  title="Currently active lightweight Gemini model"
                >
                  <Zap className="w-3 h-3 text-emerald-300" />
                  <span>Model: {activeModel || 'gemini-3.1-flash-lite'}</span>
                </span>
              </div>
              <p className="text-xs text-stone-300">
                UC Berkeley Master of Design · Workload & Academic Scheduling Advocate
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-black/20 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white text-[#003262] shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Split Side-by-Side View"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode('chat')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'chat'
                    ? 'bg-white text-[#003262] shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Chat Focus"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Conversation</span>
              </button>
              <button
                onClick={() => setViewMode('document')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'document'
                    ? 'bg-white text-[#003262] shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Letter Document Focus"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Letter</span>
              </button>
            </div>

            {/* Audit button if draft exists */}
            {hasDraft && (
              <button
                onClick={onOpenAudit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 rounded-lg transition-colors"
                title="Audit Tone & Requirements"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Audit Draft</span>
              </button>
            )}

            {/* Policy & Recipient Guide */}
            <button
              onClick={onOpenPolicyGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 rounded-lg transition-colors"
              title="View MDes Program Office Guidelines"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">MDes Guidelines</span>
            </button>

            {/* Reset */}
            <button
              onClick={onOpenResetModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Reset Conversation and Letter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Info Button in Top Right Corner (next to Reset) */}
            <button
              onClick={onOpenDiagram}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors cursor-pointer shadow-xs border border-amber-300"
              title="System Diagram: How this app actually works"
              aria-label="Info - System Diagram"
            >
              <Info className="w-4 h-4 text-stone-950 shrink-0" />
              <span>Info</span>
            </button>
          </div>
        </div>

        {/* Interaction Loop Progression Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between overflow-x-auto text-xs py-1">
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <span className="text-[11px] text-stone-300 uppercase font-medium tracking-wider mr-1">
              Interaction Loop:
            </span>
            {STAGES.map((s, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={s.key} className="flex items-center gap-1 sm:gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                      isCurrent
                        ? 'bg-amber-400 text-stone-950 font-semibold shadow-xs'
                        : isPast
                        ? 'text-stone-300 bg-white/10 font-medium'
                        : 'text-stone-400'
                    }`}
                  >
                    <span className="text-[10px] opacity-75">{s.step}.</span>
                    <span>{s.label}</span>
                  </div>
                  {index < STAGES.length - 1 && (
                    <span className="text-white/20 text-[10px]">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
