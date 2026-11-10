import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'outline' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles = {
    blue: 'bg-[#638BFF]/12 text-[#638BFF] border border-[#638BFF]/30 shadow-[0_0_12px_rgba(99,139,255,0.15)]',
    purple: 'bg-[#936BFF]/12 text-[#936BFF] border border-[#936BFF]/30 shadow-[0_0_12px_rgba(147,107,255,0.15)]',
    green: 'bg-[#43D6A0]/12 text-[#43D6A0] border border-[#43D6A0]/30 shadow-[0_0_12px_rgba(67,214,160,0.15)]',
    amber: 'bg-[#F5B942]/12 text-[#F5B942] border border-[#F5B942]/30 shadow-[0_0_12px_rgba(245,185,66,0.15)]',
    red: 'bg-[#F06475]/12 text-[#F06475] border border-[#F06475]/30 shadow-[0_0_12px_rgba(240,100,117,0.15)]',
    outline: 'border border-slate-700/80 text-slate-300 bg-slate-900/40',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
  };

  const dotColors = {
    blue: 'bg-[#638BFF]',
    purple: 'bg-[#936BFF]',
    green: 'bg-[#43D6A0]',
    amber: 'bg-[#F5B942]',
    red: 'bg-[#F06475]',
    outline: 'bg-slate-400',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded font-mono',
    md: 'text-xs px-2.5 py-1 rounded-md font-mono font-medium tracking-tight',
    lg: 'text-xs px-3 py-1.5 rounded-lg font-mono font-semibold tracking-wide',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 transition-all select-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={twMerge(
              clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotColors[variant])
            )}
          />
          <span className={twMerge(clsx('relative inline-flex rounded-full h-1.5 w-1.5', dotColors[variant]))} />
        </span>
      )}
      {children}
    </span>
  );
};
