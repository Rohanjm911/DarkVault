import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "DarkVault"


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "tagline" in data


def test_breach_prefix_validation():
    # Valid prefix
    response = client.get("/api/breach/range/21BD1")
    # Will either succeed or get 502/rate-limited if offline, but 400 is not expected
    assert response.status_code in [200, 502, 500]

    # Invalid prefix - too short
    response = client.get("/api/breach/range/21B")
    assert response.status_code == 422 or response.status_code == 400

    # Invalid prefix - non-hex characters
    response = client.get("/api/breach/range/21BZZ")
    assert response.status_code == 400


def test_security_violation_plaintext_param():
    # Attempting to pass plaintext password in query param must be rejected immediately
    response = client.get("/api/health?password=secret123")
    assert response.status_code == 400
    assert "Security Violation" in response.json()["error"]


def test_dashboard_stats():
    response = client.get("/api/stats/dashboard?demo=true")
    assert response.status_code == 200
    data = response.json()
    assert data["is_demo_data"] is True
    assert "overall_security_score" in data
    assert "strength_distribution" in data
    assert len(data["strength_distribution"]) > 0


def test_anonymous_telemetry():
    telemetry_data = {
        "audit_type": "single_analysis",
        "entropy_bits": 65.4,
        "strength_score": 85,
        "risk_level": "SECURE",
        "length": 16,
        "breached": False,
        "breach_count": 0,
        "has_uppercase": True,
        "has_lowercase": True,
        "has_numbers": True,
        "has_symbols": True,
        "nist_compliant": True
    }
    response = client.post("/api/stats/telemetry", json=telemetry_data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_pdf_report_generation():
    report_data = {
        "report_title": "DarkVault Credential Security Report",
        "generated_by": "DarkVault Engine",
        "entropy_bits": 74.2,
        "strength_score": 90,
        "risk_level": "SECURE",
        "length": 18,
        "character_diversity": {
            "lowercase": True,
            "uppercase": True,
            "numbers": True,
            "symbols": True
        },
        "is_breached": False,
        "breach_count": 0,
        "crack_times": {
            "online_throttled": "Centuries",
            "online_unthrottled": "Decades",
            "offline_fast_hash": "Years",
            "offline_gpu_rig": "Months"
        },
        "detected_patterns": [],
        "findings": [],
        "nist_compliant": True,
        "recommendations": ["Credential meets highest NIST SP 800-63B standards."]
    }
    response = client.post("/api/reports/generate", json=report_data)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 1000  # PDF generated with valid binary stream

