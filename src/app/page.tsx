'use client';

import React from 'react';
import { ChatProvider } from '@/components/providers/ChatProvider';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageThread } from '@/components/chat/MessageThread';
import { MessageInput } from '@/components/chat/MessageInput';
import { CallModal } from '@/components/modals/CallModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { NewChatModal } from '@/components/modals/NewChatModal';
import { SafetyNumberModal } from '@/components/modals/SafetyNumberModal';
import { MediaViewer } from '@/components/chat/MediaViewer';

export default function SignalApp() {
  return (
    <ChatProvider>
      <main className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Active Chat Conversation View */}
        <section className="flex-1 flex flex-col h-full min-w-0 bg-slate-950/40 relative">
          <ChatHeader />
          <MessageThread />
          <MessageInput />
        </section>

        {/* Global Application Modals & Overlays */}
        <CallModal />
        <SettingsModal />
        <NewChatModal />
        <SafetyNumberModal />
        <MediaViewer />
      </main>
    </ChatProvider>
  );
}
