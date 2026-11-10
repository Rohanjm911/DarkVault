import io
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from app.schemas.report import AuditReportRequest


def generate_security_pdf(audit_data: AuditReportRequest) -> io.BytesIO:
    """
    Generates a professional, print-ready cybersecurity PDF audit report.
    Never includes plaintext passwords or full hashes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()

    # Custom styling
    primary_color = colors.HexColor("#0f172a")
    electric_blue = colors.HexColor("#3b82f6")
    neon_purple = colors.HexColor("#8b5cf6")
    cyber_green = colors.HexColor("#10b981")
    warning_amber = colors.HexColor("#f59e0b")
    danger_red = colors.HexColor("#ef4444")
    dark_gray = colors.HexColor("#334155")
    light_bg = colors.HexColor("#f8fafc")

    title_style = ParagraphStyle(
        "DarkVaultTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=primary_color,
    )
    
    subtitle_style = ParagraphStyle(
        "DarkVaultSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748b"),
    )

    section_heading = ParagraphStyle(
        "DarkVaultSection",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6,
    )

    body_text = ParagraphStyle(
        "DarkVaultBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1e293b"),
    )

    badge_style = ParagraphStyle(
        "DarkVaultBadge",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        alignment=1,  # Center
        textColor=colors.white,
    )

    story = []

    # Header with title and metadata
    header_data = [
        [
            Paragraph("<b>DARKVAULT</b> <font size=10 color='#64748b'>| Security Command Center</font>", title_style),
            Paragraph(f"<b>Audit Date:</b> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}<br/><b>Doc ID:</b> DV-{int(datetime.now(timezone.utc).timestamp())}", subtitle_style),
        ]
    ]
    header_table = Table(header_data, colWidths=[330, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=electric_blue, spaceBefore=4, spaceAfter=12))

    # Executive Summary / Risk Banner
    risk = audit_data.risk_level.upper()
    if risk in ["CRITICAL", "HIGH"]:
        banner_color = danger_red
        risk_desc = "CRITICAL RISK DETECTED — Credential requires immediate replacement."
    elif risk == "MEDIUM":
        banner_color = warning_amber
        risk_desc = "MODERATE SECURITY RISK — Improvements recommended to withstand modern offline cracking."
    else:
        banner_color = cyber_green
        risk_desc = "EXCELLENT SECURITY POSTURE — Compliant with modern cryptographic standards."

    banner_data = [
        [
            Paragraph(f"<b>RISK LEVEL: {risk}</b>", badge_style),
            Paragraph(f"<b>{risk_desc}</b><br/><font size=8>Evaluated under NIST SP 800-63B and Information Entropy benchmarks.</font>", ParagraphStyle("BannerDesc", parent=body_text, textColor=colors.HexColor("#0f172a"))),
        ]
    ]
    banner_table = Table(banner_data, colWidths=[140, 390])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), banner_color),
        ('BACKGROUND', (1, 0), (1, 0), light_bg),
        ('ALIGN', (0, 0), (0, 0), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (1, 0), (1, 0), 12),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 14))

    # Primary Metrics Table
    story.append(Paragraph("<b>1. Cryptographic & Security Metrics</b>", section_heading))
    metrics_data = [
        ["Metric", "Value", "Benchmark / Status"],
        ["Shannon Entropy", f"{audit_data.entropy_bits:.1f} bits", "Recommended >= 60 bits for offline attack defense"],
        ["Strength Score", f"{audit_data.strength_score} / 100", "Composite algorithm incorporating entropy & patterns"],
        ["Character Length", f"{audit_data.length} characters", "NIST minimum is 8; recommended >= 16"],
        ["Known Breach Exposure", f"{'COMPROMISED (' + str(audit_data.breach_count) + ' occurrences)' if audit_data.is_breached else 'CLEAN (0 found)'}", "Checked against 1+ billion HIBP database via k-anonymity"],
        ["NIST SP 800-63B Compliance", "COMPLIANT" if audit_data.nist_compliant else "NON-COMPLIANT", "Meets US federal digital identity guidelines"],
    ]
    metrics_table = Table(metrics_data, colWidths=[160, 140, 230])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 14))

    # Crack Time Analysis
    story.append(Paragraph("<b>2. Attack Vector Resilience (Estimated Crack Times)</b>", section_heading))
    crack_data = [
        ["Attack Scenario", "Estimated Time to Compromise", "Threat Model Description"],
        ["Online Throttled", str(audit_data.crack_times.get("online_throttled", "N/A")), "100 guesses/hour with rate limits & CAPTCHA"],
        ["Online Unthrottled", str(audit_data.crack_times.get("online_unthrottled", "N/A")), "10 guesses/sec against poorly defended API"],
        ["Offline Fast Hash (MD5)", str(audit_data.crack_times.get("offline_fast_hash", "N/A")), "10 billion guesses/sec on consumer GPU"],
        ["Offline GPU Rig (SHA-256)", str(audit_data.crack_times.get("offline_gpu_rig", "N/A")), "100 billion guesses/sec on specialized cluster"],
    ]
    crack_table = Table(crack_data, colWidths=[150, 150, 230])
    crack_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(crack_table)
    story.append(Spacer(1, 14))

    # Findings & Detected Patterns
    story.append(Paragraph("<b>3. Security Findings & Pattern Detections</b>", section_heading))
    if audit_data.detected_patterns:
        pattern_text = ", ".join(audit_data.detected_patterns)
    else:
        pattern_text = "No predictable sequences, dictionary words, or leetspeak substitutions detected."
    story.append(Paragraph(f"<b>Pattern Scan:</b> {pattern_text}", body_text))
    story.append(Spacer(1, 6))

    if audit_data.findings:
        findings_data = [["Severity", "Finding", "Remediation"]]
        for f in audit_data.findings[:6]:  # Limit to 6 for PDF page fit
            findings_data.append([
                f.severity,
                f"{f.title}: {f.description}",
                f.recommendation
            ])
        findings_table = Table(findings_data, colWidths=[70, 230, 230])
        findings_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8.5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_bg]),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(findings_table)
    else:
        story.append(Paragraph("All baseline security heuristics passed with zero vulnerability flags.", body_text))

    story.append(Spacer(1, 14))

    # Recommendations
    story.append(Paragraph("<b>4. Hardening Recommendations</b>", section_heading))
    recs = audit_data.recommendations if audit_data.recommendations else [
        "Maintain minimum 16-character length for critical infrastructure accounts.",
        "Enable multi-factor authentication (FIDO2 WebAuthn or TOTP hardware token).",
        "Utilize DarkVault Cryptographic Generator to create high-entropy passphrases.",
        "Store credentials exclusively in a zero-knowledge encrypted vault."
    ]
    for r in recs[:4]:
        story.append(Paragraph(f"• <b>{r}</b>", body_text))
        story.append(Spacer(1, 3))

    # Privacy Guarantee Footer
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceBefore=4, spaceAfter=8))
    privacy_statement = (
        "<b>DARKVAULT ZERO-KNOWLEDGE POLICY:</b> This security audit was executed with zero plaintext exposure. "
        "Neither the credential nor its full hash was ever transmitted, recorded, or persisted. "
        "Breach checks use mathematical k-anonymity (SHA-1 prefix range). Generated by DarkVault Command Center."
    )
    story.append(Paragraph(privacy_statement, ParagraphStyle("DarkVaultPrivacy", parent=subtitle_style, fontSize=7.5, leading=10)))

    doc.build(story)
    buffer.seek(0)
    return buffer
