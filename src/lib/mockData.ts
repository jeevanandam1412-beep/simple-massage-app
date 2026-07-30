export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  about: string;
  safetyNumberVerified: boolean;
  color: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'system' | 'file';
  mediaUrl?: string;
  audioDuration?: number;
  fileName?: string;
  fileSize?: string;
  isEncrypted: boolean;
  expiresAt?: string;
  disappearingSeconds?: number;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
}

export interface Chat {
  id: string;
  contactId: string;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  disappearingTimer: number; // 0 = off, 5 = 5s, 300 = 5m, 3600 = 1h, 86400 = 1d, 604800 = 1w
  lastMessage?: string;
  lastMessageTime?: string;
}

export const CURRENT_USER: Contact = {
  id: 'user_me',
  name: 'Alex Rivera (You)',
  phone: '+1 (555) 019-2834',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'online',
  about: 'Encrypting the planet 🔒',
  safetyNumberVerified: true,
  color: 'bg-emerald-500',
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact_note_to_self',
    name: 'Note to Self',
    phone: 'Your personal cloud locker',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    about: 'Private notes, links and audio memos',
    safetyNumberVerified: true,
    color: 'bg-signal-500',
  },
  {
    id: 'contact_1',
    name: 'Elena Rostova',
    phone: '+1 (555) 839-1029',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    about: 'Cybersecurity Analyst | Signal enthusiast 🔒',
    safetyNumberVerified: true,
    color: 'bg-purple-500',
  },
  {
    id: 'contact_2',
    name: 'Marcus Vance',
    phone: '+1 (555) 492-0012',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    about: 'Building decentralised privacy tools',
    safetyNumberVerified: false,
    color: 'bg-amber-500',
  },
  {
    id: 'contact_3',
    name: 'Sophia Chen',
    phone: '+1 (555) 773-8910',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    about: 'Designing intuitive secure UX ✨',
    safetyNumberVerified: true,
    color: 'bg-pink-500',
  },
  {
    id: 'contact_4',
    name: 'David Miller',
    phone: '+1 (555) 201-9944',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'away',
    about: 'Out of office — E2EE only',
    safetyNumberVerified: true,
    color: 'bg-blue-500',
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_note_to_self',
    contactId: 'contact_note_to_self',
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    disappearingTimer: 0,
    lastMessage: 'Remember to audit the Signal Safety key verification logic.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'chat_1',
    contactId: 'contact_1',
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    disappearingTimer: 300, // 5m
    lastMessage: 'I verified our safety numbers! Everything matches perfectly 🔑',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'chat_2',
    contactId: 'contact_2',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    disappearingTimer: 0,
    lastMessage: 'Have you tested the voice memo feature yet?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'chat_3',
    contactId: 'contact_3',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    disappearingTimer: 86400, // 1d
    lastMessage: 'Here is the sleek Shadcn theme mockups!',
    lastMessageTime: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chat_note_to_self: [
    {
      id: 'msg_nts_1',
      chatId: 'chat_note_to_self',
      senderId: 'user_me',
      content: 'Important passphrases and server backup configs',
      timestamp: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
      status: 'read',
      type: 'text',
      isEncrypted: true,
    },
    {
      id: 'msg_nts_2',
      chatId: 'chat_note_to_self',
      senderId: 'user_me',
      content: 'Remember to audit the Signal Safety key verification logic.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'read',
      type: 'text',
      isEncrypted: true,
      reactions: { '👍': ['user_me'], '📌': ['user_me'] },
    },
  ],
  chat_1: [
    {
      id: 'msg_c1_sys_1',
      chatId: 'chat_1',
      senderId: 'system',
      content: 'Messages and calls are end-to-end encrypted. No one outside of this chat, not even Signal, can read or listen to them.',
      timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
      status: 'read',
      type: 'system',
      isEncrypted: true,
    },
    {
      id: 'msg_c1_1',
      chatId: 'chat_1',
      senderId: 'contact_1',
      content: 'Hey Alex! Are you ready for the Signal security protocol review?',
      timestamp: new Date(Date.now() - 1000 * 3600 * 1.5).toISOString(),
      status: 'read',
      type: 'text',
      isEncrypted: true,
    },
    {
      id: 'msg_c1_2',
      chatId: 'chat_1',
      senderId: 'user_me',
      content: 'Yes! All local databases and Supabase Realtime channels are configured with E2E encryption simulation.',
      timestamp: new Date(Date.now() - 1000 * 3600 * 1).toISOString(),
      status: 'read',
      type: 'text',
      isEncrypted: true,
      reactions: { '🚀': ['contact_1'] },
    },
    {
      id: 'msg_c1_3',
      chatId: 'chat_1',
      senderId: 'contact_1',
      content: 'Awesome! Check out this architecture preview diagram:',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'read',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      isEncrypted: true,
    },
    {
      id: 'msg_c1_4',
      chatId: 'chat_1',
      senderId: 'contact_1',
      content: 'I verified our safety numbers! Everything matches perfectly 🔑',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'delivered',
      type: 'text',
      isEncrypted: true,
      reactions: { '🔒': ['user_me'], '❤️': ['contact_1'] },
    },
  ],
  chat_2: [
    {
      id: 'msg_c2_1',
      chatId: 'chat_2',
      senderId: 'user_me',
      content: 'Hey Marcus, how is the decenetralised storage sync looking?',
      timestamp: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
      status: 'read',
      type: 'text',
      isEncrypted: true,
    },
    {
      id: 'msg_c2_2',
      chatId: 'chat_2',
      senderId: 'contact_2',
      content: 'Have you tested the voice memo feature yet?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'read',
      type: 'audio',
      mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
      audioDuration: 14,
      isEncrypted: true,
    },
  ],
  chat_3: [
    {
      id: 'msg_c3_1',
      chatId: 'chat_3',
      senderId: 'contact_3',
      content: 'Here is the sleek Shadcn theme mockups!',
      timestamp: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
      status: 'read',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      isEncrypted: true,
    },
  ],
};
