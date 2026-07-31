'use client';

import React, { useState, useRef } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Send, Paperclip, Smile } from 'lucide-react';

export const RealtimeComposer: React.FC = () => {
  const { activeChannel, sendRealtimeMessage, sendTypingSignal } = useChat();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<any>(null);

  if (!activeChannel) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    sendTypingSignal(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingSignal(false);
    }, 2000);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    sendRealtimeMessage(text.trim());
    setText('');
    setShowEmojiPicker(false);
    sendTypingSignal(false);
  };

  const handleSendPhoto = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    ];
    const image = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    sendRealtimeMessage('Realtime Attachment', 'image', image);
  };

  const emojis = ['⚡', '🔒', '🚀', '👍', '🔥', '💯', '✨', '💻'];

  return (
    <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-md relative z-20 flex-shrink-0 transition-colors">
      <form onSubmit={handleSend} className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendPhoto}
          className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Send Attachment"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`Message #${activeChannel.name} over WebSockets...`}
            value={text}
            onChange={handleInputChange}
            className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] rounded-2xl border border-[var(--border-subtle)] focus:border-[var(--text-main)] outline-none text-sm pl-4 pr-10 py-3 transition-all"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 right-0 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-3 shadow-2xl grid grid-cols-4 gap-2 z-30 animate-in zoom-in-95">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setText((prev) => prev + emoji)}
                  className="text-lg p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="p-3 rounded-2xl bg-[var(--text-main)] text-[var(--bg-main)] font-bold disabled:opacity-50 transition-transform active:scale-95 flex-shrink-0 shadow hover:opacity-90"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
