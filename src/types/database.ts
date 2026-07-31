export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  about?: string;
  status: 'online' | 'offline' | 'away';
  updated_at?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
  created_by?: string;
  created_at: string;
}

export interface ChannelMember {
  channel_id: string;
  profile_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'system' | 'file';
  media_url?: string;
  is_encrypted: boolean;
  created_at: string;
  sender?: Profile;
}

export interface TypingState {
  userId: string;
  userName: string;
  channelId: string;
  isTyping: boolean;
}
