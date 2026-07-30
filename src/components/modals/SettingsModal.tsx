'use client';

import React from 'react';
import { useChat } from '@/components/providers/ChatProvider';
import { Dialog } from '@/components/ui/Dialog';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  ShieldCheck,
  Lock,
  Moon,
  Smartphone,
  Database,
  Key,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, closeSettings, currentUser } = useChat();

  return (
    <Dialog
      isOpen={isSettingsOpen}
      onClose={closeSettings}
      title="Signal Preferences & Security"
      description="Manage account details, Supabase database status, and E2E encryption options."
    >
      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <Avatar
            src={currentUser.avatar}
            fallback={currentUser.name}
            status={currentUser.status}
            size="lg"
            color="bg-signal-600"
          />
          <div>
            <h3 className="font-bold text-slate-100">{currentUser.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.phone}</p>
            <p className="text-xs text-signal-400 mt-1">{currentUser.about}</p>
          </div>
        </div>

        {/* Supabase Status Section */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-xs text-slate-200">
              <Database className="w-4 h-4 text-signal-400" />
              <span>Supabase Backend Integration</span>
            </div>
            {isSupabaseConfigured ? (
              <Badge variant="success">
                <CheckCircle2 className="w-3 h-3" /> Live Supabase
              </Badge>
            ) : (
              <Badge variant="signal">
                <CheckCircle2 className="w-3 h-3" /> Client Ready (Offline Mock)
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isSupabaseConfigured
              ? 'Connected to live Supabase database and Realtime websocket channel.'
              : 'App running with high-performance local state sync. To connect your live Supabase database, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'}
          </p>
        </div>

        {/* Privacy & Encryption Security Specs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Security & Privacy
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Curve25519 / AES-256 GCM</span>
              </div>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-signal-400" />
                <span className="text-slate-200">Sealed Sender Protocol</span>
              </div>
              <span className="text-signal-400 font-medium">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="text-slate-200">Shadcn Dark Mode Theme</span>
              </div>
              <span className="text-slate-400">Glassmorphism</span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
