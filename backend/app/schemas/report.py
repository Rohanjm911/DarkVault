from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class FindingItem(BaseModel):
    category: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    title: str
    description: str
    recommendation: str


class AuditReportRequest(BaseModel):
    """
    Anonymized report request payload.
    Plaintext passwords must NEVER be sent.
    """
    report_title: str = "DarkVault Security Analysis Report"
    generated_by: str = "DarkVault v1.0.0 Command Center"
    target_identifier: Optional[str] = "Confidential Credential Audit"
    
    # Anonymized metrics
    entropy_bits: float = Field(..., ge=0, le=512)
    strength_score: int = Field(..., ge=0, le=100)
    risk_level: str = "MEDIUM"
    length: int = Field(..., ge=0)
    
    character_diversity: dict = Field(
        default_factory=lambda: {
            "lowercase": True,
            "uppercase": False,
            "numbers": True,
            "symbols": False,
        }
    )
    
    # Breach findings (anonymized)
    is_breached: bool = False
    breach_count: int = 0
    
    # Crack time estimations
    crack_times: dict = Field(
        default_factory=lambda: {
            "online_throttled": "Centuries",
            "online_unthrottled": "Years",
            "offline_fast_hash": "Days",
            "offline_gpu_rig": "Hours",
        }
    )
    
    # Pattern detections
    detected_patterns: List[str] = Field(default_factory=list)
    findings: List[FindingItem] = Field(default_factory=list)
    nist_compliant: bool = False
    recommendations: List[str] = Field(default_factory=list)


class AuditTelemetryLog(BaseModel):
    audit_type: str = "single_analysis"
    entropy_bits: float
    strength_score: int
    risk_level: str
    length: int
    breached: bool = False
    breach_count: int = 0
    has_uppercase: bool = False
    has_lowercase: bool = False
    has_numbers: bool = False
    has_symbols: bool = False
    nist_compliant: bool = False

