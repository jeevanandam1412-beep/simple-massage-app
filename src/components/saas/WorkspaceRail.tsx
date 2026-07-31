'use client';

import React from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePWA } from '@/components/providers/PWAProvider';
import { Shield, Sun, Moon, LogOut, Zap, Download, Smartphone } from 'lucide-react';

export const WorkspaceRail: React.FC = () => {
  const { signOut, profile, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, installPWA } = usePWA();

  const displayName = profile?.full_name || user?.email || 'User';

  return (
    <div className="w-16 bg-zinc-950 dark:bg-black light:bg-zinc-100 border-r border-zinc-800 dark:border-zinc-800 light:border-zinc-300 flex flex-col items-center justify-between py-4 space-y-4 flex-shrink-0 select-none z-30 transition-colors">
      {/* SaaS Workspace Icons */}
      <div className="flex flex-col items-center gap-3">
        {/* Main Logo */}
        <div
          className="w-10 h-10 rounded-2xl bg-white dark:bg-white light:bg-black text-black dark:text-black light:text-white flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-transform"
          title="Signal SaaS Platform"
        >
          <Shield className="w-5 h-5" />
        </div>

        <div className="w-8 h-[1px] bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-300 my-1" />

        <div
          className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 flex items-center justify-center text-white dark:text-white light:text-black cursor-pointer shadow-md"
          title="Production Workspace"
        >
          <Zap className="w-5 h-5" />
        </div>

        {/* PWA Install Button (if prompt available) */}
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

      {/* Theme Switcher & Logout Buttons */}
      <div className="flex flex-col items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 flex items-center justify-center text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-900" />}
        </button>

        {/* Logout Button */}
        <button
          onClick={signOut}
          className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-rose-500/50 flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors"
          title={`Sign Out (${displayName})`}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
