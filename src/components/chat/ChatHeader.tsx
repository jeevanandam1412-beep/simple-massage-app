'use client';

import React, { useState } from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  Phone,
  Video,
  ShieldCheck,
  Timer,
  MoreVertical,
  Key,
  Trash2,
  Lock,
  ChevronDown,
} from 'lucide-react';

export const ChatHeader: React.FC = () => {
  const {
    activeChat,
    activeContact,
    startCall,
    openSafetyModal,
    setDisappearingTimerForChat,
    deleteChat,
  } = useChat();

  const [isTimerDropdownOpen, setIsTimerDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!activeChat || !activeContact) return null;

  const timerOptions = [
    { label: 'Off', seconds: 0 },
    { label: '5 seconds', seconds: 5 },
    { label: '5 minutes', seconds: 300 },
    { label: '1 hour', seconds: 3600 },
    { label: '1 day', seconds: 86400 },
    { label: '1 week', seconds: 604800 },
  ];

  const currentTimerLabel =
    timerOptions.find((t) => t.seconds === activeChat.disappearingTimer)?.label ||
    'Off';

  return (
    <header className="h-16 px-4 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0 select-none">
      {/* Contact Profile Overview */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          src={activeContact.avatar}
          fallback={activeContact.name}
          status={activeContact.status}
          size="md"
          color={activeContact.color}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-100 text-sm truncate">
              {activeContact.name}
            </h2>
            <Badge variant="signal" className="hidden sm:inline-flex text-[10px]">
              <Lock className="w-2.5 h-2.5" /> Signal E2EE
            </Badge>
          </div>
          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
            <span>{activeContact.phone}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="capitalize">{activeContact.status}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Safety Number Button */}
        <button
          onClick={openSafetyModal}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-slate-800"
          title="Verify Safety Numbers"
        >
          <Key className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline text-slate-300">Safety Number</span>
        </button>

        {/* Disappearing Timer Menu */}
        <div className="relative">
          <button
            onClick={() => setIsTimerDropdownOpen(!isTimerDropdownOpen)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors border ${
              activeChat.disappearingTimer > 0
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-800'
            }`}
            title="Disappearing Messages"
          >
            <Timer className="w-4 h-4" />
            <span className="hidden lg:inline">{currentTimerLabel}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isTimerDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 border-b border-slate-800">
                Disappearing Messages
              </div>
              {timerOptions.map((opt) => (
                <button
                  key={opt.seconds}
                  onClick={() => {
                    setDisappearingTimerForChat(activeChat.id, opt.seconds);
                    setIsTimerDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-800 transition-colors flex items-center justify-between ${
                    activeChat.disappearingTimer === opt.seconds
                      ? 'text-signal-400 font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {activeChat.disappearingTimer === opt.seconds && (
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Call Controls */}
        <button
          onClick={() => startCall('audio')}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Voice Call"
        >
          <Phone className="w-4 h-4 text-signal-400" />
        </button>

        <button
          onClick={() => startCall('video')}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Video Call"
        >
          <Video className="w-4 h-4 text-signal-400" />
        </button>

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  openSafetyModal();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                View Safety Numbers
              </button>
              <button
                onClick={() => {
                  deleteChat(activeChat.id);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800/80 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
