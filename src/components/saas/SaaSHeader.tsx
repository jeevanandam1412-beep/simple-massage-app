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
} from 'lucide-react';

export const SaaSHeader: React.FC = () => {
  const { activeChannel, onlineUsers, setIsSafetyOpen } = useChat();
  const { theme, toggleTheme } = useTheme();

  if (!activeChannel) return null;

  return (
    <header className="h-14 px-4 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-300 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/80 backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0 select-none transition-colors">
      {/* Active Channel Overview */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 text-sm">
          {activeChannel.is_private ? (
            <Lock className="w-4 h-4 text-amber-400" />
          ) : (
            <Hash className="w-4 h-4 text-zinc-400" />
          )}
          <span className="truncate">{activeChannel.name}</span>
        </div>

        {activeChannel.description && (
          <span className="hidden md:inline-block text-xs text-zinc-400 border-l border-zinc-800 pl-3 truncate max-w-sm">
            {activeChannel.description}
          </span>
        )}
      </div>

      {/* Action Indicators & Theme Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Realtime WebSocket Telemetry Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>WebSocket Realtime</span>
        </div>

        {/* Safety Number Key Verification Modal Trigger */}
        <button
          onClick={() => setIsSafetyOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 hover:bg-zinc-800 text-zinc-200 dark:text-zinc-200 light:text-zinc-800 text-xs font-medium border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 transition-colors"
          title="Verify E2E Safety Numbers"
        >
          <Key className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden lg:inline">Safety Numbers</span>
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 hover:bg-zinc-800 text-zinc-300 dark:text-zinc-300 light:text-zinc-800 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-900" />}
        </button>

        {/* Online Count Badge */}
        <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-700 bg-black dark:bg-black light:bg-zinc-200 px-2.5 py-1 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-zinc-300">
          <Users className="w-3.5 h-3.5" />
          <span>{onlineUsers.length} online</span>
        </div>
      </div>
    </header>
  );
};
