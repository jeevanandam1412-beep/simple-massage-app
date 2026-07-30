import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  status?: 'online' | 'offline' | 'away';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  status,
  className,
  size = 'md',
  color = 'bg-signal-600',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSize = {
    sm: 'w-2.5 h-2.5 right-0 bottom-0 ring-1',
    md: 'w-3 h-3 right-0 bottom-0 ring-2',
    lg: 'w-3.5 h-3.5 right-0.5 bottom-0.5 ring-2',
    xl: 'w-4 h-4 right-1 bottom-1 ring-2',
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden font-medium text-white shadow-md border border-slate-700/50 transition-all duration-200',
          sizeClasses[size],
          color,
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image on error
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        <span className="select-none">{fallback.slice(0, 2).toUpperCase()}</span>
      </div>

      {status && (
        <span
          className={cn(
            'absolute rounded-full ring-slate-900',
            statusSize[size],
            status === 'online'
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              : status === 'away'
              ? 'bg-amber-500'
              : 'bg-slate-500'
          )}
        />
      )}
    </div>
  );
};
