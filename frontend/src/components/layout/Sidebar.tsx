import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Database,
  KeyRound,
  FileCheck2,
  FileText,
  Settings,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type TabId =
  | 'dashboard'
  | 'analyzer'
  | 'breach'
  | 'generator'
  | 'audit'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  breachBadgeCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  breachBadgeCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabId,
      label: 'Command Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Security overview & telemetry',
    },
    {
      id: 'analyzer' as TabId,
      label: 'Password Analyzer',
      icon: ShieldCheck,
      badge: null,
      desc: 'Entropy & pattern inspection',
    },
    {
      id: 'breach' as TabId,
      label: 'Breach Range Checker',
      icon: Database,
      badge: breachBadgeCount > 0 ? `${breachBadgeCount}` : null,
      desc: 'HIBP k-anonymity query',
    },
    {
      id: 'generator' as TabId,
      label: 'Key Generator',
      icon: KeyRound,
      badge: null,
      desc: 'Cryptographic secret generator',
    },
    {
      id: 'audit' as TabId,
      label: 'Security Audit',
      icon: FileCheck2,
      badge: null,
      desc: 'NIST checklist & batch audit',
    },
    {
      id: 'reports' as TabId,
      label: 'Executive Reports',
      icon: FileText,
      badge: null,
      desc: 'PDF compliance exports',
    },
    {
      id: 'settings' as TabId,
      label: 'Settings & Privacy',
      icon: Settings,
      badge: null,
      desc: 'Zero-knowledge preferences',
    },
  ];

  const handleSelectTab = (tab: TabId) => {
    onTabChange(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Command Center Modules
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={twMerge(
                  clsx(
                    'group relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all duration-150 cursor-pointer text-left',
                    isActive
                      ? 'bg-[#638BFF]/15 text-[#638BFF] border border-[#638BFF]/35 shadow-[0_0_15px_rgba(99,139,255,0.18)] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#638BFF] before:rounded-r-full'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60 border border-transparent'
                  )
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'w-4 h-4 transition-transform group-hover:scale-110 shrink-0',
                      isActive ? 'text-[#638BFF]' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#F06475]/20 text-[#F06475] border border-[#F06475]/35 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cyber Mini Security Status Card */}
      <div className="mt-6 p-3.5 rounded-xl glass-card holo-sheen border border-white/[0.08] shadow-inner">
        <div className="flex items-center gap-2 text-xs font-mono text-[#43D6A0] font-semibold mb-1">
          <div className="w-2 h-2 rounded-full bg-[#43D6A0] animate-pulse" />
          <span>VAULT ENGINE: ACTIVE</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          In-memory cryptographic sandbox. Zero plaintext logging. Web Crypto API verified.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky, stays locked on scroll) */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-white/[0.08] bg-[#080B14]/80 p-4 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
        {navContent}
      </aside>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-72 max-w-[85vw] bg-[#0D1320] border-r border-white/[0.08] p-5 shadow-2xl z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                  <span className="font-heading font-bold text-white tracking-wider text-base">
                    DARK<span className="text-[#638BFF]">VAULT</span>
                  </span>
                  <button
                    onClick={onCloseMobile}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {navContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
