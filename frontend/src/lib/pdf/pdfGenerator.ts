/**
 * DarkVault Dual-Engine PDF Report Generator
 * Zero plaintext passwords or sensitive credentials are ever sent or included.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PasswordAnalysis } from '../types';

export interface GenerateReportOptions {
  targetIdentifier?: string;
  notes?: string;
  useBackendIfAvailable?: boolean;
  reportTitle?: string;
  includeCrackTimes?: boolean;
  includeRemediation?: boolean;
}

export async function generateSecurityReportPdf(
  analysis: PasswordAnalysis,
  options: GenerateReportOptions = { targetIdentifier: 'Credential Security Audit', useBackendIfAvailable: true }
): Promise<void> {
  const filename = `DarkVault-Security-Audit-${Date.now()}.pdf`;
  const reportTitle = options.reportTitle || 'DarkVault Security Analysis Report';
  const showCrackTimes = options.includeCrackTimes !== false;
  const showRemediation = options.includeRemediation !== false;

  // Try backend ReportLab generator first if enabled
  if (options.useBackendIfAvailable) {
    try {
      const payload = {
        report_title: reportTitle,
        generated_by: 'DarkVault Command Center',
        target_identifier: options.targetIdentifier || 'Confidential Credential Audit',
        entropy_bits: analysis.entropyBits,
        strength_score: analysis.score,
        risk_level: analysis.grade === 'Hardened' ? 'SECURE' : analysis.grade.toUpperCase(),
        length: analysis.passwordLength,
        character_diversity: {
          lowercase: analysis.characterStats.lowercase > 0,
          uppercase: analysis.characterStats.uppercase > 0,
          numbers: analysis.characterStats.numbers > 0,
          symbols: analysis.characterStats.symbols > 0,
        },
        is_breached: analysis.breachStatus.breached,
        breach_count: analysis.breachStatus.count,
        crack_times: showCrackTimes ? analysis.crackTimes : {},
        detected_patterns: analysis.patterns.map((p) => `${p.label}: ${p.description}`),
        findings: analysis.patterns.map((p) => ({
          category: p.type,
          severity: p.severity.toUpperCase(),
          title: p.label,
          description: p.description,
          recommendation: 'Replace with high-entropy randomized credential.',
        })),
        nist_compliant: analysis.nistCompliant,
        recommendations: showRemediation ? analysis.recommendations : [],
      };

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        return;
      }
    } catch {
      // Backend unavailable; seamlessly fallback to client-side jsPDF generator
    }
  }

  // Pure Client-Side jsPDF Generator Fallback
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Dark header block
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 36, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(reportTitle.toUpperCase(), 15, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Target: ${options.targetIdentifier || 'Credential Security Audit'} | Zero-Knowledge Evaluation`, 15, 24);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()} | ID: DV-${Date.now().toString().slice(-8)}`, 15, 30);

  // Decorative Accent bar
  doc.setFillColor(99, 139, 255); // Electric Blue
  doc.rect(0, 36, 210, 2, 'F');

  let y = 46;

  // Audit Subject banner
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Security Assessment', 15, y);
  y += 6;

  const risk = analysis.grade === 'Hardened' ? 'SECURE' : analysis.grade.toUpperCase();
  const riskColor =
    risk === 'CRITICAL' || risk === 'WEAK' ? [239, 68, 68] : risk === 'MODERATE' ? [245, 158, 11] : [16, 185, 129];

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(15, y, 40, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`STATUS: ${risk}`, 19, y + 6.5);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `NIST SP 800-63B Compliance: ${analysis.nistCompliant ? 'VERIFIED COMPLIANT' : 'NON-COMPLIANT'}`,
    62,
    y + 4.5
  );
  doc.text(
    `Known Breach Exposure: ${
      analysis.breachStatus.breached
        ? `COMPROMISED (${analysis.breachStatus.count.toLocaleString()} occurrences)`
        : 'CLEAN (0 breach hits)'
    }`,
    62,
    y + 9
  );

  y += 18;

  // Cryptographic Metrics Table
  autoTable(doc, {
    startY: y,
    head: [['Cryptographic Metric', 'Measured Value', 'Industry Benchmark / Status']],
    body: [
      ['Information Shannon Entropy', `${analysis.entropyBits.toFixed(1)} bits`, '>= 60 bits recommended for brute-force resilience'],
      ['Composite Strength Score', `${analysis.score} / 100`, 'Evaluated via entropy, pool size & pattern deduction'],
      ['Credential Character Length', `${analysis.passwordLength} chars`, 'NIST minimum is 8; recommended >= 16 characters'],
      ['Character Diversity Pool', `${analysis.poolSize} possible glyphs`, 'Upper, lower, digits, symbols & spaces detected'],
      ['Unique Character Ratio', `${((analysis.characterStats.unique / (analysis.passwordLength || 1)) * 100).toFixed(0)}%`, 'Low uniqueness degrades effective search entropy'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 8.5, cellPadding: 3 },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 10;

  // Attack Vector Crack Times (conditionally included)
  if (showCrackTimes) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('2. Threat Vector Crack Estimations', 15, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Attack Vector', 'Time to Compromise', 'Rate Specification']],
      body: [
        ['Online Throttled', analysis.crackTimes.onlineThrottled, '100 attempts / hour (rate limited API)'],
        ['Online Unthrottled', analysis.crackTimes.onlineUnthrottled, '100 attempts / sec (unprotected login)'],
        ['Offline Fast Hash (MD5/NTLM)', analysis.crackTimes.offlineFastHash, '10 billion attempts / sec (consumer GPU)'],
        ['Offline GPU Rig (SHA-256)', analysis.crackTimes.offlineGpuRig, '100 billion attempts / sec (cluster)'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8.5, cellPadding: 3 },
    });

    // @ts-expect-error autoTable adds lastAutoTable to doc
    y = doc.lastAutoTable.finalY + 10;
  }

  // Pattern Detections & Recommendations
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Security Findings & Recommendations', 15, y);
  y += 6;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  if (analysis.patterns.length > 0) {
    analysis.patterns.forEach((p) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• [${p.severity.toUpperCase()}] ${p.label}:`, 18, y);
      doc.setFont('helvetica', 'normal');
      doc.text(p.description, 60, y);
      y += 5;
    });
  } else {
    doc.text('• No predictable keyboard walks, sequences, or dictionary words detected.', 18, y);
    y += 5;
  }

  if (showRemediation) {
    y += 3;
    analysis.recommendations.forEach((rec) => {
      doc.text(`→ ${rec}`, 18, y);
      y += 5;
    });
  }

  // Footer / Privacy disclaimer
  doc.setDrawColor(203, 213, 225);
  doc.line(15, 275, 195, 275);
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'DARKVAULT ZERO-KNOWLEDGE PROMISE: Plaintext passwords are NEVER sent or stored. Analysis executed in memory.',
    15,
    280
  );
  doc.text(`Report ID: DV-${Date.now()} | Page 1 of 1`, 195, 280, { align: 'right' });

  // Save PDF
  doc.save(filename);
}

