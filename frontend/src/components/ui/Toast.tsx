import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { ToastContext, Toast, ToastType } from './ToastContext';

export type { Toast, ToastType };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 3500,
    }: {
      type?: ToastType;
      title: string;
      message?: string;
      duration?: number;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="w-4 h-4 text-[#43D6A0] shrink-0" />,
              error: <AlertOctagon className="w-4 h-4 text-[#F06475] shrink-0" />,
              warning: <AlertTriangle className="w-4 h-4 text-[#F5B942] shrink-0" />,
              info: <Info className="w-4 h-4 text-[#638BFF] shrink-0" />,
            };

            const borderColors = {
              success: 'border-[#43D6A0]/30 shadow-[0_0_20px_rgba(67,214,160,0.15)]',
              error: 'border-[#F06475]/30 shadow-[0_0_20px_rgba(240,100,117,0.15)]',
              warning: 'border-[#F5B942]/30 shadow-[0_0_20px_rgba(245,185,66,0.15)]',
              info: 'border-[#638BFF]/30 shadow-[0_0_20px_rgba(99,139,255,0.15)]',
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#111827]/95 backdrop-blur-md border ${borderColors[t.type]} text-slate-100 text-xs font-mono`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{icons[t.type]}</div>
                  <div>
                    <div className="font-semibold text-slate-100">{t.title}</div>
                    {t.message && <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{t.message}</div>}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-500 hover:text-slate-200 transition-colors p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
