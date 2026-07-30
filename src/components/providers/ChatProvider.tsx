'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contact,
  Chat,
  Message,
  CURRENT_USER,
  INITIAL_CONTACTS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
} from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ChatContextType {
  currentUser: Contact;
  contacts: Contact[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  activeChat: Chat | null;
  activeContact: Contact | null;
  searchQuery: string;
  isCallModalOpen: boolean;
  callType: 'audio' | 'video' | null;
  isSettingsOpen: boolean;
  isNewChatOpen: boolean;
  isSafetyModalOpen: boolean;
  mediaViewerUrl: string | null;
  disappearingTimer: number; // in seconds
  
  // Actions
  setActiveChatId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  sendMessage: (content: string, type?: Message['type'], mediaUrl?: string, audioDuration?: number) => void;
  togglePinChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  setDisappearingTimerForChat: (chatId: string, seconds: number) => void;
  startCall: (type: 'audio' | 'video') => void;
  endCall: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openNewChat: () => void;
  closeNewChat: () => void;
  openSafetyModal: () => void;
  closeSafetyModal: () => void;
  setMediaViewerUrl: (url: string | null) => void;
  addContactAndStartChat: (name: string, phone: string) => void;
  addReactionToMessage: (messageId: string, emoji: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<Contact>(CURRENT_USER);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_1');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [mediaViewerUrl, setMediaViewerUrl] = useState<string | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const activeContact = activeChat
    ? contacts.find((c) => c.id === activeChat.contactId) || null
    : null;

  const disappearingTimer = activeChat?.disappearingTimer || 0;

  // Supabase Realtime Subscription (if configured)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as any;
        if (!newMsg || !newMsg.chat_id) return;

        const formattedMsg: Message = {
          id: newMsg.id,
          chatId: newMsg.chat_id,
          senderId: newMsg.sender_id,
          content: newMsg.content,
          timestamp: newMsg.created_at,
          status: 'delivered',
          type: newMsg.type || 'text',
          mediaUrl: newMsg.media_url,
          audioDuration: newMsg.audio_duration,
          isEncrypted: newMsg.is_encrypted ?? true,
        };

        setMessages((prev) => {
          const chatMsgs = prev[newMsg.chat_id] || [];
          if (chatMsgs.some((m) => m.id === formattedMsg.id)) return prev;
          return {
            ...prev,
            [newMsg.chat_id]: [...chatMsgs, formattedMsg],
          };
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle disappearing messages interval cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setMessages((prevMessages) => {
        let changed = false;
        const updated = { ...prevMessages };

        Object.keys(updated).forEach((chatId) => {
          const filtered = updated[chatId].filter((msg) => {
            if (!msg.expiresAt) return true;
            const expTime = new Date(msg.expiresAt).getTime();
            if (now >= expTime) {
              changed = true;
              return false;
            }
            return true;
          });
          updated[chatId] = filtered;
        });

        return changed ? updated : prevMessages;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string,
    audioDuration?: number
  ) => {
    if (!activeChatId) return;

    const msgId = `msg_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const chatTimer = activeChat?.disappearingTimer || 0;

    let expiresAt: string | undefined = undefined;
    if (chatTimer > 0) {
      expiresAt = new Date(Date.now() + chatTimer * 1000).toISOString();
    }

    const newMsg: Message = {
      id: msgId,
      chatId: activeChatId,
      senderId: currentUser.id,
      content,
      timestamp: nowIso,
      status: 'sent',
      type,
      mediaUrl,
      audioDuration,
      isEncrypted: true,
      expiresAt,
      disappearingSeconds: chatTimer,
    };

    // Update local state
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update chat last message preview
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMessage: type === 'image' ? '📷 Photo' : type === 'audio' ? '🎵 Voice note' : content,
              lastMessageTime: nowIso,
            }
          : c
      )
    );

    // Simulate double check / delivery & automated contact response if not Note to Self
    if (activeContact && activeContact.id !== 'contact_note_to_self') {
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m.id === msgId ? { ...m, status: 'delivered' } : m
          ),
        }));
      }, 800);

      // Automated auto-reply for demo interactive feel
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m.id === msgId ? { ...m, status: 'read' } : m
          ),
        }));

        const replies = [
          "Received loud and clear via Signal E2EE protocol! 🔒",
          "Got it! Privacy is top priority. Let's sync soon.",
          "Awesome! Check out the security log details.",
          "Verified! Double-checked the safety numbers key.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
          id: `reply_${Date.now()}`,
          chatId: activeChatId,
          senderId: activeContact.id,
          content: randomReply,
          timestamp: new Date().toISOString(),
          status: 'read',
          type: 'text',
          isEncrypted: true,
          expiresAt: chatTimer > 0 ? new Date(Date.now() + chatTimer * 1000).toISOString() : undefined,
          disappearingSeconds: chatTimer,
        };

        setMessages((prev) => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), replyMsg],
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  lastMessage: randomReply,
                  lastMessageTime: replyMsg.timestamp,
                }
              : c
          )
        );
      }, 2000);
    }
  };

  const togglePinChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const setDisappearingTimerForChat = (chatId: string, seconds: number) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, disappearingTimer: seconds } : c))
    );
    
    // Insert system message about timer update
    const timerText = seconds === 0
      ? 'disappearing messages turned off'
      : seconds < 60
      ? `${seconds} seconds`
      : seconds < 3600
      ? `${seconds / 60} minutes`
      : seconds < 86400
      ? `${seconds / 3600} hours`
      : `${seconds / 86400} days`;

    const sysMsg: Message = {
      id: `sys_timer_${Date.now()}`,
      chatId,
      senderId: 'system',
      content: `You set the disappearing message timer to ${timerText}.`,
      timestamp: new Date().toISOString(),
      status: 'read',
      type: 'system',
      isEncrypted: true,
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), sysMsg],
    }));
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsCallModalOpen(true);
  };

  const endCall = () => {
    setIsCallModalOpen(false);
    setCallType(null);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const openNewChat = () => setIsNewChatOpen(true);
  const closeNewChat = () => setIsNewChatOpen(false);
  const openSafetyModal = () => setIsSafetyModalOpen(true);
  const closeSafetyModal = () => setIsSafetyModalOpen(false);

  const addContactAndStartChat = (name: string, phone: string) => {
    const newContactId = `contact_${Date.now()}`;
    const newChatId = `chat_${Date.now()}`;
    const colors = ['bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];

    const newContact: Contact = {
      id: newContactId,
      name,
      phone,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: 'online',
      about: 'Signal End-to-End Encrypted User',
      safetyNumberVerified: true,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    const newChat: Chat = {
      id: newChatId,
      contactId: newContactId,
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      disappearingTimer: 0,
      lastMessage: 'Chat created via Signal protocol.',
      lastMessageTime: new Date().toISOString(),
    };

    setContacts((prev) => [...prev, newContact]);
    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newChatId]: [
        {
          id: `msg_sys_init_${Date.now()}`,
          chatId: newChatId,
          senderId: 'system',
          content: 'Messages and calls are end-to-end encrypted. No one outside of this chat, not even Signal, can read or listen to them.',
          timestamp: new Date().toISOString(),
          status: 'read',
          type: 'system',
          isEncrypted: true,
        },
      ],
    }));

    setActiveChatId(newChatId);
    closeNewChat();
  };

  const addReactionToMessage = (messageId: string, emoji: string) => {
    if (!activeChatId) return;

    setMessages((prev) => {
      const chatMsgs = prev[activeChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id !== messageId) return m;

        const currentReactions = { ...(m.reactions || {}) };
        const userList = currentReactions[emoji] || [];

        if (userList.includes(currentUser.id)) {
          // Toggle off
          const filtered = userList.filter((u) => u !== currentUser.id);
          if (filtered.length === 0) {
            delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = filtered;
          }
        } else {
          // Toggle on
          currentReactions[emoji] = [...userList, currentUser.id];
        }

        return { ...m, reactions: currentReactions };
      });

      return { ...prev, [activeChatId]: updated };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        contacts,
        chats,
        messages,
        activeChatId,
        activeChat,
        activeContact,
        searchQuery,
        isCallModalOpen,
        callType,
        isSettingsOpen,
        isNewChatOpen,
        isSafetyModalOpen,
        mediaViewerUrl,
        disappearingTimer,
        setActiveChatId,
        setSearchQuery,
        sendMessage,
        togglePinChat,
        deleteChat,
        setDisappearingTimerForChat,
        startCall,
        endCall,
        openSettings,
        closeSettings,
        openNewChat,
        closeNewChat,
        openSafetyModal,
        closeSafetyModal,
        setMediaViewerUrl,
        addContactAndStartChat,
        addReactionToMessage,
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
