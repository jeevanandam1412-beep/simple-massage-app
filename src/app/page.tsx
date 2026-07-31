'use client';

import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider, useAuth } from '@/components/providers/AuthProvider';
import { ChatProvider } from '@/components/providers/ChatProvider';
import { AuthPage } from '@/components/auth/AuthPage';
import { WorkspaceRail } from '@/components/saas/WorkspaceRail';
import { ChannelSidebar } from '@/components/saas/ChannelSidebar';
import { SaaSHeader } from '@/components/saas/SaaSHeader';
import { RealtimeThread } from '@/components/saas/RealtimeThread';
import { RealtimeComposer } from '@/components/saas/RealtimeComposer';
import { CreateChannelModal } from '@/components/modals/CreateChannelModal';
import { SafetyNumberModal } from '@/components/modals/SafetyNumberModal';

function MainDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-white animate-ping" />
          <span>Authenticating Supabase Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans transition-colors">
        <WorkspaceRail />
        <ChannelSidebar />

        <section className="flex-1 flex flex-col h-full min-w-0 bg-black relative">
          <SaaSHeader />
          <RealtimeThread />
          <RealtimeComposer />
        </section>

        <CreateChannelModal />
        <SafetyNumberModal />
      </div>
    </ChatProvider>
  );
}

export default function SignalSaaSApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainDashboard />
      </AuthProvider>
    </ThemeProvider>
  );
}
