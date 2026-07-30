import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykeyforlocalpreview';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface DatabaseProfile {
  id: string;
  username: string;
  avatar_url: string;
  status: string;
  created_at: string;
}

export interface DatabaseMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  type: string;
  media_url?: string;
  audio_duration?: number;
  is_encrypted: boolean;
}
