'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/database';
import { encryptPayload, decryptPayload } from '@/lib/crypto';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'saas_auth_encrypted_profile';
const COOKIE_KEY = 'saas_auth_session_enc';

function saveEncryptedSession(profileData: Profile) {
  if (typeof window === 'undefined') return;
  try {
    const encStr = encryptPayload(profileData);
    localStorage.setItem(LOCAL_STORAGE_KEY, encStr);
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(encStr)}; path=/; max-age=2592000; SameSite=Lax`;
  } catch (e) {
    console.warn('Session save notice:', e);
  }
}

function clearEncryptedSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
  } catch (e) {
    console.warn('Session clear notice:', e);
  }
}

function loadEncryptedSession(): Profile | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (fromLocal) {
      const dec = decryptPayload(fromLocal);
      if (dec) return dec;
    }
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_KEY + '=([^;]+)'));
    if (match) {
      const dec = decryptPayload(decodeURIComponent(match[2]));
      if (dec) return dec;
    }
  } catch (e) {
    console.warn('Session load notice:', e);
  }
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from encrypted storage on mount
  useEffect(() => {
    const cachedProfile = loadEncryptedSession();
    if (cachedProfile) {
      setProfile(cachedProfile);
      setUser({ id: cachedProfile.id, email: cachedProfile.email } as User);
    }

    // Connect Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        syncProfileWithDB(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncProfileWithDB(session.user.id, session.user.email);
      } else if (!loadEncryptedSession()) {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncProfileWithDB = async (userId: string, email?: string, name?: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const activeProf: Profile = data
        ? (data as Profile)
        : {
            id: userId,
            full_name: name || email?.split('@')[0] || 'Blinko User',
            email: email,
            status: 'online',
            about: 'Blinko Realtime Member ⚡',
          };

      if (!data) {
        await supabase.from('profiles').insert(activeProf);
      }

      setProfile(activeProf);
      saveEncryptedSession(activeProf);
    } catch {
      const fallbackProf: Profile = {
        id: userId,
        full_name: name || email?.split('@')[0] || 'Blinko User',
        email: email,
        status: 'online',
        about: 'Blinko Realtime Member ⚡',
      };
      setProfile(fallbackProf);
      saveEncryptedSession(fallbackProf);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      await syncProfileWithDB(data.user.id, data.user.email);
      setLoading(false);
      return { error: null };
    }

    setLoading(false);
    return {
      error: error
        ? { message: error.message }
        : { message: 'Invalid email or password. Please try again or create an account.' },
    };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    const validId = data?.user?.id || (typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : '00000000-0000-4000-8000-000000000001');
    const newProf: Profile = {
      id: validId,
      full_name: fullName || email.split('@')[0],
      email: email,
      status: 'online',
      about: 'Blinko Realtime Member',
    };

    setProfile(newProf);
    setUser({ id: validId, email } as User);
    saveEncryptedSession(newProf);

    if (data?.user) {
      await syncProfileWithDB(data.user.id, email, fullName);
    }

    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    clearEncryptedSession();
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
