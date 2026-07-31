'use client';

import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider, useAuth } from '@/components/providers/AuthProvider';
import { ChatProvider, useChat } from '@/components/providers/ChatProvider';
import { AuthPage } from '@/components/auth/AuthPage';
import { WorkspaceRail } from '@/components/saas/WorkspaceRail';
import { ChannelSidebar } from '@/components/saas/ChannelSidebar';
import { SaaSHeader } from '@/components/saas/SaaSHeader';
import { RealtimeThread } from '@/components/saas/RealtimeThread';
import { RealtimeComposer } from '@/components/saas/RealtimeComposer';
import { CreateChannelModal } from '@/components/modals/CreateChannelModal';
import { SafetyNumberModal } from '@/components/modals/SafetyNumberModal';
import { X } from 'lucide-react';

function SaaSContent() {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useChat();

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-black text-zinc-100 font-sans transition-colors relative">
      {/* Desktop Workspace Rail & Sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <WorkspaceRail />
        <ChannelSidebar />
      </div>

      {/* Mobile Drawer Slide-over Overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex h-full max-w-[85vw] shadow-2xl">
            <WorkspaceRail />
            <ChannelSidebar />
          </div>
          <div
            className="flex-1 h-full cursor-pointer p-4 flex justify-end"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <button className="p-2.5 rounded-full bg-zinc-900 text-white border border-zinc-800 h-fit">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Realtime Messaging Stream */}
      <section className="flex-1 flex flex-col h-full min-w-0 bg-black relative overflow-hidden">
        <SaaSHeader />
        <RealtimeThread />
        <RealtimeComposer />
      </section>

      {/* Modals */}
      <CreateChannelModal />
      <SafetyNumberModal />
    </div>
  );
}

function MainDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-white animate-ping" />
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ChatProvider>
      <SaaSContent />
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
