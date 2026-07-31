'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimestamp } from '@/lib/utils';
import { Lock, Radio, Zap } from 'lucide-react';

export const RealtimeThread: React.FC = () => {
  const { activeChannelId, activeChannel, messages, typingUsers, currentUser } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const channelMessages = activeChannelId ? messages[activeChannelId] || [] : [];
  const currentTyping = typingUsers.filter((t) => t.channelId === activeChannelId && t.isTyping);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length, typingUsers.length, activeChannelId]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-[var(--text-muted)] text-sm bg-[var(--bg-main)]">
        Select or create a channel to start messaging on Blinko.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-subtle)] bg-[var(--bg-main)] transition-colors">
      {/* Blitime Banner */}
      <div className="glass-panel rounded-3xl p-6 mb-4 shadow-xl transition-all border border-indigo-500/20">
        <div className="flex items-center gap-2 font-black text-xl text-[var(--text-main)] mb-1">
          <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
          <span># {activeChannel.name}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xl">
          {activeChannel.description || 'Welcome to Blinko instant real-time messaging.'}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-indigo-500 font-mono font-bold">
          <span className="flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Blinko Signal Stream Connected
          </span>
        </div>
      </div>

      {/* Message List Stream */}
      {channelMessages.length === 0 ? (
        <div className="text-center py-10 text-xs text-[var(--text-muted)] font-mono">
          No messages yet in #{activeChannel.name}. Send the first Blinko message!
        </div>
      ) : (
        channelMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          const senderName = msg.sender?.full_name || (isMe ? currentUser.full_name : 'Teammate');
          const senderAvatar = msg.sender?.avatar_url || (isMe ? currentUser.avatar_url : undefined);

          return (
            <div key={msg.id} className="flex gap-3 group hover:bg-[var(--bg-hover)] p-2.5 rounded-2xl transition-colors">
              <Avatar
                src={senderAvatar}
                fallback={senderName}
                status="online"
                size="md"
                color="bg-indigo-600 text-white font-bold"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-[var(--text-main)]">{senderName}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {formatTimestamp(msg.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-indigo-500 font-bold bg-indigo-500/10 px-2 py-0.2 rounded-full border border-indigo-500/20">
                    <Lock className="w-2.5 h-2.5" /> E2EE
                  </span>
                </div>

                {msg.type === 'text' && (
                  <p className="text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                )}

                {msg.type === 'image' && (
                  <div className="space-y-2 mt-1">
                    <img
                      src={msg.media_url}
                      alt="Attachment"
                      className="max-w-md max-h-72 rounded-2xl border border-[var(--border-subtle)] object-cover shadow-lg"
                    />
                    {msg.content && <p className="text-sm text-[var(--text-main)]">{msg.content}</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Realtime Typing Indicator */}
      {currentTyping.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-indigo-500 font-mono glass-pill px-4 py-2 rounded-full w-fit animate-pulse font-bold shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span>
            {currentTyping.map((t) => t.userName).join(', ')}{' '}
            {currentTyping.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
