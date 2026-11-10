import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  glow?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  height = 'md',
  showLabel = false,
  className,
  glow = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  // Color mapping based on exact color system
  let barColor = 'from-[#F06475] to-[#f43f5e]';
  let glowColor = 'shadow-[0_0_12px_rgba(240,100,117,0.5)]';

  if (percentage >= 80) {
    barColor = 'from-[#638BFF] via-[#7B73FF] to-[#936BFF]';
    glowColor = 'shadow-[0_0_14px_rgba(99,139,255,0.55)]';
  } else if (percentage >= 60) {
    barColor = 'from-[#43D6A0] to-[#10b981]';
    glowColor = 'shadow-[0_0_12px_rgba(67,214,160,0.5)]';
  } else if (percentage >= 35) {
    barColor = 'from-[#F5B942] to-[#f59e0b]';
    glowColor = 'shadow-[0_0_12px_rgba(245,185,66,0.5)]';
  }

  return (
    <div className={twMerge(clsx('w-full', className))}>
      {showLabel && (
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
          <span>STRENGTH PROFILE</span>
          <span className="font-semibold text-slate-200">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={twMerge(
          clsx('w-full bg-[#080B14] rounded-full overflow-hidden p-0.5 border border-slate-800/80', heightStyles[height])
        )}
      >
        <div
          className={twMerge(
            clsx(
              'h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r relative overflow-hidden',
              barColor,
              glow && glowColor
            )
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
