/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Building2, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { M_DES_INFO } from '../data/sampleJourneys';

interface PolicyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyGuideModal: React.FC<PolicyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#003262] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-serif-body text-xl font-bold tracking-wide">
                MDes Program Office Context & Guidelines
              </h2>
              <p className="text-xs text-stone-200">
                UC Berkeley Master of Design · Jacobs Hall · Cohort 7
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-stone-700 max-h-[75vh] overflow-y-auto">
          {/* Who is the recipient */}
          <div>
            <h3 className="font-semibold text-stone-900 flex items-center gap-2 text-base mb-2">
              <Building2 className="w-4 h-4 text-[#003262]" />
              The Recipient: MDes Program Office
            </h3>
            <p className="text-stone-600 mb-3 leading-relaxed">
              The letter is addressed to the staff who administer the Master of Design program at UC Berkeley, based in Jacobs Hall.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                <span className="font-medium text-stone-900 block mb-1">What the Office Handles:</span>
                <ul className="space-y-1 text-xs text-stone-600">
                  {M_DES_INFO.jurisdiction.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                <span className="font-medium text-amber-900 block mb-1">What the Office Does NOT Handle:</span>
                <ul className="space-y-1 text-xs text-amber-800">
                  {M_DES_INFO.notInJurisdiction.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* What a formal letter does */}
          <div className="border-t border-stone-200 pt-5">
            <h3 className="font-semibold text-stone-900 flex items-center gap-2 text-base mb-2">
              <FileText className="w-4 h-4 text-[#003262]" />
              Purpose & Boundaries of a Formal Letter
            </h3>
            <ul className="space-y-2 text-stone-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#003262] font-bold">•</span>
                <span>
                  <strong>Establishes an official written record:</strong> When verbal conversations in office hours lead to no follow-up, a written letter documents the issue for program administrators.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#003262] font-bold">•</span>
                <span>
                  <strong>Tone is firm, not hostile:</strong> Focuses cleanly on systemic scheduling, conflicting studio deliverables, and health impacts, without personal attacks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#003262] font-bold">•</span>
                <span>
                  <strong>Does not promise guaranteed outcomes:</strong> While you can request a specific timeline (e.g. "a response by Friday next week"), the letter cannot force an outcome.
                </span>
              </li>
            </ul>
          </div>

          {/* Active AI Model Configuration */}
          <div className="border-t border-stone-200 pt-5">
            <h3 className="font-semibold text-stone-900 flex items-center gap-2 text-base mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active AI Model & Engine Capacity
            </h3>
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Configured Model:</span>
                <span className="font-mono-code font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                  gemini-flash-lite-latest
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Automatic Fallback:</span>
                <span className="font-mono-code text-stone-700 bg-stone-200/70 px-2 py-0.5 rounded">
                  gemini-3.5-flash-lite
                </span>
              </div>
              <p className="text-stone-600 pt-1 leading-relaxed">
                The agent is configured to use Google's lightweight and fastest Gemini Flash Lite model. This provides sub-second responses and high capacity availability to prevent 503 high-demand queuing errors.
              </p>
            </div>
          </div>

          {/* Ghostwriter Guarantees */}
          <div className="border-t border-stone-200 pt-5 bg-stone-50 -mx-6 -mb-6 p-6">
            <h3 className="font-semibold text-stone-900 flex items-center gap-2 text-base mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Ghostwriter Commitments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
              <div className="p-2.5 bg-white rounded border border-stone-200">
                <strong className="block text-stone-900 mb-0.5">You Maintain 100% Control</strong>
                The ghostwriter never sends anything. You review every word and decide when or if to send.
              </div>
              <div className="p-2.5 bg-white rounded border border-stone-200">
                <strong className="block text-stone-900 mb-0.5">Zero Exaggeration</strong>
                The agent will never invent facts, drama, or alter your intended meaning.
              </div>
              <div className="p-2.5 bg-white rounded border border-stone-200">
                <strong className="block text-stone-900 mb-0.5">No Pressure</strong>
                If you feel uncertain (like Theo), having it written down helps you gain clarity before making a decision.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#003262] text-white rounded-lg hover:bg-[#002244] transition-colors"
          >
            Understood, return to workspace
          </button>
        </div>
      </div>
    </div>
  );
};
