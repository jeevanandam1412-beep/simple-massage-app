'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Zap, Mail, Lock, User, ArrowRight, CheckCircle2, Radio, Sun, Moon, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, loginAsGuest } = useAuth();
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
        await signUp(email.trim(), password, fullName.trim());
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden transition-colors">
      {/* Dynamic Glowing Accent Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Blinko Trending Glassmorphic Auth Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl z-10 relative transition-all duration-300 hover:shadow-indigo-500/10">
        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-xl glass-pill text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all hover:scale-105"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Blinko Header Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30 mb-3 animate-bounce">
            <Zap className="w-7 h-7 fill-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-main)] flex items-center gap-1.5">
            Blinko
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-mono font-bold">
              v2.0
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1.5 font-mono">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            Instant Signal-Fast Messaging
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-subtle)] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isSignUp
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isSignUp
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[var(--border-subtle)] focus:border-indigo-500 outline-none transition-colors"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[var(--border-subtle)] focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[var(--border-subtle)] focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 hover:opacity-95 hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <span>Connecting to Blinko...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Blinko Account' : 'Enter Blinko Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Instant Access Option */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => loginAsGuest(fullName || 'Teammate')}
            className="w-full py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Instant Access (Bypass Email Rate Limit)
          </button>
        </div>
      </div>

      <div className="mt-6 text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        Blinko Encrypted Signal Protocol
      </div>
    </div>
  );
};
