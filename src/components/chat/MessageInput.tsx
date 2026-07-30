'use client';

import React, { useState, useRef } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { VoiceRecorder } from '@/components/chat/VoiceRecorder';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image as ImageIcon,
  FileText,
  Lock,
  Sparkles,
} from 'lucide-react';

export const MessageInput: React.FC = () => {
  const { activeChatId, sendMessage } = useChat();
  const [text, setText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!activeChatId) return null;

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
    setShowEmojiPicker(false);
  };

  const handleAttachImage = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    ];
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    sendMessage('Attached Photo', 'image', randomImage);
    setShowAttachMenu(false);
  };

  const emojis = ['😊', '😂', '🔥', '🔒', '👍', '❤️', '🎉', '🚀', '💯', '✨'];

  return (
    <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md relative z-20 flex-shrink-0">
      {isRecordingVoice ? (
        <VoiceRecorder onCancel={() => setIsRecordingVoice(false)} />
      ) : (
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          {/* Attachment Popup Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Attach File or Photo"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-full mb-2 left-0 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-2 z-30 animate-in zoom-in-95">
                <button
                  type="button"
                  onClick={handleAttachImage}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-signal-600/20 text-signal-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span>Send Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sendMessage('Document: Signal_Security_Audit.pdf', 'file');
                    setShowAttachMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Send Document</span>
                </button>
              </div>
            )}
          </div>

          {/* Text Input Field */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Signal message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-100 placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:border-signal-500 focus:ring-2 focus:ring-signal-500/20 text-sm pl-4 pr-10 py-3 outline-none transition-all"
            />

            {/* Emoji Trigger */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 right-0 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl grid grid-cols-5 gap-2 z-30 animate-in zoom-in-95">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setText((prev) => prev + emoji);
                    }}
                    className="text-lg p-1.5 hover:bg-slate-800 rounded-lg transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Record or Send Button */}
          {text.trim() ? (
            <button
              type="submit"
              className="p-3 rounded-2xl bg-signal-600 hover:bg-signal-500 text-white shadow-lg shadow-signal-600/30 transition-transform active:scale-95 flex-shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-signal-400 hover:text-signal-300 border border-slate-700 transition-transform active:scale-95 flex-shrink-0"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </form>
      )}
    </div>
  );
};
