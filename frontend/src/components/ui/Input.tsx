import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  isPassword?: boolean;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, isPassword = false, onClear, type = 'text', className, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={actualType}
          value={value}
          className={twMerge(
            clsx(
              'w-full bg-[#0D1320]/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder:text-slate-500 font-mono text-xs py-2.5 px-3.5 transition-all duration-150 focus:outline-none focus:border-[#638BFF] focus:ring-2 focus:ring-[#638BFF]/25 shadow-inner',
              icon && 'pl-10',
              (isPassword || onClear) && 'pr-20',
              className
            )
          )}
          {...props}
        />

        <div className="absolute right-2.5 flex items-center gap-1.5 text-slate-400">
          {onClear && value && String(value).length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:text-slate-200 hover:bg-slate-800/60 rounded transition-colors cursor-pointer"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:text-[#638BFF] hover:bg-slate-800/60 rounded transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
