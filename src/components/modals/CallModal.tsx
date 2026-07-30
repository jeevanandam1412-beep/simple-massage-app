'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Avatar } from '@/components/ui/Avatar';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ShieldCheck,
  Lock,
  Monitor,
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export const CallModal: React.FC = () => {
  const { isCallModalOpen, callType, activeContact, endCall } = useChat();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isCallModalOpen) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallModalOpen]);

  if (!isCallModalOpen || !activeContact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[480px] overflow-hidden">
        {/* Background Encrypted Watermark */}
        <div className="absolute inset-0 bg-gradient-to-b from-signal-600/10 via-transparent to-black/60 pointer-events-none" />

        {/* Call Header */}
        <div className="z-10 flex flex-col items-center gap-1 text-center mt-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            End-to-End Encrypted Call ({callType === 'video' ? 'Video' : 'Audio'})
          </div>
          <span className="text-xs text-slate-400 font-mono mt-1">
            {formatDuration(callDuration)}
          </span>
        </div>

        {/* Center Contact / Video Preview */}
        <div className="z-10 flex flex-col items-center justify-center my-6 text-center">
          {callType === 'video' && !isVideoOff ? (
            <div className="relative w-full max-w-md h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {activeContact.name}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  src={activeContact.avatar}
                  fallback={activeContact.name}
                  size="xl"
                  color={activeContact.color}
                  className="w-24 h-24 ring-4 ring-signal-500/30"
                />
                <span className="absolute inset-0 rounded-full border-2 border-signal-400 animate-ping opacity-30" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">{activeContact.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeContact.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls Bar */}
        <div className="z-10 flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl px-6 py-3 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-colors ${
              isMuted
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {callType === 'video' && (
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3.5 rounded-full transition-colors ${
                isVideoOff
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3.5 rounded-full transition-colors ${
              isScreenSharing
                ? 'bg-signal-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Screen Share"
          >
            <Monitor className="w-5 h-5" />
          </button>

          <button
            onClick={endCall}
            className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
