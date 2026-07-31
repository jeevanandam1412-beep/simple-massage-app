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
    <aside className="w-64 lg:w-72 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-r border-zinc-800 dark:border-zinc-800 light:border-zinc-300 flex flex-col h-full flex-shrink-0 select-none transition-colors">
      {/* Workspace Header */}
      <div className="p-4 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-300 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 text-sm flex items-center gap-1.5">
            Signal SaaS Platform
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-0.5 font-mono">
            <Radio className="w-3 h-3 animate-pulse" />
            WebSocket Realtime
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black dark:bg-black light:bg-white text-zinc-200 dark:text-zinc-200 light:text-zinc-900 placeholder:text-zinc-500 text-xs rounded-xl pl-9 pr-3 py-2 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 focus:border-white outline-none transition-colors"
          />
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Channels
            </span>
            <button
              onClick={() => setIsCreateChannelOpen(true)}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Create Channel"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {filteredChannels.length === 0 ? (
              <p className="text-xs text-zinc-500 px-2.5 py-2">No channels found</p>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = activeChannelId === channel.id;

                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                      isActive
                        ? 'bg-white dark:bg-white light:bg-black text-black dark:text-black light:text-white font-bold shadow'
                        : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-200'
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

        {/* Online Teammates */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" /> Active Users
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {onlineUsers.length}
            </span>
          </div>

          <div className="space-y-1">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-zinc-300 dark:text-zinc-300 light:text-zinc-800"
              >
                <Avatar
                  src={user.avatar_url}
                  fallback={user.full_name}
                  status="online"
                  size="sm"
                  color="bg-white text-black"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-xs">{user.full_name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user.email || 'Supabase User'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Account Footer */}
      <div className="p-3 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-300 bg-black dark:bg-black light:bg-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={profile?.avatar_url}
            fallback={profile?.full_name || 'User'}
            status="online"
            size="sm"
            color="bg-white text-black"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 truncate">
              {profile?.full_name || 'Authenticated User'}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Live Auth Active
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="p-1.5 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-300 text-zinc-400 hover:text-rose-400 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
