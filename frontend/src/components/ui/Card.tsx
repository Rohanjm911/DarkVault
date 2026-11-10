import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'blue' | 'purple' | 'green' | 'amber' | 'danger' | 'none';
  variant?: 'glass' | 'solid' | 'subtle';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  variant = 'glass',
  hoverEffect = false,
  className,
  ...props
}) => {
  const glowStyles = {
    none: '',
    blue: 'shadow-[0_0_25px_-5px_rgba(99,139,255,0.18)] border-[#638BFF]/25 hover:border-[#638BFF]/45',
    purple: 'shadow-[0_0_25px_-5px_rgba(147,107,255,0.18)] border-[#936BFF]/25 hover:border-[#936BFF]/45',
    green: 'shadow-[0_0_25px_-5px_rgba(67,214,160,0.18)] border-[#43D6A0]/25 hover:border-[#43D6A0]/45',
    amber: 'shadow-[0_0_25px_-5px_rgba(245,185,66,0.18)] border-[#F5B942]/25 hover:border-[#F5B942]/45',
    danger: 'shadow-[0_0_25px_-5px_rgba(240,100,117,0.18)] border-[#F06475]/25 hover:border-[#F06475]/45',
  };

  const variantStyles = {
    glass: 'glass-card',
    solid: 'bg-[#111827] border border-slate-800 shadow-xl',
    subtle: 'glass-panel',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl transition-all duration-300 overflow-hidden',
          variantStyles[variant],
          glowStyles[glow],
          hoverEffect && 'hover:-translate-y-1 hover:shadow-2xl holo-sheen cursor-default',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('p-5 pb-3 border-b border-white/[0.06]', className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={twMerge(
      clsx(
        'text-sm font-semibold text-slate-100 flex items-center gap-2 font-heading tracking-tight',
        className
      )
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={twMerge(clsx('text-xs text-slate-400 mt-0.5 font-sans', className))} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('p-5', className))} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={twMerge(
      clsx(
        'p-4 px-5 bg-[#080B14]/40 border-t border-white/[0.06] flex items-center justify-between text-xs',
        className
      )
    )}
    {...props}
  >
    {children}
  </div>
);
