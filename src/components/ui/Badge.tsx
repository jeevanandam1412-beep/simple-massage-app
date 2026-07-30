import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'signal' | 'outline' | 'destructive' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    signal: 'bg-signal-600/20 text-signal-400 border-signal-500/30',
    outline: 'border border-slate-700 text-slate-400',
    destructive: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border backdrop-blur-sm transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
