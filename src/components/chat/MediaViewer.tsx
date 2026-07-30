'use client';

import React from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { X, Download, Lock } from 'lucide-react';

export const MediaViewer: React.FC = () => {
  const { mediaViewerUrl, setMediaViewerUrl } = useChat();

  if (!mediaViewerUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200 select-none">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <a
          href={mediaViewerUrl}
          download="signal_media.jpg"
          target="_blank"
          rel="noreferrer"
          className="p-2.5 rounded-full bg-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          title="Download Media"
        >
          <Download className="w-5 h-5" />
        </a>
        <button
          onClick={() => setMediaViewerUrl(null)}
          className="p-2.5 rounded-full bg-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          title="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={mediaViewerUrl}
          alt="Enlarged media preview"
          className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
        />
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
          <Lock className="w-3.5 h-3.5 text-signal-400" />
          Encrypted Signal Attachment Preview
        </div>
      </div>
    </div>
  );
};
