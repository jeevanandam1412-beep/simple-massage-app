'use client';

import React from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePWA } from '@/components/providers/PWAProvider';
import { Shield, Sun, Moon, LogOut, Zap, Download } from 'lucide-react';

export const WorkspaceRail: React.FC = () => {
  const { signOut, profile, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, installPWA } = usePWA();

  const displayName = profile?.full_name || user?.email || 'User';

  return (
    <div className="w-16 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col items-center justify-between py-4 space-y-4 flex-shrink-0 select-none z-30 transition-colors">
      {/* SaaS Workspace Icons */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl bg-[var(--text-main)] text-[var(--bg-main)] flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-transform"
          title="Signal SaaS Platform"
        >
          <Shield className="w-5 h-5" />
        </div>

        <div className="w-8 h-[1px] bg-[var(--border-subtle)] my-1" />

        <div
          className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-main)] cursor-pointer shadow-md"
          title="Production Workspace"
        >
          <Zap className="w-5 h-5" />
        </div>

        {isInstallable && (
          <button
            onClick={installPWA}
            className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors animate-pulse"
            title="Install PWA Desktop / Mobile App"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Theme Switcher & Logout */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-900" />}
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
