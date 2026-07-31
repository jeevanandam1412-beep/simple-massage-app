'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2, Radio, Sun, Moon } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg('Full name is required');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email.trim(), password, fullName.trim());
        if (error) setErrorMsg(error.message);
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black dark:bg-black light:bg-zinc-100 text-white dark:text-white light:text-zinc-900 flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden transition-colors">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] light:bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Main SaaS Auth Card */}
      <div className="w-full max-w-md bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-3xl p-8 shadow-2xl z-10 relative">
        {/* Top Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-zinc-400 dark:text-zinc-400 light:text-zinc-700 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-900" />}
        </button>

        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white light:bg-black text-black dark:text-black light:text-white flex items-center justify-center font-bold shadow-lg mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white dark:text-white light:text-zinc-900">Signal SaaS Platform</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mt-1 flex items-center gap-1.5 font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Live Supabase WebSocket Realtime
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-1 rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
              !isSignUp
                ? 'bg-white dark:bg-white light:bg-black text-black dark:text-black light:text-white shadow'
                : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-white dark:hover:text-white light:hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
              isSignUp
                ? 'bg-white dark:bg-white light:bg-black text-black dark:text-black light:text-white shadow'
                : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-white dark:hover:text-white light:hover:text-black'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black dark:bg-black light:bg-zinc-100 text-white dark:text-white light:text-zinc-900 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 focus:border-white outline-none transition-colors"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black dark:bg-black light:bg-zinc-100 text-white dark:text-white light:text-zinc-900 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 focus:border-white outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black dark:bg-black light:bg-zinc-100 text-white dark:text-white light:text-zinc-900 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 focus:border-white outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-white dark:bg-white light:bg-black hover:opacity-90 text-black dark:text-black light:text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Connecting to Supabase...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In to Platform'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-xs text-zinc-500 flex items-center gap-1 font-mono">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        End-to-End Encrypted Signal Protocol
      </div>
    </div>
  );
};
