import React from 'react';
import { Badge } from './Badge';

interface PageHeaderProps {
  moduleCode: string;
  title: string;
  description: string;
  badgeText?: string;
  badgeVariant?: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'outline' | 'neutral';
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  moduleCode,
  title,
  description,
  badgeText,
  badgeVariant = 'blue',
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#638BFF]/90">
            {moduleCode}
          </span>
          {badgeText && (
            <Badge variant={badgeVariant} size="sm" dot>
              {badgeText}
            </Badge>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
          {description}
        </p>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
