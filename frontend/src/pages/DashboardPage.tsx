import React from 'react';
import {
  ShieldCheck,
  Database,
  KeyRound,
  FileCheck2,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { RadialScoreGauge } from '../components/ui/RadialScoreGauge';
import { DashboardMetrics } from '../lib/types';
import { TabId } from '../components/layout/Sidebar';

interface DashboardPageProps {
  metrics: DashboardMetrics;
  onNavigate: (tab: TabId) => void;
  onToggleDemoData: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  onNavigate,
  onToggleDemoData,
}) => {
  // Color palette for strength distribution: Very Weak (Red), Weak (Amber), Moderate (Yellow), Strong (Green), Hardened (Purple)
  const chartColors = ['#F06475', '#FB923C', '#F5B942', '#43D6A0', '#936BFF'];

  return (
    <div className="space-y-6">
      {/* Unified Command Center Page Header */}
      <PageHeader
        moduleCode="COMMAND CENTER"
        title="Security Command Center"
        description="Real-time cryptographic audit telemetry, fleet credential risk scoring, and NIST SP 800-63B policy posture."
        badgeText={metrics.isDemoData ? 'DEMO DATASET' : 'LIVE AUDIT POOL'}
        badgeVariant={metrics.isDemoData ? 'amber' : 'green'}
      />
      {/* Demo vs Real Data Banner */}
      {metrics.isDemoData && (
        <Alert
          variant="warning"
          title="Demonstration Telemetry Active"
          onDismiss={onToggleDemoData}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span>
              Showing simulated enterprise credential metrics. Run scans in the Analyzer or Generator to populate your own live telemetry.
            </span>
            <button
              type="button"
              onClick={onToggleDemoData}
              className="text-[#F5B942] underline hover:text-amber-200 cursor-pointer font-bold shrink-0 transition-colors"
            >
              Switch to Live Telemetry
            </button>
          </div>
        </Alert>
      )}

      {/* Symmetrical 4-Card Executive Metric Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
        {/* Card 1: Security Posture Gauge */}
        <Card variant="glass" glow="blue" hoverEffect className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider whitespace-nowrap">
              SECURITY POSTURE
            </span>
            <Badge variant="blue" size="sm" dot>
              Optimal
            </Badge>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-2">
            <RadialScoreGauge score={metrics.overallSecurityScore} size={130} strokeWidth={10} />
          </CardContent>
          <div className="p-2.5 px-4 bg-[#080B14]/40 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>NIST SP 800-63B</span>
            <span className="text-[#43D6A0] font-semibold">Verified</span>
          </div>
        </Card>

        {/* Card 2: Total Audited */}
        <Card variant="glass" glow="purple" hoverEffect className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider whitespace-nowrap">
              TOTAL AUDITED
            </span>
            <div className="p-1.5 rounded-lg bg-[#936BFF]/15 text-[#936BFF]">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              <AnimatedCounter value={metrics.totalAnalyses} />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#936BFF]" />
              <span>Zero-Knowledge Session</span>
            </div>
          </CardContent>
          <div className="p-2.5 px-4 bg-[#080B14]/40 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Air-Gapped Sandbox</span>
            <span className="text-slate-300">Local Only</span>
          </div>
        </Card>

        {/* Card 3: Strong Secrets */}
        <Card variant="glass" glow="green" hoverEffect className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider whitespace-nowrap">
              STRONG SECRETS
            </span>
            <div className="p-1.5 rounded-lg bg-[#43D6A0]/15 text-[#43D6A0]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#43D6A0] tracking-tight">
              <AnimatedCounter value={metrics.strongPasswords} />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#43D6A0] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43D6A0]" />
              <span>
                {metrics.totalAnalyses > 0
                  ? `${Math.round((metrics.strongPasswords / metrics.totalAnalyses) * 100)}% of audit pool`
                  : '0% pool'}
              </span>
            </div>
          </CardContent>
          <div className="p-2.5 px-4 bg-[#080B14]/40 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Entropy Target</span>
            <span className="text-[#43D6A0] font-semibold">&gt; 65 bits</span>
          </div>
        </Card>

        {/* Card 4: Breach Hits */}
        <Card variant="glass" glow="danger" hoverEffect className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-semibold text-slate-400 tracking-wider whitespace-nowrap">
              BREACH HITS
            </span>
            <div className="p-1.5 rounded-lg bg-[#F06475]/15 text-[#F06475]">
              <Database className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F06475] tracking-tight">
              <AnimatedCounter value={metrics.breachesDetected} />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#F06475] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F06475] animate-pulse" />
              <span>
                {metrics.breachesDetected > 0 ? 'Critical Exposure' : 'Zero Leaks Detected'}
              </span>
            </div>
          </CardContent>
          <div className="p-2.5 px-4 bg-[#080B14]/40 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>HIBP Repository</span>
            <span className="text-slate-300">1B+ Records</span>
          </div>
        </Card>
      </div>

      {/* Main Charts & Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strength Distribution Chart */}
        <Card variant="glass" hoverEffect className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Password Strength Distribution</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of analyzed passwords by score tier
              </p>
            </div>
            <Badge variant="blue" size="sm">
              Entropy Spectrum
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.strengthDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    fontFamily="'JetBrains Mono', monospace"
                    tickFormatter={(val: string) => val.split(' ')[0]}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    fontFamily="'JetBrains Mono', monospace"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#e2e8f0',
                      boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                    }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {metrics.strengthDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4 pt-3 border-t border-white/[0.06] text-center text-xs">
              {metrics.strengthDistribution.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 truncate">{item.category.split(' ')[0]}</div>
                  <div className="font-bold font-mono text-slate-200">{item.count}</div>
                  <div className="text-[10px] font-mono text-slate-500">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Shortcuts */}
        <Card variant="glass" glow="blue">
          <CardHeader>
            <CardTitle>Command Shortcuts</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapid access to DarkVault security engines
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <button
              onClick={() => onNavigate('analyzer')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080B14]/80 border border-white/[0.08] hover:border-[#638BFF]/50 hover:bg-[#0D1320] transition-all text-left cursor-pointer group glass-card holo-sheen hover:-translate-y-0.5 hover:shadow-lg shadow-black/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#638BFF]/15 text-[#638BFF] group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(99,139,255,0.4)] transition-all">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100 font-heading group-hover:text-[#638BFF] transition-colors">
                    Password Analyzer
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Entropy, patterns &amp; crack times
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#638BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('breach')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080B14]/80 border border-white/[0.08] hover:border-[#F06475]/50 hover:bg-[#0D1320] transition-all text-left cursor-pointer group glass-card holo-sheen hover:-translate-y-0.5 hover:shadow-lg shadow-black/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F06475]/15 text-[#F06475] group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(240,100,117,0.4)] transition-all">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100 font-heading group-hover:text-[#F06475] transition-colors">
                    Breach Range Checker
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    K-Anonymity SHA-1 lookup
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#F06475] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('generator')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080B14]/80 border border-white/[0.08] hover:border-[#43D6A0]/50 hover:bg-[#0D1320] transition-all text-left cursor-pointer group glass-card holo-sheen hover:-translate-y-0.5 hover:shadow-lg shadow-black/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#43D6A0]/15 text-[#43D6A0] group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(67,214,160,0.4)] transition-all">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100 font-heading group-hover:text-[#43D6A0] transition-colors">
                    Key Generator
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Web Crypto secrets &amp; passphrases
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#43D6A0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('audit')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#080B14]/80 border border-white/[0.08] hover:border-[#936BFF]/50 hover:bg-[#0D1320] transition-all text-left cursor-pointer group glass-card holo-sheen hover:-translate-y-0.5 hover:shadow-lg shadow-black/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#936BFF]/15 text-[#936BFF] group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(147,107,255,0.4)] transition-all">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100 font-heading group-hover:text-[#936BFF] transition-colors">
                    NIST Security Audit
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    SP 800-63B policy verification
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#936BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Timeline & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card variant="glass" hoverEffect>
          <CardHeader>
            <CardTitle>Security Activity Timeline</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Recent zero-knowledge operations in session memory
            </p>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {metrics.activityTimeline.length === 0 ? (
              <EmptyState
                title="No Session Activity Yet"
                description="Run analysis, check breach status, or generate a secret to begin recording volatile session operations."
                actionText="Analyze Credential"
                onAction={() => onNavigate('analyzer')}
              />
            ) : (
              metrics.activityTimeline.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-xs font-mono">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.risk === 'CRITICAL'
                        ? 'bg-[#F06475] shadow-[0_0_8px_rgba(240,100,117,0.7)]'
                        : item.risk === 'SECURE'
                        ? 'bg-[#43D6A0] shadow-[0_0_8px_rgba(67,214,160,0.7)]'
                        : item.risk === 'HIGH'
                        ? 'bg-[#F5B942] shadow-[0_0_8px_rgba(245,185,66,0.7)]'
                        : 'bg-[#638BFF]'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{item.action}</span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5 font-sans leading-relaxed">{item.details}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card variant="glass" hoverEffect>
          <CardHeader>
            <CardTitle>Active Security Alerts</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Critical vulnerability indicators flagged during scans
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.recentAlerts.length === 0 ? (
              <EmptyState
                title="All Clear — Zero Active Threat Alerts"
                description="No critical exposure or weak credential hashes have been identified in the current telemetry batch."
              />
            ) : (
              metrics.recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#0D1320] border border-white/[0.06]"
                >
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL'
                        ? 'text-[#F06475]'
                        : alert.severity === 'HIGH'
                        ? 'text-[#F5B942]'
                        : 'text-[#638BFF]'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 font-mono">{alert.title}</span>
                      <Badge
                        variant={
                          alert.severity === 'CRITICAL'
                            ? 'red'
                            : alert.severity === 'HIGH'
                            ? 'amber'
                            : 'blue'
                        }
                        size="sm"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
