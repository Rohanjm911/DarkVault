# DarkVault REST API Specification

Base URL: `http://localhost:8000/api`

Interactive OpenAPI Documentation: `http://localhost:8000/docs`

---

## 1. System Health

### `GET /api/health`
Checks backend service operational status and privacy enforcement.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "service": "DarkVault",
  "version": "1.0.0",
  "privacy_mode": "Zero-Knowledge Enforced"
}
```

---

## 2. Breach Range Checker (K-Anonymity)

### `GET /api/breach/range/{prefix}`
Fetches the candidate list of hash suffixes matching a 5-character hexadecimal SHA-1 prefix.

**Path Parameters:**
- `prefix` (string, required): Exactly 5 hexadecimal characters `[0-9A-Fa-f]`.

**Headers:**
- `X-K-Anonymity-Prefix`: The normalized 5-char prefix.
- `X-Cache-Status`: `HIT` or `MISS`.

**Response `200 OK` (`text/plain`):**
```text
0018A45C4D1DEF81644B54AB7F969B88D65:1
00D4F6E8FA6ECC350A20C81C3D9E80BEB10:3
01E65D1A292D43A5D4807B26D4301CB3542:14
...
```

**Security Safeguard:**
Requests containing fewer or more than 5 characters or non-hex characters receive `400 Bad Request` or `422 Unprocessable Entity`.

---

## 3. Executive PDF Report Generation

### `POST /api/reports/generate`
Compiles an executive-grade cybersecurity PDF report. Payload must contain only anonymized metrics.

**Request Body (`application/json`):**
```json
{
  "report_title": "DarkVault Security Analysis Report",
  "generated_by": "DarkVault Command Center",
  "target_identifier": "Core Infrastructure Credential",
  "entropy_bits": 78.4,
  "strength_score": 92,
  "risk_level": "SECURE",
  "length": 22,
  "character_diversity": {
    "lowercase": true,
    "uppercase": true,
    "numbers": true,
    "symbols": true
  },
  "is_breached": false,
  "breach_count": 0,
  "crack_times": {
    "online_throttled": "Centuries",
    "online_unthrottled": "Decades",
    "offline_fast_hash": "Years",
    "offline_gpu_rig": "Months"
  },
  "detected_patterns": [],
  "findings": [],
  "nist_compliant": true,
  "recommendations": [
    "Credential exceeds baseline cryptographic entropy thresholds."
  ]
}
```

**Response `200 OK` (`application/pdf`):**
Binary PDF document stream.

---

## 4. Dashboard & Anonymous Telemetry

### `GET /api/stats/dashboard?demo={true|false}`
Returns aggregated telemetry for the security command dashboard.

**Query Parameters:**
- `demo` (boolean, optional): If `true`, returns demonstration metrics. If `false`, returns actual SQLite database telemetry.

**Response `200 OK` (`application/json`):**
```json
{
  "is_demo_data": false,
  "overall_security_score": 85,
  "total_analyses": 24,
  "strong_passwords": 19,
  "weak_passwords": 2,
  "breaches_detected": 3,
  "strength_distribution": [
    { "category": "Very Weak (0-20)", "count": 1, "percentage": 4.2 },
    { "category": "Weak (21-40)", "count": 1, "percentage": 4.2 },
    { "category": "Moderate (41-60)", "count": 3, "percentage": 12.5 },
    { "category": "Strong (61-80)", "count": 9, "percentage": 37.5 },
    { "category": "Hardened (81-100)", "count": 10, "percentage": 41.6 }
  ],
  "activity_timeline": [ ... ],
  "recent_alerts": [ ... ]
}
```

### `POST /api/stats/telemetry`
Records strictly anonymized audit telemetry. Plaintext passwords or hashes are prohibited.

**Request Body (`application/json`):**
```json
{
  "audit_type": "single_analysis",
  "entropy_bits": 68.2,
  "strength_score": 88,
  "risk_level": "SECURE",
  "length": 18,
  "breached": false,
  "breach_count": 0,
  "has_uppercase": true,
  "has_lowercase": true,
  "has_numbers": true,
  "has_symbols": true,
  "nist_compliant": true
}
```

