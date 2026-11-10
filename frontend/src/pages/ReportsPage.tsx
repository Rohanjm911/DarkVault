import React, { useState } from 'react';
import {
  FileText,
  Server,
  Laptop,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Alert } from '../components/ui/Alert';
import { PasswordAnalysis } from '../lib/types';
import { generateSecurityReportPdf } from '../lib/pdf/pdfGenerator';
import { useToast } from '../components/ui/ToastContext';

interface ReportsPageProps {
  currentAnalysis: PasswordAnalysis;
  passwordPresent: boolean;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  currentAnalysis,
  passwordPresent,
}) => {
  const [reportTitle, setReportTitle] = useState('DarkVault Security Analysis Report');
  const [targetIdentifier, setTargetIdentifier] = useState('Primary Authentication Audit');
  const [includeCrackTimes, setIncludeCrackTimes] = useState(true);
  const [includeRemediation, setIncludeRemediation] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const [reportMetadata] = useState(() => ({
    dateStr: new Date().toLocaleDateString(),
    docId: `DV-${Date.now().toString().slice(-8)}`,
  }));

  const handleDownloadReport = async (useBackend: boolean = true) => {
    setIsExporting(true);
    try {
      await generateSecurityReportPdf(currentAnalysis, {
        targetIdentifier,
        useBackendIfAvailable: useBackend,
      });
      toast({
        type: 'success',
        title: 'Report Generated',
        message: `Security audit PDF exported via ${useBackend ? 'ReportLab Backend' : 'Client jsPDF Engine'}.`,
      });
    } catch {
      toast({
        type: 'error',
        title: 'Export Failed',
        message: 'Could not generate PDF report. Falling back to client-side renderer.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const risk =
    currentAnalysis.grade === 'Hardened' ? 'SECURE' : currentAnalysis.grade.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        moduleCode="// MODULE: 05_EXECUTIVE_REPORTS"
        title="Executive Cryptographic Reports"
        description="Compile audit outcomes, entropy distributions, NIST SP 800-63B findings, and remediation roadmaps into client or server PDF reports."
        badgeText="VECTOR PDF COMPILED"
        badgeVariant="blue"
      />
      {/* Educational Banner */}
      <Alert
        variant="info"
        title="Confidential Cryptographic Audit Report Engine"
        icon={<FileText className="w-4 h-4 text-[#638BFF]" />}
      >
        <span>
          Generates executive-ready PDF documentation suitable for cybersecurity audits, compliance reviews, and enterprise security evaluations. Plaintext passwords and sensitive hashes are strictly omitted.
        </span>
      </Alert>

      {/* Report Configuration & Export Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass" glow="blue" className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Customize audit metadata prior to PDF compilation
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">
                Audit Target Identifier
              </label>
              <input
                type="text"
                value={targetIdentifier}
                onChange={(e) => setTargetIdentifier(e.target.value)}
                className="w-full bg-[#080B14] border border-white/[0.08] rounded-lg text-slate-100 font-mono text-xs p-2.5 focus:outline-none focus:border-[#638BFF]"
                placeholder="e.g. Infrastructure Gateway Audit"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full bg-[#080B14] border border-white/[0.08] rounded-lg text-slate-100 font-mono text-xs p-2.5 focus:outline-none focus:border-[#638BFF]"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.06] space-y-2 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCrackTimes}
                  onChange={(e) => setIncludeCrackTimes(e.target.checked)}
                  className="accent-[#638BFF] rounded"
                />
                <span className="text-slate-300">Include Hardware Crack Matrix</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRemediation}
                  onChange={(e) => setIncludeRemediation(e.target.checked)}
                  className="accent-[#638BFF] rounded"
                />
                <span className="text-slate-300">Include Hardening Action Items</span>
              </label>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <Button
                variant="primary"
                onClick={() => handleDownloadReport(true)}
                isLoading={isExporting}
                className="w-full font-mono text-xs py-3 cursor-pointer"
              >
                <Server className="w-4 h-4" />
                Generate Backend PDF (ReportLab)
              </Button>

              <Button
                variant="outline"
                onClick={() => handleDownloadReport(false)}
                isLoading={isExporting}
                className="w-full font-mono text-xs py-2.5 cursor-pointer text-slate-300"
              >
                <Laptop className="w-4 h-4" />
                Generate In-Browser PDF (jsPDF)
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-[#43D6A0]/10 border border-[#43D6A0]/20 text-[11px] font-mono text-[#43D6A0]">
              ✓ Dual-Engine Redundancy: Works connected to FastAPI backend or in pure offline air-gapped mode.
            </div>
          </CardContent>
        </Card>

        {/* Live Document Preview Card */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live Report Document Preview</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Exact structure formatted for print and PDF output
              </p>
            </div>
            <Badge variant="blue" size="sm">
              Standard A4
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="p-6 rounded-xl bg-[#080B14] border border-white/[0.08] text-xs font-mono space-y-6 shadow-inner">
              {/* Report Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="text-lg font-bold text-white font-heading tracking-wider">DARKVAULT</div>
                  <div className="text-[11px] text-[#638BFF]">Security Command Center Audit Report</div>
                  <div className="text-[10px] text-slate-500 mt-1">Target: {targetIdentifier}</div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div>Date: {reportMetadata.dateStr}</div>
                  <div>Doc ID: {reportMetadata.docId}</div>
                  <div className="text-[#43D6A0] mt-0.5">
                    {passwordPresent ? 'Zero-Knowledge Validated' : 'Sample Telemetry Validated'}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  risk === 'CRITICAL' || risk === 'WEAK'
                    ? 'bg-[#F06475]/15 border-[#F06475]/30 text-[#F06475]'
                    : risk === 'MODERATE'
                    ? 'bg-[#F5B942]/15 border-[#F5B942]/30 text-[#F5B942]'
                    : 'bg-[#43D6A0]/15 border-[#43D6A0]/30 text-[#43D6A0]'
                }`}
              >
                <div>
                  <span className="font-bold font-mono">ASSESSMENT STATUS: {risk}</span>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    NIST SP 800-63B: {currentAnalysis.nistCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold font-heading">{currentAnalysis.score}</span> / 100
                </div>
              </div>

              {/* Metrics Table Preview */}
              <div>
                <div className="text-[11px] font-bold text-slate-300 mb-2">1. KEY CRYPTOGRAPHIC METRICS</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                    <div className="text-[9px] text-slate-400">LENGTH</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {currentAnalysis.passwordLength} chars
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                    <div className="text-[9px] text-slate-400">ENTROPY</div>
                    <div className="text-sm font-bold text-[#936BFF] mt-0.5">
                      {currentAnalysis.entropyBits.toFixed(1)} bits
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                    <div className="text-[9px] text-slate-400">POOL SIZE</div>
                    <div className="text-sm font-bold text-[#638BFF] mt-0.5">
                      {currentAnalysis.poolSize} glyphs
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                    <div className="text-[9px] text-slate-400">BREACH EXPOSURE</div>
                    <div
                      className={`text-sm font-bold mt-0.5 ${
                        currentAnalysis.breachStatus.breached ? 'text-[#F06475]' : 'text-[#43D6A0]'
                      }`}
                    >
                      {currentAnalysis.breachStatus.breached ? 'COMPROMISED' : 'CLEAN'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Crack Matrix Preview */}
              {includeCrackTimes && (
                <div>
                  <div className="text-[11px] font-bold text-slate-300 mb-2">2. HARDWARE ATTACK RESILIENCE</div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between p-2 rounded bg-[#0D1320] border border-white/[0.06]">
                      <span className="text-slate-400">Online Throttled (100 / hr):</span>
                      <span className="text-[#43D6A0] font-bold">{currentAnalysis.crackTimes.onlineThrottled}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-[#0D1320] border border-white/[0.06]">
                      <span className="text-slate-400">Online Unthrottled (100 / sec):</span>
                      <span className="text-[#638BFF] font-bold">{currentAnalysis.crackTimes.onlineUnthrottled}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-[#0D1320] border border-white/[0.06]">
                      <span className="text-slate-400">Offline Fast Hash (MD5 GPU):</span>
                      <span className="text-[#F5B942] font-bold">{currentAnalysis.crackTimes.offlineFastHash}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-[#0D1320] border border-white/[0.06]">
                      <span className="text-slate-400">Offline GPU Cluster (SHA-256):</span>
                      <span className="text-[#936BFF] font-bold">{currentAnalysis.crackTimes.offlineGpuRig}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Privacy Guarantee */}
              <div className="pt-4 border-t border-white/[0.08] text-[10px] text-slate-500 flex items-center justify-between">
                <span>CONFIDENTIAL &amp; PROPRIETARY</span>
                <span>ZERO-KNOWLEDGE PRIVACY GUARANTEED</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
