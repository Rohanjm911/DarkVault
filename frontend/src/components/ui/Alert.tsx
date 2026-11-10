import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertTriangle, AlertOctagon, Info, CheckCircle2, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'purple';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onDismiss,
  className,
}) => {
  const variantStyles = {
    info: 'bg-[#638BFF]/10 border-[#638BFF]/25 text-[#638BFF] shadow-[0_0_15px_rgba(99,139,255,0.08)]',
    success: 'bg-[#43D6A0]/10 border-[#43D6A0]/25 text-[#43D6A0] shadow-[0_0_15px_rgba(67,214,160,0.08)]',
    warning: 'bg-[#F5B942]/10 border-[#F5B942]/25 text-[#F5B942] shadow-[0_0_15px_rgba(245,185,66,0.08)]',
    danger: 'bg-[#F06475]/10 border-[#F06475]/25 text-[#F06475] shadow-[0_0_15px_rgba(240,100,117,0.08)]',
    purple: 'bg-[#936BFF]/10 border-[#936BFF]/25 text-[#936BFF] shadow-[0_0_15px_rgba(147,107,255,0.08)]',
  };

  const defaultIcons = {
    info: <Info className="w-4 h-4 shrink-0 text-[#638BFF]" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0 text-[#43D6A0]" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0 text-[#F5B942]" />,
    danger: <AlertOctagon className="w-4 h-4 shrink-0 text-[#F06475]" />,
    purple: <Info className="w-4 h-4 shrink-0 text-[#936BFF]" />,
  };

  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'relative flex items-start gap-3 p-3.5 rounded-xl border text-xs font-mono transition-all',
          variantStyles[variant],
          className
        )
      )}
    >
      <div className="mt-0.5">{icon || defaultIcons[variant]}</div>
      <div className="flex-1 min-w-0">
        {title && <div className="font-bold tracking-wide uppercase text-[11px] mb-0.5">{title}</div>}
        <div className="text-slate-300 font-sans leading-relaxed text-xs">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

