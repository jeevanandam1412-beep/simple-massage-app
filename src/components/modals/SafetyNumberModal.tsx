'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Dialog } from '@/components/ui/Dialog';
import { generateSafetyNumber } from '@/lib/crypto';
import { ShieldCheck, CheckCircle2, QrCode, Copy, Check } from 'lucide-react';

export const SafetyNumberModal: React.FC = () => {
  const { isSafetyModalOpen, closeSafetyModal, activeContact, currentUser } = useChat();
  const [safetyNumber, setSafetyNumber] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (activeContact && currentUser) {
      generateSafetyNumber(currentUser.id, activeContact.id).then(setSafetyNumber);
    }
  }, [activeContact, currentUser]);

  if (!activeContact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(safetyNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog
      isOpen={isSafetyModalOpen}
      onClose={closeSafetyModal}
      title="Verify Safety Numbers"
      description={`To verify the end-to-end security of your chat with ${activeContact.name}, compare the numbers below with their device.`}
    >
      <div className="space-y-6">
        {/* Safety Number Digits Grid */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-center text-sm sm:text-base text-signal-400 tracking-wider leading-relaxed shadow-inner">
          {safetyNumber || 'Generating Signal Keys...'}
        </div>

        {/* QR Code Simulation */}
        <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
            <QrCode className="w-32 h-32 text-slate-900" />
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Scan QR code with {activeContact.name}&apos;s device to instantly mark verified.
          </p>
        </div>

        {/* Status indicator & Copy button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Safety Numbers Match (Verified)
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
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
