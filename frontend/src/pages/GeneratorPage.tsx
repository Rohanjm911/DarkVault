import React, { useState, useMemo, useCallback } from 'react';
import {
  RefreshCw,
  Copy,
  Check,
  Zap,
  Send,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Alert } from '../components/ui/Alert';
import { GeneratorConfig, PasswordAnalysis } from '../lib/types';
import { generatePassword, generateBulkPasswords } from '../lib/crypto/generator';
import { analyzePassword } from '../lib/crypto/entropy';
import { useToast } from '../components/ui/ToastContext';
import confetti from 'canvas-confetti';

interface GeneratorPageProps {
  onSendToAnalyzer: (pwd: string) => void;
}

const DEFAULT_CONFIG: GeneratorConfig = {
  length: 20,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
  mode: 'password',
  wordCount: 4,
  wordSeparator: '-',
  capitalizeWords: true,
  includeNumberInPassphrase: true,
};

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ onSendToAnalyzer }) => {
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [bulkList, setBulkList] = useState<Array<{ password: string; analysis: PasswordAnalysis }>>([]);

  const { toast } = useToast();

  const generatedPassword = useMemo(() => {
    void seed;
    return generatePassword(config);
  }, [config, seed]);
  const analysis = useMemo(() => analyzePassword(generatedPassword), [generatedPassword]);

  const handleGenerate = useCallback(() => {
    setSeed((s) => s + 1);
    setCopied(false);
  }, []);

  const handleBulkGenerate = () => {
    const list = generateBulkPasswords(config, bulkCount);
    setBulkList(list);
    toast({
      type: 'info',
      title: 'Batch Generated',
      message: `Generated ${bulkCount} cryptographically secure credentials.`,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Secure secret ready for deployment.',
    });
    try {
      confetti({
        particleCount: 20,
        spread: 35,
        origin: { y: 0.8 },
        colors: ['#638BFF', '#936BFF', '#43D6A0'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        moduleCode="// MODULE: 03_KEY_GENERATOR"
        title="CSPRNG Cryptographic Secret Generator"
        description="Generate mathematically unbiased credentials using Web Crypto API entropy with modulo rejection sampling."
        badgeText="CSPRNG ACTIVE"
        badgeVariant="green"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="cyber"
              size="sm"
              onClick={handleGenerate}
              className="cursor-pointer font-mono text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </div>
        }
      />
      {/* Educational Banner */}
      <Alert
        variant="success"
        title="Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)"
        icon={<Zap className="w-4 h-4 text-[#43D6A0]" />}
      >
        <span>
          Entropy powered directly by the Web Crypto API (<code className="text-[#638BFF]">crypto.getRandomValues</code>) with modulo rejection sampling to eliminate statistical bias.
        </span>
      </Alert>

      {/* Main Generator Display Card */}
      <Card variant="glass" glow="green">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#080B14] border border-white/[0.08]">
            <div className="w-full overflow-hidden text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-1">
                Generated Cryptographic Secret
              </span>
              <div className="font-mono text-lg sm:text-xl font-bold text-white tracking-wide break-all select-all">
                {generatedPassword || 'Generating...'}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                className="font-mono text-xs cursor-pointer"
                title="Generate New Secret"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>

              <Button
                variant="cyber"
                size="md"
                onClick={() => handleCopy(generatedPassword)}
                className="font-mono text-xs cursor-pointer"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-[#43D6A0]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => onSendToAnalyzer(generatedPassword)}
                className="font-mono text-xs cursor-pointer hidden md:inline-flex text-slate-300"
                title="Send to Password Analyzer"
              >
                <Send className="w-3.5 h-3.5" />
                Analyze
              </Button>
            </div>
          </div>

          {/* Quick Real-Time Metrics Strip */}
          {analysis && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06] text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                <span className="text-slate-400 text-[10px]">SCORE</span>
                <div className="text-sm font-bold text-white mt-0.5">{analysis.score} / 100</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                <span className="text-slate-400 text-[10px]">ENTROPY</span>
                <div className="text-sm font-bold text-[#936BFF] mt-0.5">{analysis.entropyBits.toFixed(1)} bits</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                <span className="text-slate-400 text-[10px]">CRACK TIME (GPU)</span>
                <div className="text-sm font-bold text-[#43D6A0] mt-0.5 truncate">{analysis.crackTimes.offlineGpuRig}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1320] border border-white/[0.06]">
                <span className="text-slate-400 text-[10px]">NIST GUIDELINE</span>
                <div className="text-sm font-bold text-[#638BFF] mt-0.5">
                  {analysis.nistCompliant ? 'Verified' : 'Fails Length'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generator Configuration Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode & Length Controls */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Generation Engine Mode</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Select between high-entropy alphanumeric, memorable passphrase, or PIN
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#080B14] border border-white/[0.08] text-xs font-mono">
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'password' })}
                className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  config.mode === 'password'
                    ? 'bg-[#638BFF]/20 text-[#638BFF] border border-[#638BFF]/40 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'passphrase' })}
                className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  config.mode === 'passphrase'
                    ? 'bg-[#936BFF]/20 text-[#936BFF] border border-[#936BFF]/40 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Passphrase
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'pin' })}
                className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  config.mode === 'pin'
                    ? 'bg-[#43D6A0]/20 text-[#43D6A0] border border-[#43D6A0]/40 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Secure PIN
              </button>
            </div>

            {/* Password mode controls */}
            {config.mode === 'password' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>PASSWORD LENGTH</span>
                    <span className="font-bold text-[#638BFF] text-sm">{config.length} characters</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={config.length}
                    onChange={(e) => setConfig({ ...config, length: Number(e.target.value) })}
                    className="w-full accent-[#638BFF] cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>8 (Min)</span>
                    <span>16 (Recommended)</span>
                    <span>32</span>
                    <span>64 (Max)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={config.includeUppercase}
                      onChange={(e) => setConfig({ ...config, includeUppercase: e.target.checked })}
                      className="accent-[#638BFF] rounded"
                    />
                    <span className="text-slate-200">Uppercase (A-Z)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={config.includeLowercase}
                      onChange={(e) => setConfig({ ...config, includeLowercase: e.target.checked })}
                      className="accent-[#638BFF] rounded"
                    />
                    <span className="text-slate-200">Lowercase (a-z)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={config.includeNumbers}
                      onChange={(e) => setConfig({ ...config, includeNumbers: e.target.checked })}
                      className="accent-[#638BFF] rounded"
                    />
                    <span className="text-slate-200">Numbers (0-9)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={config.includeSymbols}
                      onChange={(e) => setConfig({ ...config, includeSymbols: e.target.checked })}
                      className="accent-[#638BFF] rounded"
                    />
                    <span className="text-slate-200">Symbols (!@#$)</span>
                  </label>
                </div>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40 text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={config.excludeAmbiguous}
                    onChange={(e) => setConfig({ ...config, excludeAmbiguous: e.target.checked })}
                    className="accent-[#638BFF] rounded"
                  />
                  <span className="text-slate-200">Exclude Ambiguous Characters (0, O, 1, l, I)</span>
                </label>
              </div>
            )}

            {/* Passphrase mode controls */}
            {config.mode === 'passphrase' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>WORD COUNT</span>
                    <span className="font-bold text-[#936BFF] text-sm">{config.wordCount} words</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={config.wordCount}
                    onChange={(e) => setConfig({ ...config, wordCount: Number(e.target.value) })}
                    className="w-full accent-[#936BFF] cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={config.capitalizeWords}
                      onChange={(e) => setConfig({ ...config, capitalizeWords: e.target.checked })}
                      className="accent-[#936BFF] rounded"
                    />
                    <span className="text-slate-200">Capitalize Words</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] cursor-pointer hover:bg-slate-800/40">
                    <input
                      type="checkbox"
                      checked={config.includeNumberInPassphrase}
                      onChange={(e) => setConfig({ ...config, includeNumberInPassphrase: e.target.checked })}
                      className="accent-[#936BFF] rounded"
                    />
                    <span className="text-slate-200">Append Number</span>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Word Separator
                  </label>
                  <div className="flex gap-2">
                    {['-', '_', '.', ' ', '#'].map((sep) => (
                      <button
                        key={sep}
                        type="button"
                        onClick={() => setConfig({ ...config, wordSeparator: sep })}
                        className={`w-10 h-9 rounded-lg font-mono text-sm border flex items-center justify-center cursor-pointer ${
                          config.wordSeparator === sep
                            ? 'bg-[#936BFF]/20 border-[#936BFF] text-[#936BFF]'
                            : 'bg-[#080B14] border-white/[0.06] text-slate-400 hover:text-white'
                        }`}
                      >
                        {sep === ' ' ? '␣' : sep}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PIN mode controls */}
            {config.mode === 'pin' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>PIN DIGITS</span>
                    <span className="font-bold text-[#43D6A0] text-sm">{config.length} digits</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    value={config.length}
                    onChange={(e) => setConfig({ ...config, length: Number(e.target.value) })}
                    className="w-full accent-[#43D6A0] cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Generation Card */}
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Batch Credential Generator</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Generate multiple cryptographic secrets simultaneously
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkGenerate}
              className="font-mono text-xs cursor-pointer text-slate-300"
            >
              <Layers className="w-3.5 h-3.5" />
              Generate Batch
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-slate-400">
              <span>Batch Count:</span>
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setBulkCount(cnt);
                    setBulkList(generateBulkPasswords(config, cnt));
                  }}
                  className={`px-2.5 py-0.5 rounded text-xs border cursor-pointer font-mono ${
                    bulkCount === cnt
                      ? 'bg-[#638BFF]/20 border-[#638BFF] text-[#638BFF]'
                      : 'bg-[#080B14] border-white/[0.06] text-slate-400'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(bulkList.length > 0 ? bulkList : generateBulkPasswords(config, 5)).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#080B14] border border-white/[0.06] text-xs font-mono hover:border-slate-700 transition-colors"
                >
                  <span className="font-bold text-slate-200 truncate max-w-[200px] sm:max-w-[260px]">
                    {item.password}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={item.analysis.score >= 70 ? 'green' : 'amber'} size="sm">
                      {item.analysis.entropyBits.toFixed(0)} bits
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.password)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
