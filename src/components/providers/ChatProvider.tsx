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
  
  // Actions
  setActiveChannelId: (id: string) => void;
  setSearchQuery: (q: string) => void;
  sendRealtimeMessage: (content: string, type?: Message['type'], mediaUrl?: string) => Promise<void>;
  createChannel: (name: string, description: string, isPrivate: boolean) => Promise<void>;
  sendTypingSignal: (isTyping: boolean) => void;
  setIsCreateChannelOpen: (open: boolean) => void;
  setIsSafetyOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, user } = useAuth();

  const currentUser: Profile = profile || {
    id: user?.id || 'guest',
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

  // Modals
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  const activeChannelRef = useRef<RealtimeChannel | null>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || null;

  // 1. Fetch Real-time Channels from Supabase Database (0 Mock Data)
  useEffect(() => {
    const loadChannels = async () => {
      const { data } = await supabase.from('channels').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setChannels(data as Channel[]);
        if (!activeChannelId) {
          setActiveChannelId(data[0].id);
        }
      } else {
        // Initial default channel if DB table is empty
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

  const sendRealtimeMessage = async (
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string
  ) => {
    if (!activeChannelId || !content.trim()) return;

    const newMsgId = `msg_${Date.now()}`;
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

    // Optimistic UI update
    setMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));

    sendTypingSignal(false);

    // Save to Supabase DB
    await supabase.from('messages').insert({
      id: newMsgId,
      channel_id: activeChannelId,
      sender_id: currentUser.id,
      content: content.trim(),
      type,
      media_url: mediaUrl,
      is_encrypted: true,
      created_at: nowIso,
    });
  };

  const createChannel = async (name: string, description: string, isPrivate: boolean) => {
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    const { data: newChan } = await supabase.from('channels').insert({
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
        setActiveChannelId,
        setSearchQuery,
        sendRealtimeMessage,
        createChannel,
        sendTypingSignal,
        setIsCreateChannelOpen,
        setIsSafetyOpen,
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
