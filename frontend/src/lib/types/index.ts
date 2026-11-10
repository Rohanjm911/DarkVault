export interface CharacterStats {
  uppercase: number;
  lowercase: number;
  numbers: number;
  symbols: number;
  spaces: number;
  unique: number;
}

export interface DetectedPattern {
  id: string;
  type: 'sequence' | 'repeated' | 'keyboard' | 'dictionary' | 'date' | 'leetspeak';
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matchedSubstring?: string;
}

export interface CrackTimeEstimates {
  onlineThrottled: string;
  onlineUnthrottled: string;
  offlineFastHash: string;
  offlineGpuRig: string;
}

export interface BreachResult {
  checked: boolean;
  breached: boolean;
  count: number;
  prefix: string;
  suffix: string;
  loading: boolean;
  error?: string;
}

export interface PasswordAnalysis {
  passwordLength: number;
  entropyBits: number;
  poolSize: number;
  score: number; // 0 to 100
  grade: 'Critical' | 'Weak' | 'Moderate' | 'Strong' | 'Hardened';
  characterStats: CharacterStats;
  patterns: DetectedPattern[];
  crackTimes: CrackTimeEstimates;
  nistCompliant: boolean;
  nistFeedback: string[];
  recommendations: string[];
  breachStatus: BreachResult;
}

export interface GeneratorConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  customSymbols?: string;
  mode: 'password' | 'passphrase' | 'pin';
  wordCount: number;
  wordSeparator: string;
  capitalizeWords: boolean;
  includeNumberInPassphrase: boolean;
}

export interface AuditItem {
  id: string;
  label: string;
  length: number;
  score: number;
  entropyBits: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SECURE';
  isBreached: boolean;
  breachCount: number;
  nistCompliant: boolean;
  patternsCount: number;
  timestamp: string;
}

export interface DashboardMetrics {
  isDemoData: boolean;
  overallSecurityScore: number;
  totalAnalyses: number;
  strongPasswords: number;
  weakPasswords: number;
  breachesDetected: number;
  strengthDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  activityTimeline: Array<{
    id: string;
    timestamp: string;
    action: string;
    risk: string;
    details: string;
  }>;
  recentAlerts: Array<{
    id: string;
    severity: string;
    title: string;
    description: string;
    time: string;
  }>;
}

export interface AppSettings {
  useBackendProxy: boolean;
  anonymousTelemetry: boolean;
  clearMemoryOnClose: boolean;
  nistStrictRules: boolean;
  accentColor: 'blue' | 'green' | 'purple';
  soundEffects: boolean;
}

