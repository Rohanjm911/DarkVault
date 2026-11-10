from pydantic import BaseModel
from typing import List, Dict, Any


class StrengthDistributionItem(BaseModel):
    category: str  # e.g., "Very Weak", "Weak", "Medium", "Strong", "Unbreakable"
    count: int
    percentage: float


class ActivityTimelineItem(BaseModel):
    id: str
    timestamp: str
    action: str
    risk: str
    details: str


class AlertItem(BaseModel):
    id: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    title: str
    description: str
    time: str


class DashboardStatsResponse(BaseModel):
    is_demo_data: bool
    overall_security_score: int
    total_analyses: int
    strong_passwords: int
    weak_passwords: int
    breaches_detected: int
    strength_distribution: List[StrengthDistributionItem]
    activity_timeline: List[ActivityTimelineItem]
    recent_alerts: List[AlertItem]

