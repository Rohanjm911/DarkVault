import React from 'react';
import { Shield, Lock, Eye, RefreshCw, Menu } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TabId } from './Sidebar';

interface NavbarProps {
  isDemoData: boolean;
  onToggleDemoData: () => void;
  onOpenPrivacyModal: () => void;
  onQuickAnalyze: () => void;
  activeTab: TabId;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDemoData,
  onToggleDemoData,
  onOpenPrivacyModal,
  onQuickAnalyze,
  activeTab,
  onToggleMobileMenu,
}) => {
  const tabTitles: Record<TabId, string> = {
    dashboard: 'Command Dashboard',
    analyzer: 'Password Analyzer',
    breach: 'Breach Range Checker',
    generator: 'Cryptographic Generator',
    audit: 'NIST Security Audit',
    reports: 'Executive Reports',
    settings: 'Settings & Privacy',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080B14]/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Left: Mobile menu button + Brand + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#638BFF] via-[#7B73FF] to-[#936BFF] p-0.5 shadow-[0_0_20px_rgba(99,139,255,0.4)]">
              <div className="flex items-center justify-center w-full h-full bg-[#080B14] rounded-[10px]">
                <Shield className="w-5 h-5 text-[#638BFF]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold tracking-wider text-white">
                  DARK<span className="text-[#638BFF]">VAULT</span>
                </span>
                <Badge variant="blue" size="sm" className="hidden lg:inline-flex text-[10px]">
                  v1.0.0-PRO
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block font-sans">
                Your Password Security Command Center
              </p>
            </div>
          </div>

          {/* Breadcrumb separator */}
          <div className="hidden xl:flex items-center gap-2 pl-4 ml-4 border-l border-white/[0.08] text-xs font-mono text-slate-400">
            <span className="text-slate-500">SOC</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold">{tabTitles[activeTab]}</span>
          </div>
        </div>

        {/* Center: Zero-Knowledge Privacy status badge */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenPrivacyModal}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#43D6A0]/10 border border-[#43D6A0]/25 hover:border-[#43D6A0]/50 hover:bg-[#43D6A0]/15 transition-all text-xs font-mono text-[#43D6A0] cursor-pointer shadow-[0_0_12px_rgba(67,214,160,0.12)]"
            title="Click to view DarkVault Zero-Knowledge Privacy Architecture"
          >
            <Lock className="w-3.5 h-3.5 text-[#43D6A0] animate-pulse" />
            <span className="font-semibold tracking-wide">ZERO-KNOWLEDGE PRIVACY</span>
            <Eye className="w-3 h-3 text-[#43D6A0]/70 group-hover:text-[#43D6A0] transition-colors" />
          </button>
        </div>

        {/* Right: Demo toggle + Quick Action */}
        <div className="flex items-center gap-2.5">
          {/* Demo Data indicator & toggle */}
          <button
            onClick={onToggleDemoData}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
              isDemoData
                ? 'bg-[#F5B942]/15 border-[#F5B942]/35 text-[#F5B942] hover:bg-[#F5B942]/25 shadow-[0_0_12px_rgba(245,185,66,0.15)]'
                : 'bg-[#111827] border-slate-700/80 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle between real telemetry and demonstration dataset"
          >
            <RefreshCw className="w-3 h-3 text-current" />
            <span className="font-semibold">{isDemoData ? 'DEMO DATA' : 'LIVE METRICS'}</span>
          </button>

          <Button
            size="sm"
            variant="primary"
            onClick={onQuickAnalyze}
            className="hidden sm:inline-flex text-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            New Audit
          </Button>
        </div>
      </div>
    </header>
  );
};
