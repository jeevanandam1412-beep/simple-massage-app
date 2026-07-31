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
    sendRealtimeMessage('Blinko Attachment', 'image', image);
  };

  const emojis = ['⚡', '🔒', '🚀', '👍', '🔥', '💯', '✨', '💻'];

  return (
    <div className="p-3 border-t border-[var(--border-subtle)] glass-panel relative z-20 flex-shrink-0 transition-colors">
      <form onSubmit={handleSend} className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendPhoto}
          className="p-2.5 rounded-2xl text-[var(--text-muted)] hover:text-indigo-500 hover:bg-[var(--bg-hover)] transition-all hover:scale-105"
          title="Send Attachment"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`Message #${activeChannel.name} on Blinko...`}
            value={text}
            onChange={handleInputChange}
            className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] rounded-full border border-[var(--border-subtle)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm pl-5 pr-11 py-3 transition-all shadow-inner"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-indigo-500 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full mb-3 right-0 glass-panel rounded-3xl p-3 shadow-2xl grid grid-cols-4 gap-2 z-30 animate-in zoom-in-95 border border-indigo-500/20">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setText((prev) => prev + emoji)}
                  className="text-xl p-2 hover:bg-[var(--bg-hover)] rounded-xl transition-transform hover:scale-125"
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
          className="p-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold disabled:opacity-50 transition-all active:scale-95 flex-shrink-0 shadow-lg shadow-indigo-500/25 hover:scale-105"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
