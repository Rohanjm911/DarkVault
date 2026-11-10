from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime
from datetime import datetime, timezone
from app.core.database import Base


class SecurityAuditLog(Base):
    """
    Stores anonymized audit metrics.
    STRICT PRIVACY POLICY:
    - NEVER store plaintext passwords.
    - NEVER store identifiable personal data.
    - ONLY store aggregated telemetry and metrics (entropy, score, risk, length).
    """
    __tablename__ = "security_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    audit_type = Column(String(50), default="single_analysis")  # single_analysis, batch_audit, breach_check
    entropy_bits = Column(Float, nullable=True)
    strength_score = Column(Integer, nullable=True)  # 0 to 100
    risk_level = Column(String(20), default="UNKNOWN")  # CRITICAL, HIGH, MEDIUM, LOW, SECURE
    length = Column(Integer, nullable=True)
    breached = Column(Boolean, default=False)
    breach_count = Column(Integer, default=0)
    has_uppercase = Column(Boolean, default=False)
    has_lowercase = Column(Boolean, default=False)
    has_numbers = Column(Boolean, default=False)
    has_symbols = Column(Boolean, default=False)
    nist_compliant = Column(Boolean, default=False)
