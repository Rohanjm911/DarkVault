import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabId } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { ToastProvider } from './components/ui/Toast';
import { useToast } from './components/ui/ToastContext';

import { DashboardPage } from './pages/DashboardPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { BreachCheckerPage } from './pages/BreachCheckerPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { AuditPage } from './pages/AuditPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { analyzePassword } from './lib/crypto/entropy';
import { checkPasswordBreach } from './lib/api/hibp';
import { getDashboardStats, sendTelemetry } from './lib/api/client';
import { recordSessionAudit } from './lib/store/sessionTelemetryStore';
import { useSettingsStore } from './lib/store/useSettingsStore';
import { generateSecurityReportPdf } from './lib/pdf/pdfGenerator';
import {
  PasswordAnalysis,
  BreachResult,
  DashboardMetrics,
} from './lib/types';
import { Lock, Laptop, Server, CheckCircle2 } from 'lucide-react';

function DarkVaultApp() {
  const { settings, updateSetting, resetSettings, clearVaultMemory } = useSettingsStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [password, setPassword] = useState<string>('P@ssw0rd2024!#Secure');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [breachStatus, setBreachStatus] = useState<BreachResult>({
    checked: false,
    breached: false,
    count: 0,
    prefix: '',
    suffix: '',
    loading: false,
  });

  const [analysis, setAnalysis] = useState<PasswordAnalysis>(() =>
    analyzePassword('P@ssw0rd2024!#Secure')
  );

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    isDemoData: true,
    overallSecurityScore: 78,
    totalAnalyses: 142,
    strongPasswords: 89,
    weakPasswords: 31,
    breachesDetected: 22,
    strengthDistribution: [
      { category: 'Very Weak (0-20)', count: 12, percentage: 8.5 },
      { category: 'Weak (21-40)', count: 19, percentage: 13.4 },
      { category: 'Moderate (41-60)', count: 22, percentage: 15.5 },
      { category: 'Strong (61-80)', count: 48, percentage: 33.8 },
      { category: 'Hardened (81-100)', count: 41, percentage: 28.8 },
    ],
    activityTimeline: [],
    recentAlerts: [],
  });

  // Sync Accent Theme dynamically across DOM
  useEffect(() => {
    document.documentElement.dataset.accent = settings.accentColor;
  }, [settings.accentColor]);

  // Support Clear Memory On Browser Close
  useEffect(() => {
    if (settings.clearMemoryOnClose) {
      const handleBeforeUnload = () => {
        clearVaultMemory();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [settings.clearMemoryOnClose, clearVaultMemory]);

  // Load dashboard metrics on mount and when demo flag changes
  const loadMetrics = useCallback(async (forceDemo?: boolean) => {
    const isDemo = forceDemo !== undefined ? forceDemo : true;
    const data = await getDashboardStats(isDemo);
    setMetrics(data);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getDashboardStats(true).then((data) => {
      if (isMounted) {
        setMetrics(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Re-evaluate current password when NIST strict rules toggle changes
  const [prevNistStrict, setPrevNistStrict] = useState(settings.nistStrictRules);
  if (settings.nistStrictRules !== prevNistStrict) {
    setPrevNistStrict(settings.nistStrictRules);
    if (password) {
      setAnalysis(
        analyzePassword(password, breachStatus, {
          nistStrictRules: settings.nistStrictRules,
        })
      );
    }
  }

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    const updatedBreach: BreachResult = {
      checked: false,
      breached: false,
      count: 0,
      prefix: '',
      suffix: '',
      loading: false,
    };
    setBreachStatus(updatedBreach);
    const res = analyzePassword(newPassword, updatedBreach, {
      nistStrictRules: settings.nistStrictRules,
    });
    setAnalysis(res);

    if (newPassword.trim().length > 0) {
      recordSessionAudit({
        action: 'Credential Analysis',
        score: res.score,
        risk: res.grade === 'Hardened' ? 'SECURE' : (res.grade.toUpperCase() as any),
        details: `Audited ${res.passwordLength}-char secret (${res.entropyBits.toFixed(1)} bits entropy, ${res.grade})`,
        breached: false,
      });

      if (!metrics.isDemoData) {
        loadMetrics(false);
      }
    }
  };

  const handleExecuteBreachCheck = async (customPassword?: string) => {
    const target = customPassword !== undefined ? customPassword : password;
    if (!target) return;

    setBreachStatus((prev) => ({ ...prev, loading: true }));

    const result = await checkPasswordBreach(target, {
      useBackendProxy: settings.useBackendProxy,
    });

    setBreachStatus(result);
    const updatedAnalysis = analyzePassword(target, result, {
      nistStrictRules: settings.nistStrictRules,
    });
    setAnalysis(updatedAnalysis);

    recordSessionAudit({
      action: 'Zero-Knowledge Breach Scan',
      score: updatedAnalysis.score,
      risk: result.breached ? 'CRITICAL' : 'SECURE',
      details: result.breached
        ? `Exposed: found ${result.count.toLocaleString()} occurrences in public leaks`
        : 'Clean: zero breach hits identified across 1B+ records',
      breached: result.breached,
    });

    if (!metrics.isDemoData) {
      loadMetrics(false);
    }

    if (result.breached) {
      toast({
        type: 'error',
        title: 'Breach Detected',
        message: `Found ${result.count.toLocaleString()} occurrences in public leaks.`,
      });
    } else {
      toast({
        type: 'success',
        title: 'Clean Credential',
        message: 'No breach hits identified across 1+ billion records.',
      });
    }

    // Send strictly anonymous telemetry if user opted in
    if (settings.anonymousTelemetry) {
      sendTelemetry({
        audit_type: 'breach_check',
        entropy_bits: updatedAnalysis.entropyBits,
        strength_score: updatedAnalysis.score,
        risk_level: updatedAnalysis.grade.toUpperCase(),
        length: updatedAnalysis.passwordLength,
        breached: result.breached,
        breach_count: result.count,
        has_uppercase: updatedAnalysis.characterStats.uppercase > 0,
        has_lowercase: updatedAnalysis.characterStats.lowercase > 0,
        has_numbers: updatedAnalysis.characterStats.numbers > 0,
        has_symbols: updatedAnalysis.characterStats.symbols > 0,
        nist_compliant: updatedAnalysis.nistCompliant,
      });
    }
  };

  const handleToggleDemoData = () => {
    const nextState = !metrics.isDemoData;
    loadMetrics(nextState);
    toast({
      type: 'info',
      title: nextState ? 'Demo Telemetry Enabled' : 'Live Database Telemetry Active',
      message: nextState
        ? 'Displaying simulated SOC enterprise statistics.'
        : 'Displaying verified in-memory telemetry.',
    });
  };

  const handleSendToAnalyzer = (pwd: string) => {
    handlePasswordChange(pwd);
    setActiveTab('analyzer');
  };

  const handleExportPdf = () => {
    generateSecurityReportPdf(analysis, {
      targetIdentifier: 'Credential Security Audit',
      useBackendIfAvailable: settings.useBackendProxy,
    });
    toast({
      type: 'success',
      title: 'Audit PDF Generated',
      message: 'Executive security assessment downloaded.',
    });
  };

  const pageVariants: Record<string, any> = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col font-sans cyber-grid selection:bg-[#638BFF]/30 selection:text-blue-200">
      {/* Top Navigation */}
      <Navbar
        isDemoData={metrics.isDemoData}
        onToggleDemoData={handleToggleDemoData}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onQuickAnalyze={() => {
          setPassword('');
          handlePasswordChange('');
          setActiveTab('analyzer');
        }}
        activeTab={activeTab}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          breachBadgeCount={breachStatus.breached ? breachStatus.count : 0}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardPage
                  metrics={metrics}
                  onNavigate={setActiveTab}
                  onToggleDemoData={handleToggleDemoData}
                />
              )}

              {activeTab === 'analyzer' && (
                <AnalyzerPage
                  password={password}
                  onPasswordChange={handlePasswordChange}
                  analysis={analysis}
                  onCheckBreach={handleExecuteBreachCheck}
                  onExportPdf={handleExportPdf}
                />
              )}

              {activeTab === 'breach' && (
                <BreachCheckerPage
                  password={password}
                  onPasswordChange={handlePasswordChange}
                  breachStatus={breachStatus}
                  onExecuteCheck={handleExecuteBreachCheck}
                  useBackendProxy={settings.useBackendProxy}
                />
              )}

              {activeTab === 'generator' && (
                <GeneratorPage onSendToAnalyzer={handleSendToAnalyzer} />
              )}

              {activeTab === 'audit' && <AuditPage />}

              {activeTab === 'reports' && (
                <ReportsPage
                  currentAnalysis={analysis}
                  passwordPresent={password.length > 0}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage
                  settings={settings}
                  onUpdateSetting={updateSetting}
                  onResetSettings={resetSettings}
                  onClearMemory={clearVaultMemory}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Zero-Knowledge Privacy Architecture Modal */}
      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="DarkVault Zero-Knowledge Privacy Architecture"
        icon={<Lock className="w-5 h-5 text-[#43D6A0]" />}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs font-mono text-slate-300">
          <div className="p-3.5 rounded-xl bg-[#43D6A0]/10 border border-[#43D6A0]/20 text-[#43D6A0]">
            <strong>OUR ZERO-KNOWLEDGE PLEDGE:</strong> Plaintext passwords NEVER leave your device.
            DarkVault was engineered from the ground up for strict confidentiality and data protection.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#080B14] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2 text-[#638BFF] font-bold">
                <Laptop className="w-4 h-4" />
                <span>100% Client-Side Evaluation</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                Password entropy, character diversity, regex checks, and dictionary pattern matches run in browser memory using Web Crypto APIs.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B14] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2 text-[#936BFF] font-bold">
                <Server className="w-4 h-4" />
                <span>K-Anonymity HIBP Lookups</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                When querying breach lists, only the first 5 characters of your SHA-1 hash are queried. The server never learns your full hash or password.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <div className="font-semibold text-slate-200">Strict Prohibitions in DarkVault:</div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400 font-sans">
              <li>No plaintext password query parameters (enforced at API middleware).</li>
              <li>No logging of passwords or raw credential hashes.</li>
              <li>No persistent database storage of analyzed secrets.</li>
              <li>Reports never display password characters or full hashes.</li>
            </ul>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPrivacyModalOpen(false)}
              className="font-mono text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <DarkVaultApp />
    </ToastProvider>
  );
}

export default App;
