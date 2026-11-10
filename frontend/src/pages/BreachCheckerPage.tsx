import React, { useState } from 'react';
import {
  Database,
  Search,
  Laptop,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Tooltip } from '../components/ui/Tooltip';
import { PageHeader } from '../components/ui/PageHeader';
import { BreachResult } from '../lib/types';
import { calculateSha1 } from '../lib/crypto/sha1';

interface BreachCheckerPageProps {
  password: string;
  onPasswordChange: (val: string) => void;
  breachStatus: BreachResult;
  onExecuteCheck: (customPassword?: string) => Promise<void>;
  useBackendProxy: boolean;
}

export const BreachCheckerPage: React.FC<BreachCheckerPageProps> = ({
  password,
  onPasswordChange,
  breachStatus,
  onExecuteCheck,
  useBackendProxy,
}) => {
  const [localInput, setLocalInput] = useState(password);
  const [sha1Preview, setSha1Preview] = useState<{ fullHash: string; prefix: string; suffix: string } | null>(null);

  const handleInputChange = async (val: string) => {
    setLocalInput(val);
    onPasswordChange(val);
    if (val) {
      const res = await calculateSha1(val);
      setSha1Preview(res);
    } else {
      setSha1Preview(null);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput) return;
    await onExecuteCheck(localInput);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        moduleCode="// MODULE: 02_BREACH_INTELLIGENCE"
        title="Zero-Knowledge Breach Range Checker"
        description="Verify credentials against Have I Been Pwned's 1B+ breach corpus using k-anonymity mathematical privacy guarantees."
        badgeText={useBackendProxy ? 'PROXY ROUTING ACTIVE' : 'DIRECT HIBP RANGE'}
        badgeVariant="purple"
      />
      {/* Educational Header Banner */}
      <Alert
        variant="purple"
        title="Zero-Knowledge K-Anonymity Breach Intelligence"
        icon={<Database className="w-4 h-4 text-[#936BFF]" />}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>
            DarkVault queries the Have I Been Pwned repository (&gt;1 billion compromised credentials) without EVER exposing your plaintext password or full hash across the network.
          </span>
          <Badge variant={useBackendProxy ? 'blue' : 'neutral'} size="sm" className="shrink-0">
            {useBackendProxy ? 'Proxy Routing' : 'Direct API'}
          </Badge>
        </div>
      </Alert>

      {/* Input Card */}
      <Card variant="glass" glow="blue" hoverEffect>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider block">
              Enter Credential to Scan Against Global Breach Dumps
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={localInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onClear={() => handleInputChange('')}
                  isPassword={true}
                  placeholder="Enter password to query breach exposure..."
                  className="py-3 bg-[#080B14]"
                />
              </div>
              <Button
                type="submit"
                variant="danger"
                isLoading={breachStatus.loading}
                disabled={!localInput}
                className="font-mono text-xs px-6 py-3 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                Query Breach Database
              </Button>
            </div>

            {/* Quick Test Samples */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
              <span className="text-slate-500 text-[11px]">Test Sample Leaks:</span>
              <button
                type="button"
                onClick={() => handleInputChange('123456')}
                className="px-2 py-0.5 rounded bg-[#F06475]/10 border border-[#F06475]/25 text-[#F06475] text-[11px] cursor-pointer hover:bg-[#F06475]/20 transition-colors"
              >
                123456 (Frequent leak)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('password123')}
                className="px-2 py-0.5 rounded bg-[#F06475]/10 border border-[#F06475]/25 text-[#F06475] text-[11px] cursor-pointer hover:bg-[#F06475]/20 transition-colors"
              >
                password123 (Frequent leak)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('DarkVault#Crypto99*Omega')}
                className="px-2 py-0.5 rounded bg-[#43D6A0]/10 border border-[#43D6A0]/25 text-[#43D6A0] text-[11px] cursor-pointer hover:bg-[#43D6A0]/20 transition-colors"
              >
                DarkVault#Crypto99*Omega (Clean sample)
              </button>
            </div>
          </form>

          {/* Local Hash Preview (Shows K-Anonymity breakdown in real-time) */}
          {sha1Preview && sha1Preview.fullHash && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#080B14] border border-white/[0.08] text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>LOCAL BROWSER SHA-1 DIGEST</span>
                <span className="text-[#43D6A0] font-semibold">Calculated locally in volatile memory</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 font-mono text-xs break-all">
                <Tooltip content="First 5 characters (prefix) sent to HIBP k-anonymity API">
                  <span className="px-2 py-0.5 rounded bg-[#638BFF]/20 text-[#638BFF] border border-[#638BFF]/40 font-bold cursor-help">
                    {sha1Preview.prefix}
                  </span>
                </Tooltip>
                <span className="text-slate-500 px-1">|</span>
                <Tooltip content="Remaining 35 characters (suffix) evaluated strictly in local browser memory">
                  <span className="text-slate-400 cursor-help underline decoration-dotted decoration-slate-600">
                    {sha1Preview.suffix}
                  </span>
                </Tooltip>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono">
                <span>
                  Prefix <strong className="text-[#638BFF]">{sha1Preview.prefix}</strong> queries ~1,000 candidate hashes.
                </span>
                <span>
                  Suffix <strong className="text-slate-300">35 chars</strong> never leaves your device.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Breach Result Display */}
      {breachStatus.checked && (
        <Card
          variant="glass"
          glow={breachStatus.breached ? 'danger' : 'green'}
          hoverEffect
          className={breachStatus.breached ? 'border-[#F06475]/40' : 'border-[#43D6A0]/40'}
        >
          <CardContent className="p-6">
            {breachStatus.breached ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#F06475]/20 text-[#F06475] border border-[#F06475]/35">
                    <AlertOctagon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[#F06475] font-heading">
                        COMPROMISED CREDENTIAL DETECTED
                      </h3>
                      <Badge variant="red">CRITICAL RISK</Badge>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 font-sans">
                      This exact password was found{' '}
                      <strong className="text-[#F06475] font-mono text-base font-bold">
                        {breachStatus.count.toLocaleString()}
                      </strong>{' '}
                      times across public data dumps, breach combo lists, and credential pastes.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F06475]/10 border border-[#F06475]/25 space-y-2 text-xs">
                  <div className="font-semibold text-[#F06475] uppercase tracking-wider font-mono">
                    Urgent Incident Response Recommendations:
                  </div>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside font-sans">
                    <li>
                      <strong>Immediate Revocation:</strong> Cease using this password across all accounts immediately.
                    </li>
                    <li>
                      <strong>Credential Stuffing Threat:</strong> Attackers use automated bots to test this password against major portals.
                    </li>
                    <li>
                      <strong>Enable Multi-Factor Authentication:</strong> Activate FIDO2/WebAuthn or TOTP hardware codes.
                    </li>
                    <li>
                      <strong>Generate High-Entropy Replacement:</strong> Use the DarkVault Key Generator to produce a unique secret.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#43D6A0]/20 text-[#43D6A0] border border-[#43D6A0]/35">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-[#43D6A0] font-heading">
                      NO KNOWN BREACHES DETECTED
                    </h3>
                    <Badge variant="green">CLEAN</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mt-1 font-sans leading-relaxed">
                    Zero occurrences found in the Have I Been Pwned repository among over 1 billion breached records.
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    Note: A clean breach result indicates this password has not surfaced in known public leaks; however, adequate length (&gt;16 characters) and complexity remain vital against targeted offline attacks.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Visual K-Anonymity Architecture Diagram */}
      <Card variant="glass" hoverEffect>
        <CardHeader>
          <CardTitle>How K-Anonymity Mathematical Privacy Works</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step cryptographic sequence preventing any server from discovering your password
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[#638BFF]">
                <span className="font-bold">STEP 1: LOCAL HASHING</span>
                <Laptop className="w-4 h-4" />
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                Your browser hashes your password into a 40-character SHA-1 hex digest using the standard Web Crypto API.
              </p>
              <div className="p-2 rounded-lg bg-[#0D1320] text-[10px] text-slate-400 break-all border border-white/[0.06]">
                Example: <span className="text-[#638BFF] font-bold">21BD1</span>046654BFDB6A9048...
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[#936BFF]">
                <span className="font-bold">STEP 2: 5-CHAR PREFIX</span>
                <Server className="w-4 h-4" />
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                Only the first 5 characters (<code className="text-[#936BFF]">21BD1</code>) are sent over HTTPS. This prefix is shared by hundreds of unrelated passwords.
              </p>
              <div className="p-2 rounded-lg bg-[#0D1320] text-[10px] text-slate-400 break-all border border-white/[0.06]">
                API returns: 500+ suffix matches. The server never knows which one is yours!
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[#43D6A0]">
                <span className="font-bold">STEP 3: LOCAL MATCHING</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                Your browser receives the candidate list and compares the remaining 35 characters locally in memory in constant time.
              </p>
              <div className="p-2 rounded-lg bg-[#0D1320] text-[10px] text-slate-400 break-all border border-white/[0.06]">
                Match found: Count returned.
                <br />
                No match: 100% clean.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
