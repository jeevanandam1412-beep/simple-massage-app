'use client';

import React from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatTimestamp } from '@/lib/utils';
import {
  Search,
  Plus,
  Settings,
  ShieldCheck,
  Pin,
  Lock,
  Timer,
  FileText,
  Volume2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    contacts,
    chats,
    activeChatId,
    setActiveChatId,
    searchQuery,
    setSearchQuery,
    openSettings,
    openNewChat,
    togglePinChat,
  } = useChat();

  const filteredChats = chats
    .map((chat) => {
      const contact = contacts.find((c) => c.id === chat.contactId);
      return { chat, contact };
    })
    .filter(({ contact }) => {
      if (!contact) return false;
      if (!searchQuery.trim()) return true;
      return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (a.chat.isPinned && !b.chat.isPinned) return -1;
      if (!a.chat.isPinned && b.chat.isPinned) return 1;
      const tA = new Date(a.chat.lastMessageTime || 0).getTime();
      const tB = new Date(b.chat.lastMessageTime || 0).getTime();
      return tB - tA;
    });

  return (
    <aside className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-900 border-r border-slate-800/80 flex-shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={openSettings}>
          <Avatar
            src={currentUser.avatar}
            fallback={currentUser.name}
            status={currentUser.status}
            size="md"
            color="bg-signal-600"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-semibold text-slate-100 text-sm group-hover:text-signal-400 transition-colors">
                {currentUser.name.replace(' (You)', '')}
              </h1>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-signal-400" /> E2EE Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={openNewChat}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800"
            title="New Chat"
          >
            <Plus className="w-5 h-5 text-signal-400" />
          </button>
          <button
            onClick={openSettings}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <Input
          placeholder="Search Signal chats or contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
          className="bg-slate-950/60 border-slate-800/80 rounded-xl"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredChats.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No Signal chats found
          </div>
        ) : (
          filteredChats.map(({ chat, contact }) => {
            if (!contact) return null;
            const isActive = activeChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                  isActive
                    ? 'bg-signal-600/15 border-signal-500/30 text-white shadow-lg shadow-signal-950/40'
                    : 'hover:bg-slate-800/50 border-transparent text-slate-300'
                }`}
              >
                <Avatar
                  src={contact.avatar}
                  fallback={contact.name}
                  status={contact.status}
                  size="md"
                  color={contact.color}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-sm truncate text-slate-100 group-hover:text-white">
                      {contact.name}
                    </span>
                    {chat.lastMessageTime && (
                      <span className="text-[11px] text-slate-500 flex-shrink-0">
                        {formatTimestamp(chat.lastMessageTime)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                      {chat.disappearingTimer > 0 && (
                        <Timer className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      )}
                      {chat.lastMessage || 'No messages yet'}
                    </p>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {chat.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-signal-400 rotate-45" />
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="bg-signal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Pin Toggle context */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-signal-400 transition-opacity"
                  title={chat.isPinned ? 'Unpin chat' : 'Pin chat'}
                >
                  <Pin className={`w-3.5 h-3.5 ${chat.isPinned ? 'text-signal-400' : 'text-slate-500'}`} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Signal Service Connected
        </div>
        <span className="text-slate-400">v7.12.0 E2EE</span>
      </div>
    </aside>
  );
};
