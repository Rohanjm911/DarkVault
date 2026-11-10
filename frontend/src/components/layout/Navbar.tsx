import React from 'react';
import { Shield, Lock, Eye, Menu } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080B14]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Left: Mobile menu button + Brand */}
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
                <span className="hidden lg:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-[#638BFF]/15 text-[#638BFF] border border-[#638BFF]/30">
                  v1.0-PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block font-sans">
                Your Password Security Command Center
              </p>
            </div>
          </div>

          {/* Breadcrumb indicator */}
          <div className="hidden xl:flex items-center gap-2 pl-4 ml-2 border-l border-white/[0.08] text-xs font-mono text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="text-[#638BFF] font-semibold">{tabTitles[activeTab]}</span>
          </div>
        </div>

        {/* Center: Zero-Knowledge Privacy status badge */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPrivacyModal}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#43D6A0]/10 border border-[#43D6A0]/30 hover:border-[#43D6A0]/60 hover:bg-[#43D6A0]/15 transition-all text-xs font-mono text-[#43D6A0] cursor-pointer shadow-[0_0_12px_rgba(67,214,160,0.12)]"
            title="Click to view DarkVault Zero-Knowledge Privacy Architecture"
          >
            <Lock className="w-3.5 h-3.5 text-[#43D6A0]" />
            <span className="font-semibold tracking-wider text-[11px]">ZERO-KNOWLEDGE PRIVACY</span>
            <Eye className="w-3 h-3 text-[#43D6A0]/70 group-hover:text-[#43D6A0] transition-colors" />
          </button>
        </div>

        {/* Right: Demo toggle + Quick Action */}
        <div className="flex items-center gap-2.5">
          {/* Demo Data indicator & toggle */}
          <button
            type="button"
            onClick={onToggleDemoData}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
              isDemoData
                ? 'bg-[#F5B942]/15 border-[#F5B942]/35 text-[#F5B942] hover:bg-[#F5B942]/25 shadow-[0_0_12px_rgba(245,185,66,0.15)]'
                : 'bg-[#111827] border-white/[0.08] text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle between live telemetry and demonstration dataset"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDemoData ? 'bg-[#F5B942] animate-pulse' : 'bg-[#43D6A0]'
              }`}
            />
            <span className="font-semibold text-[11px] whitespace-nowrap">
              {isDemoData ? 'DEMO DATA' : 'LIVE DATA'}
            </span>
          </button>

          <Button
            size="sm"
            variant="primary"
            onClick={onQuickAnalyze}
            className="hidden sm:inline-flex text-xs"
          >
            <Shield className="w-3.5 h-3.5 mr-1" />
            New Audit
          </Button>
        </div>
      </div>
    </header>
  );
};
