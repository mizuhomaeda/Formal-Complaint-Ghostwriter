/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <span className="font-serif-body text-base font-semibold">
              Reset Conversation & Letter
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-stone-700">
          <p className="leading-relaxed">
            Are you sure you want to reset? This action will permanently clear:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
            <li>The entire conversation history with the Ghostwriter</li>
            <li>The current letter draft and all saved versions</li>
            <li>The Interaction Loop, resetting it back to Step 1 (Listen)</li>
          </ul>
          <p className="text-xs text-rose-700 font-medium">
            This cannot be undone. Any unsaved letter text will be lost.
          </p>
        </div>

        <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yes, Reset Everything</span>
          </button>
        </div>
      </div>
    </div>
  );
};
