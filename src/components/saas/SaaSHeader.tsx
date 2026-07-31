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
  Zap,
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
    <header className="h-14 px-3 sm:px-4 border-b border-[var(--border-subtle)] glass-panel flex items-center justify-between z-20 flex-shrink-0 select-none transition-colors">
      {/* Active Channel Overview */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-xl glass-pill text-[var(--text-main)] transition-colors"
          title={isMobileSidebarOpen ? 'Close Menu' : 'Open Channels Menu'}
        >
          {isMobileSidebarOpen ? <ArrowLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-1.5 font-black text-[var(--text-main)] text-sm tracking-tight">
          {activeChannel.is_private ? (
            <Lock className="w-4 h-4 text-amber-400" />
          ) : (
            <Hash className="w-4 h-4 text-indigo-500" />
          )}
          <span className="truncate">{activeChannel.name}</span>
        </div>

        {activeChannel.description && (
          <span className="hidden lg:inline-block text-xs text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-3 truncate max-w-sm">
            {activeChannel.description}
          </span>
        )}
      </div>

      {/* Action Indicators */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-500 font-bold">
          <Zap className="w-3 h-3 fill-indigo-500" />
          <span>Blinko Signal</span>
        </div>

        <button
          onClick={() => setIsSafetyOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl glass-pill hover:bg-[var(--bg-hover)] text-[var(--text-main)] text-xs font-semibold transition-all hover:scale-105"
          title="Verify Blinko Safety Numbers"
        >
          <Key className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Safety Keys</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl glass-pill hover:bg-[var(--bg-hover)] text-[var(--text-main)] transition-all hover:scale-105"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] glass-pill px-2.5 py-1 rounded-xl font-bold">
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>{onlineUsers.length}</span>
        </div>
      </div>
    </header>
  );
};
