/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  ArrowRight,
  ShieldAlert,
  Cpu,
  User,
  FileCode,
  BookOpen,
  Eye,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel?: string;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({
  isOpen,
  onClose,
  activeModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#003262] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif-body text-xl font-bold tracking-wide flex items-center gap-2">
              <span>System Diagram: How This App Actually Works</span>
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Left-to-right architecture showing input, standing role card, knowledge selection, token-by-token generation, and output
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close architecture modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-stone-800">
          {/* Legend Banner */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
              Diagram Key & Legend:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></span>
                <span className="font-medium text-blue-900">Always the same on every run (Static)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400"></span>
                <span className="font-medium text-emerald-900">Different each time (Dynamic)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-400"></span>
                <span className="font-medium text-rose-900">Never given to the model (Forbidden)</span>
              </div>
            </div>
          </div>

          {/* Horizontal Flow Diagram: Left to Right */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
              Execution Pipeline (Left to Right Flow):
            </h3>

            {/* Diagram Containers: 5 sequential stages */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch">
              {/* STAGE 1: User Input */}
              <div className="bg-emerald-50/70 border-2 border-emerald-400 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs relative">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 uppercase tracking-wider">
                      Different Each Time
                    </span>
                    <span className="text-xs font-mono-code text-stone-400">01</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 flex items-center gap-1.5 text-sm mb-1">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>User's Message (Input)</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 mt-2">
                    <li>• Student's raw experience or story</li>
                    <li>• Clarifications & answers to follow-ups</li>
                    <li>• Previous turns in conversation history</li>
                    <li>• Current letter draft in workspace (if already written)</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-medium">
                  → Sent with each new request
                </div>
              </div>

              {/* STAGE 2: System Instructions (Role Card) */}
              <div className="bg-blue-50/70 border-2 border-blue-400 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs relative">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900 uppercase tracking-wider">
                      Always The Same
                    </span>
                    <span className="text-xs font-mono-code text-stone-400">02</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 flex items-center gap-1.5 text-sm mb-1">
                    <FileCode className="w-4 h-4 text-blue-700" />
                    <span>Standing System Instructions (Role Card)</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 mt-2">
                    <li>• Identity: Formal Complaint Ghostwriter</li>
                    <li>• Audience: UC Berkeley MDes Cohort 7</li>
                    <li>• Tone: Serious, collegial, polite, firm</li>
                    <li>• Zero Assumptions: Never assert facts the user has not typed</li>
                    <li>• Design intent is NOT user history: starts with zero user facts</li>
                    <li>• 6-Step Loop: Listen → Capture → Reflect → Clarify → Draft → Revise</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-blue-200/80 text-[11px] text-blue-800 font-medium">
                  → Pre-pended to every prompt payload
                </div>
              </div>

              {/* STAGE 3: Knowledge (Letter Structure & Recipient) - Always Included in Full */}
              <div className="bg-blue-50/70 border-2 border-blue-400 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs relative">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900 uppercase tracking-wider">
                      Always The Same
                    </span>
                    <span className="text-xs font-mono-code text-stone-400">03</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 flex items-center gap-1.5 text-sm mb-1">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span>Knowledge (Letter & Recipient)</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 mt-2">
                    <li>• <strong className="text-blue-950">Included in full every single time:</strong> There is no retrieval or selection step.</li>
                    <li>• <strong>Letter Structure:</strong> All 10 sections (header, subject, issue, timeline, well-being, requested action, signature) are sent in full on every exchange.</li>
                    <li>• <strong>Recipient Context:</strong> MDes Program Office at Jacobs Hall, academic calendar boundaries, and non-jurisdiction over grades are sent in full on every exchange.</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-blue-200/80 text-[11px] text-blue-800 font-medium">
                  → Part of static system instruction
                </div>
              </div>

              {/* STAGE 4: Model & Token Generation */}
              <div className="bg-emerald-50/70 border-2 border-emerald-400 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs relative">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 uppercase tracking-wider">
                      Different Each Time
                    </span>
                    <span className="text-xs font-mono-code text-stone-400">04</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 flex items-center gap-1.5 text-sm mb-1">
                    <Cpu className="w-4 h-4 text-emerald-700" />
                    <span>The Model (Token-by-Token)</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 mt-2">
                    <li>• Active Model: <span className="font-mono-code font-bold text-stone-900">{activeModel || 'gemini-3.1-flash-lite'}</span></li>
                    <li>• <strong className="text-stone-900">Sequential Token Generation:</strong> Produces response one token (word/fragment) at a time based on preceding tokens</li>
                    <li>• Constrained to valid JSON matching the Ghostwriter response schema</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-medium">
                  → Generates structured output stream
                </div>
              </div>

              {/* STAGE 5: Response User Sees */}
              <div className="bg-emerald-50/70 border-2 border-emerald-400 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs relative">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 uppercase tracking-wider">
                      Different Each Time
                    </span>
                    <span className="text-xs font-mono-code text-stone-400">05</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 flex items-center gap-1.5 text-sm mb-1">
                    <Eye className="w-4 h-4 text-emerald-700" />
                    <span>Response User Sees (Output)</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 mt-2">
                    <li>• Conversational reply in chat feed</li>
                    <li>• Summary of understanding confirmation card</li>
                    <li>• Full formal complaint letter in live paper workspace</li>
                    <li>• Bracketed items checklist (e.g. <span className="font-mono-code">[Course]</span>)</li>
                    <li>• Revision options (Option A vs B)</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-medium">
                  → Rendered in browser UI
                </div>
              </div>
            </div>
          </div>

          {/* CRITICAL BOUNDARY SECTION: What the Model is NEVER Given */}
          <div className="bg-rose-50/90 border-2 border-rose-300 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
              <h3 className="font-bold text-rose-950 text-sm uppercase tracking-wider">
                What The Model Is NEVER Given (Strict Operational Boundaries)
              </h3>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              To safeguard student privacy and academic autonomy, the model operates in a closed environment with strict exclusions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-lg border border-rose-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold mb-0.5">
                    No Direct Email or Submission Permissions
                  </strong>
                  <span className="text-stone-600">
                    The model cannot send emails or file complaints on your behalf. You must copy, print, or export the letter and send it yourself.
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-rose-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold mb-0.5">
                    No CalCentral, Grade, or Academic History Access
                  </strong>
                  <span className="text-stone-600">
                    The model has zero connection to university databases, student records, GPA, private instructor communications, or transcripts.
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-rose-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold mb-0.5">
                    No Personal Passwords or CalNet Credentials
                  </strong>
                  <span className="text-stone-600">
                    Student authentication credentials and sensitive identifiers are never requested, stored, or transmitted to the model.
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-rose-200 flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold mb-0.5">
                    No Shared Data Across Other Students
                  </strong>
                  <span className="text-stone-600">
                    Your conversation is stored only in your local browser storage. The model never sees drafts or messages from other students.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Comparison Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
              Pipeline Component Summary
            </div>
            <div className="divide-y divide-stone-200 text-xs">
              <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
                <span className="font-semibold text-stone-900">User Message</span>
                <span className="text-emerald-700 font-medium">Changes each turn</span>
                <span className="text-stone-600">Student's lived experiences, dates, specific challenges</span>
              </div>
              <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50/50">
                <span className="font-semibold text-stone-900">System Role Card</span>
                <span className="text-blue-700 font-medium">Always identical</span>
                <span className="text-stone-600">Ghostwriter persona, 6-step loop, tone rules, non-decision boundary</span>
              </div>
              <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-blue-50/30">
                <span className="font-semibold text-stone-900">Knowledge (Letter & Recipient)</span>
                <span className="text-blue-700 font-medium">Always identical (included in full)</span>
                <span className="text-stone-600">All 10 letter structure sections and Jacobs Hall jurisdiction are sent in full every turn; no selection step exists</span>
              </div>
              <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50/50">
                <span className="font-semibold text-stone-900">Model Token Stream</span>
                <span className="text-emerald-700 font-medium">One token at a time</span>
                <span className="text-stone-600">Autoregressive generation via gemini-3.1-flash-lite (with fallback to gemini-3.8-flash)</span>
              </div>
              <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white">
                <span className="font-semibold text-stone-900">UI Output</span>
                <span className="text-emerald-700 font-medium">Changes each turn</span>
                <span className="text-stone-600">Chat response, live letter draft, and bracketed fill-in chips</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#003262] text-white rounded-lg hover:bg-[#002244] transition-colors cursor-pointer"
          >
            Close System Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
