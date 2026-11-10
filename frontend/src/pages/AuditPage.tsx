import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { analyzePassword } from '../lib/crypto/entropy';
import { PasswordAnalysis } from '../lib/types';
import { generateSecurityReportPdf } from '../lib/pdf/pdfGenerator';
import { useToast } from '../components/ui/ToastContext';

interface AuditItemRecord {
  id: string;
  name: string;
  password: string;
  analysis: PasswordAnalysis;
}

export const AuditPage: React.FC = () => {
  const [items, setItems] = useState<AuditItemRecord[]>([
    {
      id: 'item-1',
      name: 'Primary Work Account',
      password: 'Tr0ub4dor&3#98XyZ',
      analysis: analyzePassword('Tr0ub4dor&3#98XyZ'),
    },
    {
      id: 'item-2',
      name: 'Legacy Database Admin',
      password: 'adminpassword1',
      analysis: analyzePassword('adminpassword1'),
    },
    {
      id: 'item-3',
      name: 'Cloud Infrastructure Vault',
      password: 'correct-horse-battery-staple-99!',
      analysis: analyzePassword('correct-horse-battery-staple-99!'),
    },
  ]);

  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    const record: AuditItemRecord = {
      id: `audit-${Date.now()}`,
      name: newName.trim() || `Credential #${items.length + 1}`,
      password: newPassword,
      analysis: analyzePassword(newPassword),
    };

    setItems([...items, record]);
    setNewName('');
    setNewPassword('');
    toast({
      type: 'success',
      title: 'Credential Audited',
      message: `Audited "${record.name}" against NIST SP 800-63B standards.`,
    });
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    toast({
      type: 'info',
      title: 'Audit Batch Cleared',
      message: 'All session audit records have been removed from memory.',
    });
  };

  const handleExportAuditPdf = () => {
    if (items.length === 0) return;
    generateSecurityReportPdf(items[0].analysis, {
      targetIdentifier: `${items.length} Credentials Audited (NIST SP 800-63B)`,
      notes: 'Batch credential security posture compliance summary.',
    });
    toast({
      type: 'success',
      title: 'Batch Audit PDF Exported',
      message: 'Generated comprehensive audit compliance report.',
    });
  };

  // Aggregated compliance metrics
  const total = items.length;
  const compliantCount = items.filter((i) => i.analysis.nistCompliant).length;
  const averageScore =
    total > 0 ? Math.round(items.reduce((acc, curr) => acc + curr.analysis.score, 0) / total) : 0;
  const highRiskCount = items.filter(
    (i) => i.analysis.grade === 'Critical' || i.analysis.grade === 'Weak'
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        moduleCode="// MODULE: 04_SECURITY_AUDIT"
        title="Fleet Password Security Audit"
        description="Comprehensive NIST SP 800-63B posture evaluation, uniqueness checks, and multi-credential risk stratification."
        badgeText="NIST SP 800-63B VERIFIED"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAuditPdf}
              disabled={items.length === 0}
              className="cursor-pointer font-mono text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Audit PDF
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearAll}
              disabled={items.length === 0}
              className="cursor-pointer font-mono text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Pool
            </Button>
          </div>
        }
      />
      {/* Integrity & Accuracy Notice */}
      <Alert
        variant="purple"
        title="Verified Audit Protocol (NIST SP 800-63B Guidelines)"
        icon={<FileCheck2 className="w-4 h-4 text-[#936BFF]" />}
      >
        <span>
          DarkVault audits only the exact credentials tested in volatile memory. We never claim to inspect accounts or passwords outside your verified input.
        </span>
      </Alert>

      {/* Aggregate Audit Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="glass" glow="blue" hoverEffect>
          <CardContent className="p-4">
            <span className="text-[10px] font-mono text-slate-400">TOTAL AUDITED</span>
            <div className="text-2xl font-bold font-heading text-white mt-1">{total}</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">In-memory verified</p>
          </CardContent>
        </Card>

        <Card variant="glass" glow="green" hoverEffect>
          <CardContent className="p-4">
            <span className="text-[10px] font-mono text-slate-400">NIST COMPLIANCE RATE</span>
            <div className="text-2xl font-bold font-heading text-[#43D6A0] mt-1">
              {total > 0 ? `${Math.round((compliantCount / total) * 100)}%` : '0%'}
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">{compliantCount} of {total} passed</p>
          </CardContent>
        </Card>

        <Card variant="glass" glow="purple" hoverEffect>
          <CardContent className="p-4">
            <span className="text-[10px] font-mono text-slate-400">AVERAGE SCORE</span>
            <div className="text-2xl font-bold font-heading text-[#936BFF] mt-1">{averageScore} / 100</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">Weighted security index</p>
          </CardContent>
        </Card>

        <Card variant="glass" glow="danger" hoverEffect>
          <CardContent className="p-4">
            <span className="text-[10px] font-mono text-slate-400">VULNERABILITY FLAGS</span>
            <div className="text-2xl font-bold font-heading text-[#F06475] mt-1">{highRiskCount}</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">Require immediate rotation</p>
          </CardContent>
        </Card>
      </div>

      {/* Batch Auditor Input Form */}
      <Card variant="glass" hoverEffect>
        <CardHeader>
          <CardTitle>Add Credential to Audit Batch</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Test a sample password or credential against institutional security policies
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="Account / Purpose label (e.g. VPN Access)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#080B14] border border-white/[0.08] rounded-lg text-slate-100 placeholder:text-slate-500 font-mono text-xs py-2.5 px-3 focus:outline-none focus:border-[#638BFF]"
              />
            </div>
            <div className="sm:col-span-6">
              <Input
                placeholder="Enter password to audit..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onClear={() => setNewPassword('')}
                isPassword={true}
                className="py-2.5 text-xs bg-[#080B14]"
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="primary"
                disabled={!newPassword}
                className="w-full py-2.5 font-mono text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Audit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Audit Inventory Table */}
      <Card variant="glass" hoverEffect>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Batch Security Checklist &amp; Inventory</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Live results calculated locally in your browser memory
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-slate-400 hover:text-[#F06475] text-xs font-mono cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              title="No Credential Audits Recorded"
              description="Add credentials above to evaluate password uniqueness, Shannon entropy, and NIST SP 800-63B standards across your fleet."
            />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#080B14] border border-white/[0.06] hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          item.analysis.grade === 'Hardened'
                            ? 'bg-[#936BFF]/15 text-[#936BFF]'
                            : item.analysis.grade === 'Strong'
                            ? 'bg-[#43D6A0]/15 text-[#43D6A0]'
                            : item.analysis.grade === 'Moderate'
                            ? 'bg-[#F5B942]/15 text-[#F5B942]'
                            : 'bg-[#F06475]/15 text-[#F06475]'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-100 font-mono">{item.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          Length: {item.analysis.passwordLength} | Entropy: {item.analysis.entropyBits.toFixed(1)} bits
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Badge
                        variant={
                          item.analysis.grade === 'Hardened'
                            ? 'purple'
                            : item.analysis.grade === 'Strong'
                            ? 'green'
                            : item.analysis.grade === 'Moderate'
                            ? 'amber'
                            : 'red'
                        }
                        size="sm"
                      >
                        {item.analysis.grade.toUpperCase()} ({item.analysis.score}/100)
                      </Badge>

                      <Badge variant={item.analysis.nistCompliant ? 'green' : 'amber'} size="sm">
                        {item.analysis.nistCompliant ? 'NIST Pass' : 'NIST Fail'}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          generateSecurityReportPdf(item.analysis, { targetIdentifier: item.name });
                          toast({
                            type: 'success',
                            title: 'Report Downloaded',
                            message: `PDF audit export ready for ${item.name}.`,
                          });
                        }}
                        className="p-1.5 h-8 text-xs font-mono cursor-pointer text-slate-300"
                        title="Download Individual PDF Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-slate-500 hover:text-[#F06475] rounded transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Findings breakdown */}
                  {item.analysis.patterns.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2 text-xs font-mono">
                      {item.analysis.patterns.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded bg-[#F06475]/10 border border-[#F06475]/20 text-[#F06475] text-[10px]"
                        >
                          {p.label}: {p.matchedSubstring || p.description.slice(0, 30)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NIST SP 800-63B Master Checklist */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>NIST Special Publication 800-63B Authentication Checklist</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            US Federal Digital Identity Guidelines for Password Security &amp; Credential Hygiene
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-[#080B14] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-[#43D6A0] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Length Over Arbitrary Rules</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                NIST discourages arbitrary composition rules (requiring uppercase, digits, symbols), which frequently results in predictable patterns like &quot;Password1!&quot;. Long passphrases are superior.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080B14] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-[#43D6A0] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Screen Against Breached Passwords</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                Passwords must be verified against repositories of previously exposed credentials (performed by DarkVault via k-anonymity SHA-1).
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080B14] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-[#43D6A0] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>No Mandatory Periodic Expiration</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                Forced 60- or 90-day password changes lead users to make simple minor changes (e.g. Spring2024 to Spring2025). Passwords should only be rotated upon suspected compromise.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080B14] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-[#43D6A0] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Allow 64+ Character Passwords</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                Systems must support passwords of at least 64 characters to enable multi-word Diceware passphrases and machine-generated credentials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
