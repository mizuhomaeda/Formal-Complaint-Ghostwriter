/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, AlertTriangle, HelpCircle, Shield, ArrowRight } from 'lucide-react';

interface ToneAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: string;
  onJumpToPlaceholder?: (placeholder: string) => void;
}

export const ToneAuditModal: React.FC<ToneAuditModalProps> = ({
  isOpen,
  onClose,
  draft,
  onJumpToPlaceholder,
}) => {
  if (!isOpen) return null;

  // Extract all [bracketed] placeholders
  const matches = draft.match(/\[(.*?)\]/g) || [];
  const bracketCount = matches.length;

  // Checks
  const checks = [
    {
      title: 'Target Recipient & Jurisdiction',
      passed: draft.toLowerCase().includes('mdes') || draft.toLowerCase().includes('jacobs hall'),
      desc: 'Letter properly addresses the MDes Program Office at Jacobs Hall rather than individual course professors.',
    },
    {
      title: 'Workload & Scheduling Focus',
      passed:
        draft.toLowerCase().includes('workload') ||
        draft.toLowerCase().includes('schedule') ||
        draft.toLowerCase().includes('deadline') ||
        draft.toLowerCase().includes('deliverables'),
      desc: 'Grounds the complaint in structural scheduling constraints, concurrent milestones, or pacing.',
    },
    {
      title: 'Collegial & Professional Demeanor',
      passed:
        !draft.toLowerCase().includes('incompetent') &&
        !draft.toLowerCase().includes('ridiculous') &&
        !draft.toLowerCase().includes('hate') &&
        (draft.toLowerCase().includes('respectfully') ||
          draft.toLowerCase().includes('appreciate') ||
          draft.toLowerCase().includes('bring to your attention')),
      desc: 'Maintains firm yet respectful and collaborative language without hostile attacks.',
    },
    {
      title: 'Health & Well-being Impact Grounding',
      passed:
        draft.toLowerCase().includes('health') ||
        draft.toLowerCase().includes('sleep') ||
        draft.toLowerCase().includes('well-being') ||
        draft.toLowerCase().includes('sustainable') ||
        draft.toLowerCase().includes('strain'),
      desc: 'Clearly details the human toll (physical fatigue, sleep loss, sustained stress) without hyperbolic drama.',
    },
    {
      title: 'Constructive Requested Remedy',
      passed:
        draft.toLowerCase().includes('request') ||
        draft.toLowerCase().includes('suggest') ||
        draft.toLowerCase().includes('coordinate') ||
        draft.toLowerCase().includes('opportunity to discuss') ||
        draft.toLowerCase().includes('response by'),
      desc: 'Specifies concrete next steps (e.g. cross-course calendar coordination, cohort discussion, or milestone review).',
    },
  ];

  const allPassed = checks.every((c) => c.passed) && bracketCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-[#003262] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-serif-body text-xl font-bold tracking-wide">
                Letter Quality & Collegiality Audit
              </h2>
              <p className="text-xs text-stone-200">
                Checking against UC Berkeley MDes standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm">
          {/* Missing bracket items */}
          <div
            className={`p-4 rounded-lg border ${
              bracketCount === 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center justify-between font-semibold mb-1">
              <span className="flex items-center gap-2">
                {bracketCount === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                {bracketCount === 0
                  ? 'All Bracketed Placeholders Resolved'
                  : `${bracketCount} Placeholders Remaining in Brackets`}
              </span>
            </div>
            {bracketCount > 0 ? (
              <div>
                <p className="text-xs text-amber-800 mb-2">
                  Replace these with your exact dates, course names, and names before sending:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {Array.from(new Set(matches)).map((ph, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onClose();
                        onJumpToPlaceholder?.(ph);
                      }}
                      className="px-2 py-1 text-xs bg-white border border-amber-300 rounded font-mono-code text-amber-900 hover:bg-amber-100 flex items-center gap-1 transition-colors"
                      title="Click to jump and fill in"
                    >
                      <span>{ph}</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-700">
                No unresolved square brackets found. The letter is complete and personalized.
              </p>
            )}
          </div>

          {/* Core Audit Criteria */}
          <div className="space-y-3">
            <h3 className="font-semibold text-stone-900 text-xs tracking-wider uppercase">
              Tone & Composition Checklist
            </h3>
            {checks.map((check, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 bg-stone-50"
              >
                {check.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium text-stone-900 text-sm">{check.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-600">
            <strong>Remember:</strong> You are not obligated to send this letter immediately, or at all. Having it drafted provides clarity, perspective, and a concrete record whenever you choose to act.
          </div>
        </div>

        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-between items-center">
          <span className="text-xs text-stone-500 font-medium">
            {allPassed ? '✓ Ready for review & export' : 'Review items above at your pace'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#003262] text-white rounded-lg hover:bg-[#002244] transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
