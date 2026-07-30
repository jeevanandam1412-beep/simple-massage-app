'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Mic, Send, Trash2, StopCircle } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface VoiceRecorderProps {
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onCancel }) => {
  const { sendMessage } = useChat();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    const sampleAudioUrl = 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg';
    sendMessage('Voice Memo', 'audio', sampleAudioUrl, Math.max(1, seconds));
    onCancel();
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-signal-500/40 rounded-2xl px-4 py-2 w-full animate-in fade-in zoom-in-95 shadow-xl">
      <div className="flex items-center gap-2 text-rose-500 font-mono text-xs font-bold animate-pulse">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        <span>RECORDING</span>
        <span>{formatDuration(seconds)}</span>
      </div>

      {/* Simulated Waveform Visualizer */}
      <div className="flex-1 flex items-center justify-center gap-1 h-6">
        {[40, 75, 30, 90, 60, 100, 45, 80, 55, 95, 35, 70, 50, 85].map((h, i) => (
          <span
            key={i}
            className="w-1 bg-signal-500 rounded-full animate-pulse"
            style={{
              height: `${Math.max(20, (h * (seconds % 3 + 1)) / 3)}%`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Discard Recording"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          className="p-2.5 rounded-xl bg-signal-600 hover:bg-signal-500 text-white shadow-md shadow-signal-600/30 transition-transform active:scale-95"
          title="Send Voice Note"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
