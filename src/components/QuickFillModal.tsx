/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface QuickFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder: string;
  onReplace: (placeholder: string, replacement: string) => void;
}

export const QuickFillModal: React.FC<QuickFillModalProps> = ({
  isOpen,
  onClose,
  placeholder,
  onReplace,
}) => {
  const [replacement, setReplacement] = useState('');

  useEffect(() => {
    setReplacement('');
  }, [placeholder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replacement.trim()) {
      onReplace(placeholder, replacement.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="bg-[#003262] text-white px-5 py-3.5 flex items-center justify-between">
          <span className="font-serif-body text-base font-semibold">Fill In Placeholder</span>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
              Current Bracket
            </label>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-mono-code text-sm font-medium">
              {placeholder}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Replace With Your Actual Information:
            </label>
            <input
              type="text"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="e.g., DES INV 202, October 24th, 3 weeks in a row..."
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262]"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replacement.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#003262] text-white rounded-lg hover:bg-[#002244] disabled:opacity-50 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Letter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
