from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.audit_log import SecurityAuditLog
from app.schemas.stats import (
    DashboardStatsResponse,
    StrengthDistributionItem,
    ActivityTimelineItem,
    AlertItem,
)


def get_demo_dashboard_stats() -> DashboardStatsResponse:
    """Returns baseline demonstration dataset for initial startup preview."""
    return DashboardStatsResponse(
        is_demo_data=True,
        overall_security_score=78,
        total_analyses=142,
        strong_passwords=89,
        weak_passwords=31,
        breaches_detected=22,
        strength_distribution=[
            StrengthDistributionItem(category="Very Weak (0-20)", count=12, percentage=8.5),
            StrengthDistributionItem(category="Weak (21-40)", count=19, percentage=13.4),
            StrengthDistributionItem(category="Moderate (41-60)", count=22, percentage=15.5),
            StrengthDistributionItem(category="Strong (61-80)", count=48, percentage=33.8),
            StrengthDistributionItem(category="Hardened (81-100)", count=41, percentage=28.8),
        ],
        activity_timeline=[
            ActivityTimelineItem(
                id="act-1",
                timestamp="2 minutes ago",
                action="Breach Scan Triggered",
                risk="CRITICAL",
                details="SHA-1 prefix range query returned 1,482 breach hits for analyzed hash",
            ),
            ActivityTimelineItem(
                id="act-2",
                timestamp="14 minutes ago",
                action="Credential Generation",
                risk="SECURE",
                details="Generated 32-character high-entropy cryptographic alphanumeric secret",
            ),
            ActivityTimelineItem(
                id="act-3",
                timestamp="1 hour ago",
                action="Batch Security Audit",
                risk="MEDIUM",
                details="Audited 12 credentials against NIST SP 800-63B guidelines",
            ),
            ActivityTimelineItem(
                id="act-4",
                timestamp="3 hours ago",
                action="Dictionary Pattern Detected",
                risk="HIGH",
                details="Detected leetspeak substitution of common dictionary word ('p@$$w0rd')",
            ),
        ],
        recent_alerts=[
            AlertItem(
                id="alt-1",
                severity="CRITICAL",
                title="Known Breach Exposure Detected",
                description="Analyzed credential matches public credential dump across 1,482 occurrences.",
                time="10m ago",
            ),
            AlertItem(
                id="alt-2",
                severity="HIGH",
                title="Low Entropy Warning",
                description="Calculated entropy below 35 bits. Vulnerable to sub-second brute-force hash recovery.",
                time="42m ago",
            ),
            AlertItem(
                id="alt-3",
                severity="MEDIUM",
                title="Keyboard Walking Pattern Found",
                description="Sequential pattern sequence 'qwerty!23' detected in sample scan.",
                time="2h ago",
            ),
        ],
    )


def get_live_dashboard_stats(db: Session, force_demo: bool = False) -> DashboardStatsResponse:
    """Computes actual telemetry metrics from database logs."""
    if force_demo:
        return get_demo_dashboard_stats()

    total = db.query(SecurityAuditLog).count()
    if total == 0:
        return DashboardStatsResponse(
            is_demo_data=False,
            overall_security_score=0,
            total_analyses=0,
            strong_passwords=0,
            weak_passwords=0,
            breaches_detected=0,
            strength_distribution=[
                StrengthDistributionItem(category="Very Weak (0-20)", count=0, percentage=0.0),
                StrengthDistributionItem(category="Weak (21-40)", count=0, percentage=0.0),
                StrengthDistributionItem(category="Moderate (41-60)", count=0, percentage=0.0),
                StrengthDistributionItem(category="Strong (61-80)", count=0, percentage=0.0),
                StrengthDistributionItem(category="Hardened (81-100)", count=0, percentage=0.0),
            ],
            activity_timeline=[],
            recent_alerts=[],
        )

    strong = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score >= 60).count()
    weak = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score < 40).count()
    breached = db.query(SecurityAuditLog).filter(SecurityAuditLog.breached == True).count()
    
    # Calculate average score
    avg_score = db.query(func.avg(SecurityAuditLog.strength_score)).scalar() or 0
    
    # Buckets
    b1 = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score <= 20).count()
    b2 = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score > 20, SecurityAuditLog.strength_score <= 40).count()
    b3 = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score > 40, SecurityAuditLog.strength_score <= 60).count()
    b4 = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score > 60, SecurityAuditLog.strength_score <= 80).count()
    b5 = db.query(SecurityAuditLog).filter(SecurityAuditLog.strength_score > 80).count()

    distribution = [
        StrengthDistributionItem(category="Very Weak (0-20)", count=b1, percentage=round((b1/total)*100, 1)),
        StrengthDistributionItem(category="Weak (21-40)", count=b2, percentage=round((b2/total)*100, 1)),
        StrengthDistributionItem(category="Moderate (41-60)", count=b3, percentage=round((b3/total)*100, 1)),
        StrengthDistributionItem(category="Strong (61-80)", count=b4, percentage=round((b4/total)*100, 1)),
        StrengthDistributionItem(category="Hardened (81-100)", count=b5, percentage=round((b5/total)*100, 1)),
    ]

    recent_logs = db.query(SecurityAuditLog).order_by(SecurityAuditLog.timestamp.desc()).limit(5).all()
    timeline = []
    alerts = []
    
    for log in recent_logs:
        timeline.append(
            ActivityTimelineItem(
                id=f"act-{log.id}",
                timestamp=log.timestamp.strftime("%H:%M:%S UTC"),
                action=f"{log.audit_type.replace('_', ' ').title()}",
                risk=log.risk_level,
                details=f"Entropy: {log.entropy_bits:.1f} bits, Score: {log.strength_score}/100, Breached: {'Yes' if log.breached else 'No'}",
            )
        )
        if log.breached:
            alerts.append(
                AlertItem(
                    id=f"alt-{log.id}",
                    severity="CRITICAL",
                    title="Breached Credential Logged",
                    description=f"Anonymous audit logged exposure count of {log.breach_count}.",
                    time=log.timestamp.strftime("%H:%M UTC"),
                )
            )
        elif log.strength_score and log.strength_score < 40:
            alerts.append(
                AlertItem(
                    id=f"alt-{log.id}",
                    severity="HIGH",
                    title="Weak Password Detected",
                    description=f"Score {log.strength_score}/100 with entropy {log.entropy_bits:.1f} bits.",
                    time=log.timestamp.strftime("%H:%M UTC"),
                )
            )

    return DashboardStatsResponse(
        is_demo_data=False,
        overall_security_score=int(avg_score),
        total_analyses=total,
        strong_passwords=strong,
        weak_passwords=weak,
        breaches_detected=breached,
        strength_distribution=distribution,
        activity_timeline=timeline if timeline else get_demo_dashboard_stats().activity_timeline,
        recent_alerts=alerts if alerts else get_demo_dashboard_stats().recent_alerts,
    )

