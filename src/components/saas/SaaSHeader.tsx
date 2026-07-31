'use client';

import React from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
  Hash,
  Lock,
  Radio,
  Users,
  Key,
  Sun,
  Moon,
  Menu,
  ArrowLeft,
} from 'lucide-react';

export const SaaSHeader: React.FC = () => {
  const {
    activeChannel,
    onlineUsers,
    setIsSafetyOpen,
    isMobileSidebarOpen,
    toggleMobileSidebar,
  } = useChat();
  const { theme, toggleTheme } = useTheme();

  if (!activeChannel) return null;

  return (
    <header className="h-14 px-3 sm:px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0 select-none transition-colors">
      {/* Active Channel Overview & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
          title={isMobileSidebarOpen ? 'Close Menu' : 'Open Channels Menu'}
        >
          {isMobileSidebarOpen ? <ArrowLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)] text-sm">
          {activeChannel.is_private ? (
            <Lock className="w-4 h-4 text-amber-400" />
          ) : (
            <Hash className="w-4 h-4 text-[var(--text-muted)]" />
          )}
          <span className="truncate">{activeChannel.name}</span>
        </div>

        {activeChannel.description && (
          <span className="hidden lg:inline-block text-xs text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-3 truncate max-w-sm">
            {activeChannel.description}
          </span>
        )}
      </div>

      {/* Action Indicators & Theme Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-500 font-semibold">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>WebSocket Realtime</span>
        </div>

        <button
          onClick={() => setIsSafetyOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] text-xs font-medium border border-[var(--border-subtle)] transition-colors"
          title="Verify E2E Safety Numbers"
        >
          <Key className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="hidden sm:inline">Safety Keys</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-900" />}
        </button>

        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 sm:px-2.5 py-1 rounded-xl border border-[var(--border-subtle)] font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>{onlineUsers.length}</span>
        </div>
      </div>
    </header>
  );
};
