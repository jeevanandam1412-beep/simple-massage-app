'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ShieldCheck, Lock, Sparkles, Key } from 'lucide-react';

export const MessageThread: React.FC = () => {
  const { activeChatId, messages, activeContact, openSafetyModal } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeChatId]);

  if (!activeChatId || !activeContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950/40 select-none">
        <div className="w-20 h-20 rounded-full bg-signal-600/10 border border-signal-500/20 flex items-center justify-center mb-4 shadow-xl">
          <Lock className="w-10 h-10 text-signal-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">Signal for Web</h3>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
          Send end-to-end encrypted messages, voice notes, photos, and files securely across all devices.
        </p>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 font-medium">
          <ShieldCheck className="w-4 h-4" />
          End-to-End Encryption Powered by Web Crypto
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 bg-slate-950/20">
      {/* Encryption Banner Header */}
      <div className="flex justify-center my-2">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 text-center max-w-md shadow-lg backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-signal-600/20 text-signal-400 mx-auto flex items-center justify-center mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-200 mb-1">
            End-to-End Encrypted Session
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Messages and calls are secured with Signal protocol encryption. No third party can access content.
          </p>
          <button
            onClick={openSafetyModal}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-400 hover:text-signal-300 bg-signal-500/10 hover:bg-signal-500/20 border border-signal-500/30 px-3 py-1 rounded-full transition-colors"
          >
            <Key className="w-3.5 h-3.5" /> Verify Safety Numbers
          </button>
        </div>
      </div>

      {/* Messages */}
      {activeMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
