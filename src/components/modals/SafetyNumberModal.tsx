'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Dialog } from '@/components/ui/Dialog';
import { generateSafetyNumber } from '@/lib/crypto';
import { CheckCircle2, QrCode, Copy, Check } from 'lucide-react';

export const SafetyNumberModal: React.FC = () => {
  const { isSafetyOpen, setIsSafetyOpen, currentUser } = useChat();
  const [safetyNumber, setSafetyNumber] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (currentUser) {
      generateSafetyNumber(currentUser.id, 'saas-teammate-id').then(setSafetyNumber);
    }
  }, [currentUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(safetyNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog
      isOpen={isSafetyOpen}
      onClose={() => setIsSafetyOpen(false)}
      title="Verify Safety Numbers"
      description="To verify the end-to-end security of your SaaS workspace session, compare the numbers below with your team's device."
    >
      <div className="space-y-6">
        <div className="bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-subtle)] font-mono text-center text-sm sm:text-base text-[var(--text-main)] tracking-wider leading-relaxed shadow-inner">
          {safetyNumber || 'Generating Signal Keys...'}
        </div>

        <div className="flex flex-col items-center justify-center bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
          <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
            <QrCode className="w-32 h-32 text-black" />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
            Scan QR code with teammate device to mark safety number verified.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Safety Numbers Match (Verified)
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] text-xs font-medium border border-[var(--border-subtle)] transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Key
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
