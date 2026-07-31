'use client';

import React from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePWA } from '@/components/providers/PWAProvider';
import { Zap, Sun, Moon, LogOut, Download } from 'lucide-react';

export const WorkspaceRail: React.FC = () => {
  const { signOut, profile, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, installPWA } = usePWA();

  const displayName = profile?.full_name || user?.email || 'User';

  return (
    <div className="w-16 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col items-center justify-between py-4 space-y-4 flex-shrink-0 select-none z-30 transition-colors">
      {/* Blinko Logo & Workspace Icons */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
          title="Blinko Signal Workspace"
        >
          <Zap className="w-6 h-6 fill-white" />
        </div>

        <div className="w-8 h-[1px] bg-[var(--border-subtle)] my-1" />

        <div
          className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 cursor-pointer shadow-md"
          title="Blinko Active Channel"
        >
          <span className="font-bold text-xs font-mono">B</span>
        </div>

        {isInstallable && (
          <button
            onClick={installPWA}
            className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors animate-pulse"
            title="Install Blinko PWA App"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Theme Switcher & Logout */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors hover:scale-105"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        <button
          onClick={signOut}
          className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-rose-500/50 flex items-center justify-center text-[var(--text-muted)] hover:text-rose-400 transition-colors"
          title={`Sign Out (${displayName})`}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
