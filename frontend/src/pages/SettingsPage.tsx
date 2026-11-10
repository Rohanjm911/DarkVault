import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { AppSettings } from '../lib/types';
import { useToast } from '../components/ui/ToastContext';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onResetSettings: () => void;
  onClearMemory: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSetting,
  onResetSettings,
  onClearMemory,
}) => {
  const [clearedNotice, setClearedNotice] = useState(false);
  const { toast } = useToast();

  const handleClear = () => {
    onClearMemory();
    setClearedNotice(true);
    toast({
      type: 'warning',
      title: 'Vault Memory Purged',
      message: 'All temporary in-memory credentials and history removed.',
    });
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        moduleCode="// MODULE: 06_SETTINGS_PRIVACY"
        title="Settings & Privacy Governance"
        description="Configure local runtime behavior, API proxy preferences, volatile memory controls, and zero-knowledge data retention policies."
        badgeText="ZERO-LOGGING ENFORCED"
        badgeVariant="green"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetSettings}
              className="cursor-pointer font-mono text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClear}
              className="cursor-pointer font-mono text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge Memory
            </Button>
          </div>
        }
      />
      {/* Educational Banner */}
      <div className="p-4 rounded-xl bg-[#111827]/80 border border-white/[0.08] text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2 mb-1 text-[#638BFF] font-semibold">
          <SettingsIcon className="w-4 h-4" />
          <span>PRIVACY PREFERENCES &amp; CRYPTOGRAPHIC CONTROLS</span>
        </div>
        <p className="text-slate-400 font-sans leading-relaxed">
          Configure local runtime behavior, API proxy preferences, and zero-knowledge data retention policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Privacy & Data Retention */}
        <Card variant="glass" glow="blue">
          <CardHeader>
            <CardTitle>Zero-Knowledge Privacy Controls</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Control client-side memory lifecycle and external communications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Backend Proxy Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080B14] border border-white/[0.06]">
              <div className="space-y-0.5 pr-4">
                <div className="text-xs font-semibold text-slate-200 font-mono">
                  Breach Query Proxying
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Route 5-char SHA-1 prefixes through DarkVault backend to bypass local browser CORS / adblocker restrictions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.useBackendProxy}
                onChange={(e) => onUpdateSetting('useBackendProxy', e.target.checked)}
                className="accent-[#638BFF] w-4 h-4 rounded cursor-pointer shrink-0"
              />
            </div>

            {/* Anonymous Telemetry Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080B14] border border-white/[0.06]">
              <div className="space-y-0.5 pr-4">
                <div className="text-xs font-semibold text-slate-200 font-mono">
                  Anonymous Aggregate Telemetry
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Record purely anonymized metrics (entropy bits, length, score). Plaintext passwords and hashes are strictly forbidden.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.anonymousTelemetry}
                onChange={(e) => onUpdateSetting('anonymousTelemetry', e.target.checked)}
                className="accent-[#638BFF] w-4 h-4 rounded cursor-pointer shrink-0"
              />
            </div>

            {/* NIST Strict Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080B14] border border-white/[0.06]">
              <div className="space-y-0.5 pr-4">
                <div className="text-xs font-semibold text-slate-200 font-mono">
                  NIST SP 800-63B Strict Evaluation
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Strictly enforce 16+ character enterprise recommendation and ban dictionary words.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.nistStrictRules}
                onChange={(e) => onUpdateSetting('nistStrictRules', e.target.checked)}
                className="accent-[#638BFF] w-4 h-4 rounded cursor-pointer shrink-0"
              />
            </div>

            {/* Reset Settings to Defaults */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-300 font-mono">Reset Configuration</div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Restore default zero-knowledge settings.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onResetSettings();
                  toast({
                    type: 'info',
                    title: 'Settings Reset',
                    message: 'Restored default vault preferences.',
                  });
                }}
                className="font-mono text-xs cursor-pointer text-slate-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </Button>
            </div>

            {/* Memory Purge */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#F06475] font-mono">Purge Vault Memory</div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Erase all cached sessions, history, and test items from browser storage.
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleClear}
                className="font-mono text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purge Now
              </Button>
            </div>

            {clearedNotice && (
              <div className="p-2.5 rounded-lg bg-[#F06475]/10 border border-[#F06475]/25 text-[#F06475] text-xs font-mono text-center">
                ✓ All temporary vault memory and cached records successfully purged.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme & About Section */}
        <div className="space-y-6">
          {/* Accent Color Selection */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Cyber Command Theme Accents</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Adjust primary terminal glow accents
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSetting('accentColor', 'blue')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    settings.accentColor === 'blue'
                      ? 'bg-[#638BFF]/20 border-[#638BFF] shadow-[0_0_15px_rgba(99,139,255,0.3)] text-[#638BFF]'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#638BFF]" />
                  <span>Electric Blue</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSetting('accentColor', 'green')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    settings.accentColor === 'green'
                      ? 'bg-[#43D6A0]/20 border-[#43D6A0] shadow-[0_0_15px_rgba(67,214,160,0.3)] text-[#43D6A0]'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#43D6A0]" />
                  <span>Cyber Green</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSetting('accentColor', 'purple')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    settings.accentColor === 'purple'
                      ? 'bg-[#936BFF]/20 border-[#936BFF] shadow-[0_0_15px_rgba(147,107,255,0.3)] text-[#936BFF]'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#936BFF]" />
                  <span>Neon Purple</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* About DarkVault */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>System Architecture &amp; Integrity</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Version and compliance architecture specifications
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Application:</span>
                <span className="text-slate-200 font-bold">DarkVault v1.0.0-PRO</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Tagline:</span>
                <span className="text-[#638BFF]">Your Password Security Command Center</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Cryptographic Standard:</span>
                <span className="text-slate-200">FIPS 180-4 SHA-1 (K-Anonymity)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Guideline Standard:</span>
                <span className="text-slate-200">NIST SP 800-63B Identity</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Random Engine:</span>
                <span className="text-[#43D6A0]">Web Crypto API (Subtle)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Backend API:</span>
                <span className="text-[#936BFF]">FastAPI + Python 3.14 + SQLite/PG</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
