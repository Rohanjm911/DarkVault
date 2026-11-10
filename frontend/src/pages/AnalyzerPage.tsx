import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Database,
  FileDown,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Alert } from '../components/ui/Alert';
import { Tooltip } from '../components/ui/Tooltip';
import { Input } from '../components/ui/Input';
import { Progress } from '../components/ui/Progress';
import { PasswordAnalysis } from '../lib/types';
import { useToast } from '../components/ui/ToastContext';

interface AnalyzerPageProps {
  password: string;
  onPasswordChange: (newPassword: string) => void;
  analysis: PasswordAnalysis;
  onCheckBreach: () => Promise<void>;
  onExportPdf: () => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  password,
  onPasswordChange,
  analysis,
  onCheckBreach,
  onExportPdf,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      type: 'success',
      title: 'Credential Copied',
      message: 'Password copied to clipboard memory.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getGradeVariant = (grade: PasswordAnalysis['grade']) => {
    switch (grade) {
      case 'Hardened':
        return 'purple';
      case 'Strong':
        return 'green';
      case 'Moderate':
        return 'amber';
      case 'Weak':
      case 'Critical':
      default:
        return 'red';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        moduleCode="// MODULE: 01_ANALYZER"
        title="Cryptographic Password Analyzer"
        description="High-precision Shannon entropy calculation, character diversity analysis, dictionary pattern recognition, and brute-force crack time estimates."
        badgeText="100% IN-MEMORY SANDBOX"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPdf}
              className="cursor-pointer font-mono text-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              Export PDF
            </Button>
            <Button
              variant="cyber"
              size="sm"
              onClick={onCheckBreach}
              disabled={!password}
              className="cursor-pointer font-mono text-xs"
            >
              <Database className="w-3.5 h-3.5" />
              Check Breach
            </Button>
          </div>
        }
      />
      {/* Air-Gapped Header Notice */}
      <Alert
        variant="info"
        title="Air-Gapped Client Analysis Active"
        icon={<Zap className="w-4 h-4 text-[#638BFF]" />}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>
            Shannon entropy, character pool evaluation, and dictionary heuristics run 100% in volatile client-side memory. Zero bytes transmitted over network.
          </span>
          <span className="text-[#43D6A0] text-[11px] font-mono font-semibold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#43D6A0] animate-pulse" />
            Web Crypto Sandbox
          </span>
        </div>
      </Alert>

      {/* Main Password Input Card */}
      <Card variant="glass" glow="blue">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#638BFF]" />
              Target Credential for Cryptographic Audit
            </label>
            <div className="flex items-center gap-3">
              {password && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#43D6A0]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
              <span className="text-xs font-mono text-slate-500">
                Length: <strong className="text-slate-200">{analysis.passwordLength}</strong>
              </span>
            </div>
          </div>

          <Input
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onClear={() => onPasswordChange('')}
            isPassword={true}
            placeholder="Type or paste password to analyze in local memory..."
            className="text-sm py-3.5 bg-[#080B14]"
          />

          {/* Quick preset test buttons */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[11px]">Test Profiles:</span>
            <button
              onClick={() => onPasswordChange('password123')}
              className="px-2.5 py-1 rounded-md bg-[#F06475]/10 hover:bg-[#F06475]/20 text-[#F06475] text-[11px] border border-[#F06475]/25 transition-colors cursor-pointer"
            >
              Weak: password123
            </button>
            <button
              onClick={() => onPasswordChange('p@$$w0rd2024!')}
              className="px-2.5 py-1 rounded-md bg-[#F5B942]/10 hover:bg-[#F5B942]/20 text-[#F5B942] text-[11px] border border-[#F5B942]/25 transition-colors cursor-pointer"
            >
              Leet: p@$$w0rd2024!
            </button>
            <button
              onClick={() => onPasswordChange('correct-horse-battery-staple-99!')}
              className="px-2.5 py-1 rounded-md bg-[#43D6A0]/10 hover:bg-[#43D6A0]/20 text-[#43D6A0] text-[11px] border border-[#43D6A0]/25 transition-colors cursor-pointer"
            >
              Passphrase: correct-horse...
            </button>
            <button
              onClick={() => onPasswordChange('kX9#mQ2$vL7@wP4*zR8!')}
              className="px-2.5 py-1 rounded-md bg-[#936BFF]/10 hover:bg-[#936BFF]/20 text-[#936BFF] text-[11px] border border-[#936BFF]/25 transition-colors cursor-pointer"
            >
              Hardened: kX9#mQ2$...
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row: Score, Entropy, Pool */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strength Score Card */}
        <Card variant="glass" glow="blue">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>SECURITY SCORE</span>
              <Badge variant={getGradeVariant(analysis.grade)} size="sm">
                {analysis.grade.toUpperCase()}
              </Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-heading text-white tracking-tight">
                {analysis.score}
              </span>
              <span className="text-xs font-mono text-slate-500">/ 100</span>
            </div>
            <div className="mt-3">
              <Progress value={analysis.score} height="md" />
            </div>
          </CardContent>
        </Card>

        {/* Shannon Entropy */}
        <Card variant="glass" glow="purple">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <Tooltip content="H = L * log2(N) minus dictionary, repeat & keyboard pattern deductions">
                <span className="cursor-help underline decoration-dotted decoration-slate-600">SHANNON ENTROPY</span>
              </Tooltip>
              <Badge variant="purple" size="sm">
                Log2 Scale
              </Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-heading text-[#936BFF] tracking-tight">
                {analysis.entropyBits.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-500">bits</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400 font-sans leading-tight">
              {analysis.entropyBits >= 65
                ? 'High entropy (>65 bits). Resilient against advanced GPU offline cracking.'
                : analysis.entropyBits >= 45
                ? 'Moderate entropy. Increase length or eliminate predictable patterns.'
                : 'Insufficient entropy (<45 bits). Highly vulnerable to dictionary attacks.'}
            </p>
          </CardContent>
        </Card>

        {/* Character Pool & Diversity */}
        <Card variant="glass" glow="green">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <Tooltip content="Total unique character set size used in candidate keyspace calculation">
                <span className="cursor-help underline decoration-dotted decoration-slate-600">CHARACTER POOL</span>
              </Tooltip>
              <Badge variant="green" size="sm">
                R = {analysis.poolSize} Glyphs
              </Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-heading text-[#43D6A0] tracking-tight">
                {analysis.characterStats.unique}
              </span>
              <span className="text-xs font-mono text-slate-500">unique / {analysis.passwordLength} chars</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400 font-sans leading-tight">
              Permutation space: {analysis.poolSize > 0 ? `2^${analysis.entropyBits.toFixed(0)}` : '0'} theoretical possibilities.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Character Composition & Threat Model Crack Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Diversity Grid */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Character Composition Analysis</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of character categories across the credential
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Lowercase */}
              <div className="p-3 rounded-lg bg-[#080B14] border border-white/[0.06] text-center">
                <div className="text-[10px] font-mono text-slate-400">LOWERCASE (a-z)</div>
                <div className="text-xl font-bold font-heading text-slate-200 mt-1">
                  {analysis.characterStats.lowercase}
                </div>
                <div className="mt-1">
                  <Badge variant={analysis.characterStats.lowercase > 0 ? 'green' : 'outline'} size="sm">
                    {analysis.characterStats.lowercase > 0 ? 'Present' : 'Missing'}
                  </Badge>
                </div>
              </div>

              {/* Uppercase */}
              <div className="p-3 rounded-lg bg-[#080B14] border border-white/[0.06] text-center">
                <div className="text-[10px] font-mono text-slate-400">UPPERCASE (A-Z)</div>
                <div className="text-xl font-bold font-heading text-slate-200 mt-1">
                  {analysis.characterStats.uppercase}
                </div>
                <div className="mt-1">
                  <Badge variant={analysis.characterStats.uppercase > 0 ? 'green' : 'outline'} size="sm">
                    {analysis.characterStats.uppercase > 0 ? 'Present' : 'Missing'}
                  </Badge>
                </div>
              </div>

              {/* Numbers */}
              <div className="p-3 rounded-lg bg-[#080B14] border border-white/[0.06] text-center">
                <div className="text-[10px] font-mono text-slate-400">NUMBERS (0-9)</div>
                <div className="text-xl font-bold font-heading text-slate-200 mt-1">
                  {analysis.characterStats.numbers}
                </div>
                <div className="mt-1">
                  <Badge variant={analysis.characterStats.numbers > 0 ? 'green' : 'outline'} size="sm">
                    {analysis.characterStats.numbers > 0 ? 'Present' : 'Missing'}
                  </Badge>
                </div>
              </div>

              {/* Symbols */}
              <div className="p-3 rounded-lg bg-[#080B14] border border-white/[0.06] text-center">
                <div className="text-[10px] font-mono text-slate-400">SYMBOLS (!@#$)</div>
                <div className="text-xl font-bold font-heading text-slate-200 mt-1">
                  {analysis.characterStats.symbols}
                </div>
                <div className="mt-1">
                  <Badge variant={analysis.characterStats.symbols > 0 ? 'green' : 'outline'} size="sm">
                    {analysis.characterStats.symbols > 0 ? 'Present' : 'Missing'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* NIST SP 800-63B Compliance Checklist */}
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-slate-300">
                  NIST SP 800-63B GUIDELINE STATUS
                </span>
                <Badge variant={analysis.nistCompliant ? 'green' : 'amber'} size="sm">
                  {analysis.nistCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </Badge>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400 font-sans">
                {analysis.nistFeedback.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#638BFF] mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Threat Model Crack Time Table */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Attack Vector Resilience</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Estimated duration required to compromise under standardized attacker profiles
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Online Throttled */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080B14] border border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-slate-200 font-mono">Online Throttled Attack</div>
                <div className="text-[11px] text-slate-400 font-sans">100 attempts / hr (CAPTCHA &amp; lockout)</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#43D6A0]">
                  {analysis.crackTimes.onlineThrottled}
                </span>
              </div>
            </div>

            {/* Online Unthrottled */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080B14] border border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-slate-200 font-mono">Online Unthrottled API</div>
                <div className="text-[11px] text-slate-400 font-sans">100 attempts / sec (unprotected service)</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#638BFF]">
                  {analysis.crackTimes.onlineUnthrottled}
                </span>
              </div>
            </div>

            {/* Offline Fast Hash */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080B14] border border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-slate-200 font-mono">Offline Fast Hash (MD5 / NTLM)</div>
                <div className="text-[11px] text-slate-400 font-sans">10 billion guesses/sec (consumer GPU)</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#F5B942]">
                  {analysis.crackTimes.offlineFastHash}
                </span>
              </div>
            </div>

            {/* Offline GPU Rig */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#080B14] border border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-slate-200 font-mono">Offline GPU Cluster (SHA-256)</div>
                <div className="text-[11px] text-slate-400 font-sans">100 billion guesses/sec (8x RTX 4090 rig)</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#936BFF]">
                  {analysis.crackTimes.offlineGpuRig}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identified Patterns & Hardening Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identified Patterns */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Identified Weak Patterns &amp; Sequences</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Heuristic patterns that decrease real-world entropy
            </p>
          </CardHeader>
          <CardContent>
            {analysis.patterns.length > 0 ? (
              <div className="space-y-2.5">
                {analysis.patterns.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg bg-[#080B14] border border-white/[0.06] flex items-start gap-3"
                  >
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        p.severity === 'critical'
                          ? 'text-[#F06475]'
                          : p.severity === 'high'
                          ? 'text-[#F5B942]'
                          : 'text-[#638BFF]'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 font-mono">{p.label}</span>
                        <Badge
                          variant={
                            p.severity === 'critical'
                              ? 'red'
                              : p.severity === 'high'
                              ? 'amber'
                              : 'blue'
                          }
                          size="sm"
                        >
                          {p.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-[#43D6A0]/10 border border-[#43D6A0]/20 text-center">
                <CheckCircle className="w-8 h-8 text-[#43D6A0] mx-auto mb-2" />
                <div className="text-sm font-semibold text-[#43D6A0] font-heading">Clean Pattern Scan</div>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  No sequential keyboard walks, repeated characters, common dictionary words, or leetspeak substitutions detected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Recommendations & Action Bar */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Hardening Recommendations</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeted improvements to maximize credential resilience
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#080B14] border border-white/[0.06]">
                  <span className="text-[#638BFF] font-bold font-mono">→</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={onCheckBreach}
                isLoading={analysis.breachStatus.loading}
                className="font-mono text-xs"
              >
                <Database className="w-3.5 h-3.5" />
                Query Breach Database (k-Anonymity)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onExportPdf}
                className="font-mono text-xs text-slate-300"
              >
                <FileDown className="w-3.5 h-3.5" />
                Export Audit Report (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
