'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimestamp } from '@/lib/utils';
import { Lock, Radio, ShieldCheck } from 'lucide-react';

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
      <div className="flex-1 flex items-center justify-center p-6 text-center text-zinc-500 text-sm">
        Select or create a channel to start real-time messaging.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 bg-black dark:bg-black light:bg-white transition-colors">
      {/* Realtime Channel Banner */}
      <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-2xl p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-lg text-zinc-100 dark:text-zinc-100 light:text-zinc-900 mb-1">
          <span># {activeChannel.name}</span>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed max-w-xl">
          {activeChannel.description || 'This channel is connected to Live Supabase WebSockets.'}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-emerald-400 font-mono">
          <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Database Stream Connected
          </span>
        </div>
      </div>

      {/* Message List Stream */}
      {channelMessages.length === 0 ? (
        <div className="text-center py-10 text-xs text-zinc-500 font-mono">
          No messages yet in #{activeChannel.name}. Send the first real-time message!
        </div>
      ) : (
        channelMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          const senderName = msg.sender?.full_name || (isMe ? currentUser.full_name : 'Teammate');
          const senderAvatar = msg.sender?.avatar_url || (isMe ? currentUser.avatar_url : undefined);

          return (
            <div key={msg.id} className="flex gap-3 group hover:bg-zinc-900/60 dark:hover:bg-zinc-900/60 light:hover:bg-zinc-100 p-2 rounded-xl transition-colors">
              <Avatar
                src={senderAvatar}
                fallback={senderName}
                status="online"
                size="md"
                color="bg-white text-black"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-zinc-100 dark:text-zinc-100 light:text-zinc-900">{senderName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {formatTimestamp(msg.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-zinc-400 font-medium bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 px-1.5 py-0.2 rounded-full border border-zinc-700 dark:border-zinc-700 light:border-zinc-300">
                    <Lock className="w-2.5 h-2.5" /> E2EE
                  </span>
                </div>

                {msg.type === 'text' && (
                  <p className="text-sm text-zinc-200 dark:text-zinc-200 light:text-zinc-800 leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                )}

                {msg.type === 'image' && (
                  <div className="space-y-2 mt-1">
                    <img
                      src={msg.media_url}
                      alt="Attachment"
                      className="max-w-md max-h-72 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 object-cover shadow-md"
                    />
                    {msg.content && <p className="text-sm text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{msg.content}</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Realtime Typing Indicator */}
      {currentTyping.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full w-fit animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
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
