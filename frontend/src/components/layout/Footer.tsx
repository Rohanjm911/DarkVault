import React from 'react';
import { Shield, Lock, Terminal, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#080B14]/90 py-4 px-6 text-xs text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-4 h-4 text-[#638BFF]" />
          <span className="font-heading font-semibold text-slate-200">DARKVAULT</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Password Security Command Center</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-[#43D6A0]">
            <Lock className="w-3.5 h-3.5" />
            <span>K-Anonymity SHA-1</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-[#638BFF]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Web Crypto Subtles</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-[#936BFF]">
            <Shield className="w-3.5 h-3.5" />
            <span>NIST SP 800-63B</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          <span>Zero-Knowledge Air-Gapped Engine</span>
        </div>
      </div>
    </footer>
  );
};
