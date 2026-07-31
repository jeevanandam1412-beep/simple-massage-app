'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Profile, Channel, Message, TypingState } from '@/types/database';
import {
  supabase,
  subscribeToRealtimeChannel,
  broadcastTypingStatus,
} from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ChatContextType {
  currentUser: Profile;
  channels: Channel[];
  activeChannelId: string;
  activeChannel: Channel | null;
  messages: Record<string, Message[]>;
  onlineUsers: Profile[];
  typingUsers: TypingState[];
  searchQuery: string;
  isCreateChannelOpen: boolean;
  isSafetyOpen: boolean;
  isMobileSidebarOpen: boolean;
  
  // Actions
  setActiveChannelId: (id: string) => void;
  setSearchQuery: (q: string) => void;
  sendRealtimeMessage: (content: string, type?: Message['type'], mediaUrl?: string) => Promise<void>;
  createChannel: (name: string, description: string, isPrivate: boolean) => Promise<void>;
  sendTypingSignal: (isTyping: boolean) => void;
  setIsCreateChannelOpen: (open: boolean) => void;
  setIsSafetyOpen: (open: boolean) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function getValidUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return '00000000-0000-4000-8000-000000000001';
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, user } = useAuth();

  const fallbackId = useRef(getValidUUID()).current;

  const currentUser: Profile = profile || {
    id: user?.id || fallbackId,
    full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email,
    status: 'online',
    about: 'SaaS Realtime User',
  };

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([currentUser]);
  const [typingUsers, setTypingUsers] = useState<TypingState[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Navigation
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const activeChannelRef = useRef<RealtimeChannel | null>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || null;

  // 1. Fetch Real-time Channels from Supabase Database
  useEffect(() => {
    const loadChannels = async () => {
      const { data } = await supabase.from('channels').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setChannels(data as Channel[]);
        if (!activeChannelId) {
          setActiveChannelId(data[0].id);
        }
      } else {
        const { data: newChan } = await supabase.from('channels').insert({
          name: 'general',
          description: 'Company-wide announcements and general discussion',
          is_private: false,
        }).select().single();

        if (newChan) {
          setChannels([newChan as Channel]);
          setActiveChannelId(newChan.id);
        }
      }
    };

    loadChannels();
  }, []);

  // 2. Fetch Messages for Active Channel from Supabase DB
  useEffect(() => {
    if (!activeChannelId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', activeChannelId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages((prev) => ({
          ...prev,
          [activeChannelId]: data as Message[],
        }));
      }
    };

    loadMessages();
  }, [activeChannelId]);

  // 3. Connect Realtime WebSocket channel for active conversation
  useEffect(() => {
    if (!activeChannelId) return;

    const channelSub = subscribeToRealtimeChannel(activeChannelId, currentUser, {
      onNewMessage: (newMsg) => {
        setMessages((prev) => {
          const list = prev[activeChannelId] || [];
          if (list.some((m) => m.id === newMsg.id)) return prev;
          return {
            ...prev,
            [activeChannelId]: [...list, newMsg],
          };
        });
      },
      onTypingStateChange: (typingState) => {
        if (typingState.channelId !== activeChannelId) return;
        setTypingUsers((prev) => {
          const filtered = prev.filter((t) => t.userId !== typingState.userId);
          if (typingState.isTyping) {
            return [...filtered, typingState];
          }
          return filtered;
        });
      },
      onPresenceSync: (users) => {
        if (users && users.length > 0) {
          setOnlineUsers(users);
        }
      },
    });

    activeChannelRef.current = channelSub;

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, [activeChannelId, currentUser.id]);

  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id);
    setIsMobileSidebarOpen(false);
  };

  const sendRealtimeMessage = async (
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string
  ) => {
    if (!activeChannelId || !content.trim()) return;

    const newMsgId = getValidUUID();
    const nowIso = new Date().toISOString();

    const newMsg: Message = {
      id: newMsgId,
      channel_id: activeChannelId,
      sender_id: currentUser.id,
      content: content.trim(),
      type,
      media_url: mediaUrl,
      is_encrypted: true,
      created_at: nowIso,
      sender: currentUser,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));

    sendTypingSignal(false);

    const { error } = await supabase.from('messages').insert({
      id: newMsgId,
      channel_id: activeChannelId,
      sender_id: currentUser.id,
      content: content.trim(),
      type,
      media_url: mediaUrl,
      is_encrypted: true,
      created_at: nowIso,
    });

    if (error) {
      console.warn('Postgres insert message notice:', error.message);
    }
  };

  const createChannel = async (name: string, description: string, isPrivate: boolean) => {
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    const { data: newChan, error } = await supabase.from('channels').insert({
      id: getValidUUID(),
      name: formattedName,
      description,
      is_private: isPrivate,
      created_by: currentUser.id,
    }).select().single();

    if (newChan) {
      setChannels((prev) => [...prev, newChan as Channel]);
      setActiveChannelId(newChan.id);
    }

    setIsCreateChannelOpen(false);
    setIsMobileSidebarOpen(false);
  };

  const sendTypingSignal = (isTyping: boolean) => {
    broadcastTypingStatus(
      activeChannelRef.current,
      currentUser.id,
      currentUser.full_name,
      activeChannelId,
      isTyping
    );
  };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        channels,
        activeChannelId,
        activeChannel,
        messages,
        onlineUsers,
        typingUsers,
        searchQuery,
        isCreateChannelOpen,
        isSafetyOpen,
        isMobileSidebarOpen,
        setActiveChannelId: handleSelectChannel,
        setSearchQuery,
        sendRealtimeMessage,
        createChannel,
        sendTypingSignal,
        setIsCreateChannelOpen,
        setIsSafetyOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
