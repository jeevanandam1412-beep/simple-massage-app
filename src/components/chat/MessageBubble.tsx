'use client';

import React, { useState, useRef } from 'react';
import { Message, CURRENT_USER } from '@/lib/mockData';
import { useChat } from '@/components/providers/ChatProvider';
import { formatTimestamp, formatDuration } from '@/lib/utils';
import {
  Check,
  CheckCheck,
  Lock,
  Timer,
  Play,
  Pause,
  Download,
  Smile,
  ShieldAlert,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { setMediaViewerUrl, addReactionToMessage } = useChat();
  const isMe = message.senderId === CURRENT_USER.id;
  const isSystem = message.type === 'system';

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 px-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2 text-center text-xs text-slate-400 max-w-md shadow-inner flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-signal-400 flex-shrink-0" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setAudioProgress(progress || 0);
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
  };

  const emojis = ['👍', '❤️', '🔥', '👏', '🔒', '💡'];

  return (
    <div
      className={`group relative flex flex-col my-1.5 ${
        isMe ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md border transition-all ${
          isMe
            ? 'bg-gradient-to-br from-signal-600 to-signal-700 text-white border-signal-500/30 rounded-br-xs'
            : 'bg-slate-800/90 text-slate-100 border-slate-700/60 rounded-bl-xs'
        }`}
      >
        {/* Message Content according to Type */}
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {message.type === 'image' && (
          <div className="space-y-2">
            <div
              className="relative overflow-hidden rounded-xl cursor-pointer group/img border border-black/20"
              onClick={() => message.mediaUrl && setMediaViewerUrl(message.mediaUrl)}
            >
              <img
                src={message.mediaUrl}
                alt="Attachment"
                className="w-full max-h-80 object-cover rounded-xl hover:scale-[1.02] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  Click to view
                </span>
              </div>
            </div>
            {message.content && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>
        )}

        {message.type === 'audio' && (
          <div className="flex items-center gap-3 min-w-[200px] py-1">
            <button
              onClick={toggleAudioPlayback}
              className={`p-2.5 rounded-full ${
                isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-signal-600 hover:bg-signal-500 text-white'
              } transition-colors shadow-sm`}
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isMe ? 'bg-white' : 'bg-signal-400'} transition-all duration-100`}
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] opacity-80 font-mono">
                <span>{formatDuration((message.audioDuration || 10) * (audioProgress / 100))}</span>
                <span>{formatDuration(message.audioDuration || 10)}</span>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={message.mediaUrl}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          </div>
        )}

        {/* Message Footer Meta (Timestamp, Encryption status, Read receipts) */}
        <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] opacity-75 font-medium">
          {message.disappearingSeconds ? (
            <span className="flex items-center gap-0.5 text-amber-300">
              <Timer className="w-3 h-3" />
              <span>Expiring</span>
            </span>
          ) : null}

          <span className="flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5 opacity-60" />
            <span>{formatTimestamp(message.timestamp)}</span>
          </span>

          {isMe && (
            <span className="ml-0.5">
              {message.status === 'sending' && <span className="animate-spin font-bold">...</span>}
              {message.status === 'sent' && <Check className="w-3.5 h-3.5" />}
              {message.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5" />}
              {message.status === 'read' && (
                <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
              )}
            </span>
          )}
        </div>

        {/* Emoji Reactions Display */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div
            className={`absolute -bottom-3 ${
              isMe ? 'right-2' : 'left-2'
            } flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-full px-2 py-0.5 text-[11px] shadow-lg backdrop-blur-md z-10`}
          >
            {Object.entries(message.reactions).map(([emoji, users]) => (
              <span
                key={emoji}
                onClick={() => addReactionToMessage(message.id, emoji)}
                className="cursor-pointer hover:scale-125 transition-transform"
                title={`${users.length} reaction`}
              >
                {emoji} {users.length > 1 && <span className="text-[9px] opacity-80">{users.length}</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover Reaction Trigger */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 z-20">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 border border-slate-700 shadow-md transition-colors"
          title="Add reaction"
        >
          <Smile className="w-3.5 h-3.5" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-full mb-1 bg-slate-900 border border-slate-700 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-xl animate-in zoom-in-95 z-30">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  addReactionToMessage(message.id, emoji);
                  setShowEmojiPicker(false);
                }}
                className="hover:scale-130 transition-transform text-sm p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
