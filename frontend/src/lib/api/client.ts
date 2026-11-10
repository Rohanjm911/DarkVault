import { DashboardMetrics } from '../types';
import { getSessionMetrics } from '../store/sessionTelemetryStore';

export async function getDashboardStats(demo: boolean = false): Promise<DashboardMetrics> {
  try {
    const res = await fetch(`/api/stats/dashboard?demo=${demo}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    const data = await res.json();
    return {
      isDemoData: data.is_demo_data,
      overallSecurityScore: data.overall_security_score,
      totalAnalyses: data.total_analyses,
      strongPasswords: data.strong_passwords,
      weakPasswords: data.weak_passwords,
      breachesDetected: data.breaches_detected,
      strengthDistribution: data.strength_distribution,
      activityTimeline: data.activity_timeline,
      recentAlerts: data.recent_alerts,
    };
  } catch {
    // If user requested live data, return dynamic in-memory session metrics
    if (!demo) {
      return getSessionMetrics();
    }

    // Default demonstration dataset
    return {
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
      activityTimeline: [
        {
          id: 'demo-1',
          timestamp: 'Just now',
          action: 'Zero-Knowledge Breach Scan',
          risk: 'CRITICAL',
          details: 'Matched k-anonymity SHA-1 hash suffix in public dump',
        },
        {
          id: 'demo-2',
          timestamp: '12m ago',
          action: 'Cryptographic Generator',
          risk: 'SECURE',
          details: 'Generated 24-character high-entropy secret',
        },
        {
          id: 'demo-3',
          timestamp: '1h ago',
          action: 'NIST Compliance Audit',
          risk: 'MEDIUM',
          details: 'Audited credential against SP 800-63B standards',
        },
      ],
      recentAlerts: [
        {
          id: 'alert-1',
          severity: 'CRITICAL',
          title: 'Compromised Password Detected',
          description: 'Tested credential appears in 1,482 public database breach lists.',
          time: '5m ago',
        },
        {
          id: 'alert-2',
          severity: 'HIGH',
          title: 'Low Entropy Alert',
          description: 'Effective entropy below 35 bits. Sub-second brute-force risk.',
          time: '28m ago',
        },
      ],
    };
  }
}

export async function sendTelemetry(telemetry: {
  audit_type: string;
  entropy_bits: number;
  strength_score: number;
  risk_level: string;
  length: number;
  breached: boolean;
  breach_count: number;
  has_uppercase: boolean;
  has_lowercase: boolean;
  has_numbers: boolean;
  has_symbols: boolean;
  nist_compliant: boolean;
}): Promise<void> {
  try {
    await fetch('/api/stats/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetry),
    });
  } catch {
    // Gracefully ignore network errors for telemetry
  }
}

