import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyber' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#638BFF]/50 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer font-mono tracking-tight';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#638BFF] to-[#4F46E5] hover:from-[#527cf5] hover:to-[#4338ca] text-white shadow-lg shadow-[#638BFF]/20 border border-blue-400/30',
      secondary:
        'bg-[#111827] hover:bg-[#1a2338] text-slate-200 border border-slate-700/80 hover:border-slate-600 shadow-md',
      cyber:
        'bg-[#43D6A0]/15 text-[#43D6A0] border border-[#43D6A0]/40 hover:bg-[#43D6A0]/25 shadow-[0_0_15px_rgba(67,214,160,0.2)]',
      purple:
        'bg-[#936BFF]/15 text-[#936BFF] border border-[#936BFF]/40 hover:bg-[#936BFF]/25 shadow-[0_0_15px_rgba(147,107,255,0.2)]',
      outline:
        'border border-slate-700/80 bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
      ghost:
        'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white border border-transparent',
      danger:
        'bg-[#F06475]/15 text-[#F06475] border border-[#F06475]/40 hover:bg-[#F06475]/25 shadow-[0_0_15px_rgba(240,100,117,0.2)]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-md',
      md: 'text-xs px-4 py-2 gap-2 rounded-lg',
      lg: 'text-sm px-5 py-2.5 gap-2.5 rounded-xl',
      icon: 'p-2 aspect-square rounded-lg',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? undefined : { y: -1 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
