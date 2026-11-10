from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.stats import DashboardStatsResponse
from app.schemas.report import AuditTelemetryLog
from app.services.stats import get_live_dashboard_stats
from app.models.audit_log import SecurityAuditLog

router = APIRouter(prefix="/stats", tags=["Dashboard Statistics"])


@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_metrics(
    demo: bool = Query(False, description="Force demo dataset view"),
    db: Session = Depends(get_db)
):
    """
    Returns aggregated security dashboard metrics.
    Clearly distinguishes actual metrics from demonstration data via `is_demo_data`.
    """
    return get_live_dashboard_stats(db, force_demo=demo)


@router.post("/telemetry")
def record_anonymous_telemetry(
    log: AuditTelemetryLog,
    db: Session = Depends(get_db)
):
    """
    Records purely anonymized analysis telemetry.
    Strictly forbids plaintext passwords or hashes.
    """
    db_entry = SecurityAuditLog(
        audit_type=log.audit_type,
        entropy_bits=log.entropy_bits,
        strength_score=log.strength_score,
        risk_level=log.risk_level,
        length=log.length,
        breached=log.breached,
        breach_count=log.breach_count,
        has_uppercase=log.has_uppercase,
        has_lowercase=log.has_lowercase,
        has_numbers=log.has_numbers,
        has_symbols=log.has_symbols,
        nist_compliant=log.nist_compliant,
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return {"status": "success", "id": db_entry.id}

