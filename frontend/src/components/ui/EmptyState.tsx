import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#0D1320]/60 border border-white/[0.06] backdrop-blur-md">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#111827] border border-white/[0.08] shadow-[0_0_20px_rgba(99,139,255,0.15)] text-[#638BFF] mb-4">
        {icon || <ShieldAlert className="w-7 h-7" />}
      </div>
      <h3 className="font-heading text-base font-bold text-slate-100 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-5 font-sans leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
