import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Profile, Channel, Message, TypingState } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://default-saas-messaging.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmF1bHQtc2Fhcy1tZXNzYWdpbmciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3MjUxMjAwMCwiZXhwIjoyMDE4MDg4MDAwfQ.dummykeyforrealtimepreview';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 20,
    },
  },
});

/**
 * Creates a real-time WebSocket channel for a specific chat channel.
 * Subscribes to Postgres DB Changes (INSERT/DELETE), Ephemeral Broadcasts (typing), and Presence.
 */
export function subscribeToRealtimeChannel(
  channelId: string,
  currentUser: Profile,
  callbacks: {
    onNewMessage: (msg: Message) => void;
    onTypingStateChange: (typingState: TypingState) => void;
    onPresenceSync: (presences: Profile[]) => void;
  }
): RealtimeChannel {
  const realtimeChannel = supabase.channel(`saas-room:${channelId}`, {
    config: {
      presence: {
        key: currentUser.id,
      },
      broadcast: {
        self: false,
      },
    },
  });

  // 1. WebSocket Listener for DB Postgres Changes on Messages
  realtimeChannel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `channel_id=eq.${channelId}`,
    },
    (payload) => {
      const rawMsg = payload.new as any;
      if (rawMsg) {
        callbacks.onNewMessage({
          id: rawMsg.id,
          channel_id: rawMsg.channel_id,
          sender_id: rawMsg.sender_id,
          content: rawMsg.content,
          type: rawMsg.type || 'text',
          media_url: rawMsg.media_url,
          is_encrypted: rawMsg.is_encrypted ?? true,
          created_at: rawMsg.created_at,
        });
      }
    }
  );

  // 2. WebSocket Listener for Ephemeral Broadcasts (Typing indicator)
  realtimeChannel.on('broadcast', { event: 'typing' }, (payload) => {
    if (payload.payload) {
      callbacks.onTypingStateChange(payload.payload as TypingState);
    }
  });

  // 3. WebSocket Listener for Presence (Live Online User Tracking)
  realtimeChannel.on('presence', { event: 'sync' }, () => {
    const presenceState = realtimeChannel.presenceState();
    const onlineUsers: Profile[] = [];

    Object.values(presenceState).forEach((presences: any) => {
      presences.forEach((p: any) => {
        if (p.user) {
          onlineUsers.push(p.user);
        }
      });
    });

    callbacks.onPresenceSync(onlineUsers);
  });

  // Track current user presence
  realtimeChannel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await realtimeChannel.track({
        user: currentUser,
        online_at: new Date().toISOString(),
      });
    }
  });

  return realtimeChannel;
}

/**
 * Broadcasts typing status over WebSockets
 */
export function broadcastTypingStatus(
  realtimeChannel: RealtimeChannel | null,
  userId: string,
  userName: string,
  channelId: string,
  isTyping: boolean
) {
  if (!realtimeChannel) return;
  realtimeChannel.send({
    type: 'broadcast',
    event: 'typing',
    payload: {
      userId,
      userName,
      channelId,
      isTyping,
    },
  });
}
