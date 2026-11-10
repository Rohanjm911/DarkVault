import { DashboardMetrics, StrengthDistributionItem, ActivityTimelineItem, AlertItem } from '../types';

interface SessionEvent {
  id: string;
  timestamp: string;
  action: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SECURE' | 'MODERATE';
  details: string;
  score: number;
  breached: boolean;
}

const sessionEvents: SessionEvent[] = [];

export function recordSessionAudit(event: {
  action: string;
  score: number;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SECURE' | 'MODERATE';
  details: string;
  breached?: boolean;
}): void {
  const newEvent: SessionEvent = {
    id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: 'Just now',
    action: event.action,
    risk: event.risk,
    details: event.details,
    score: event.score,
    breached: Boolean(event.breached),
  };
  sessionEvents.unshift(newEvent);
  if (sessionEvents.length > 50) {
    sessionEvents.pop();
  }
}

export function clearSessionTelemetry(): void {
  sessionEvents.length = 0;
}

export function getSessionMetrics(): DashboardMetrics {
  const total = sessionEvents.length;
  if (total === 0) {
    return {
      isDemoData: false,
      overallSecurityScore: 0,
      totalAnalyses: 0,
      strongPasswords: 0,
      weakPasswords: 0,
      breachesDetected: 0,
      strengthDistribution: [
        { category: 'Very Weak (0-20)', count: 0, percentage: 0 },
        { category: 'Weak (21-40)', count: 0, percentage: 0 },
        { category: 'Moderate (41-60)', count: 0, percentage: 0 },
        { category: 'Strong (61-80)', count: 0, percentage: 0 },
        { category: 'Hardened (81-100)', count: 0, percentage: 0 },
      ],
      activityTimeline: [],
      recentAlerts: [],
    };
  }

  const strong = sessionEvents.filter((e) => e.score >= 60).length;
  const weak = sessionEvents.filter((e) => e.score < 40).length;
  const breaches = sessionEvents.filter((e) => e.breached).length;
  const avgScore = Math.round(sessionEvents.reduce((acc, curr) => acc + curr.score, 0) / total);

  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;

  for (const ev of sessionEvents) {
    if (ev.score <= 20) b1++;
    else if (ev.score <= 40) b2++;
    else if (ev.score <= 60) b3++;
    else if (ev.score <= 80) b4++;
    else b5++;
  }

  const strengthDistribution: StrengthDistributionItem[] = [
    { category: 'Very Weak (0-20)', count: b1, percentage: Number(((b1 / total) * 100).toFixed(1)) },
    { category: 'Weak (21-40)', count: b2, percentage: Number(((b2 / total) * 100).toFixed(1)) },
    { category: 'Moderate (41-60)', count: b3, percentage: Number(((b3 / total) * 100).toFixed(1)) },
    { category: 'Strong (61-80)', count: b4, percentage: Number(((b4 / total) * 100).toFixed(1)) },
    { category: 'Hardened (81-100)', count: b5, percentage: Number(((b5 / total) * 100).toFixed(1)) },
  ];

  const activityTimeline: ActivityTimelineItem[] = sessionEvents.slice(0, 5).map((e) => ({
    id: e.id,
    timestamp: e.timestamp,
    action: e.action,
    risk: e.risk,
    details: e.details,
  }));

  const recentAlerts: AlertItem[] = sessionEvents
    .filter((e) => e.breached || e.risk === 'CRITICAL' || e.risk === 'HIGH')
    .slice(0, 3)
    .map((e, idx) => ({
      id: `alert-${e.id}-${idx}`,
      severity: e.breached || e.risk === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      title: e.breached ? 'Compromised Secret Detected' : 'Vulnerable Credential Pattern',
      description: e.details,
      time: e.timestamp,
    }));

  return {
    isDemoData: false,
    overallSecurityScore: avgScore,
    totalAnalyses: total,
    strongPasswords: strong,
    weakPasswords: weak,
    breachesDetected: breaches,
    strengthDistribution,
    activityTimeline,
    recentAlerts,
  };
}
