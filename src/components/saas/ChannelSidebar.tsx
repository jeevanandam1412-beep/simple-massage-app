'use client';

import React from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import {
  Hash,
  Lock,
  Plus,
  Search,
  ChevronDown,
  Users,
  ShieldCheck,
  Radio,
  LogOut,
  Zap,
} from 'lucide-react';

export const ChannelSidebar: React.FC = () => {
  const {
    channels,
    activeChannelId,
    setActiveChannelId,
    onlineUsers,
    searchQuery,
    setSearchQuery,
    setIsCreateChannelOpen,
  } = useChat();
  const { profile, signOut } = useAuth();

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 lg:w-72 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col h-full flex-shrink-0 select-none transition-colors">
      {/* Blinko Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <h2 className="font-black text-[var(--text-main)] text-sm flex items-center gap-1.5 tracking-tight">
            <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
            Blinko Workspace
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-semibold mt-0.5 font-mono">
            <Radio className="w-3 h-3 animate-pulse" />
            Live Signal Engine
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-main)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-xs rounded-xl pl-9 pr-3 py-2 border border-[var(--border-subtle)] focus:border-indigo-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-[var(--border-subtle)]">
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Channels
            </span>
            <button
              onClick={() => setIsCreateChannelOpen(true)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Create Channel"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {filteredChannels.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] px-2.5 py-2">No channels found</p>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = activeChannelId === channel.id;

                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {channel.is_private ? (
                        <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Hash className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                      )}
                      <span className="truncate">{channel.name}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active Teammates */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-500" /> Active Users
            </span>
            <span className="bg-emerald-500/20 text-emerald-500 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
              {onlineUsers.length}
            </span>
          </div>

          <div className="space-y-1">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <Avatar
                  src={user.avatar_url}
                  fallback={user.full_name}
                  status="online"
                  size="sm"
                  color="bg-indigo-600 text-white"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate text-xs">{user.full_name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email || 'Blinko User'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-main)] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={profile?.avatar_url}
            fallback={profile?.full_name || 'User'}
            status="online"
            size="sm"
            color="bg-indigo-600 text-white"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--text-main)] truncate">
              {profile?.full_name || 'Authenticated User'}
            </p>
            <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" /> Blinko Active
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
