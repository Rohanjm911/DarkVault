# DarkVault Development Guide

This document provides technical guidelines for developers contributing to or extending DarkVault.

---

## 1. Project Directory Structure

```
DarkVault/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/        # FastAPI route controllers
│   │   ├── core/                 # Config & Database sessions
│   │   ├── models/               # SQLAlchemy telemetry tables
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # HIBP proxy & ReportLab PDF generator
│   │   └── main.py               # FastAPI application entrypoint
│   ├── tests/                    # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # UI cards, buttons, badges, navigation
│   │   ├── lib/
│   │   │   ├── api/              # HIBP client & Telemetry client
│   │   │   ├── crypto/           # SHA-1, Entropy engine, CSPRNG generator
│   │   │   ├── dictionary/       # Top password sets, leetspeak, keyboard patterns
│   │   │   ├── pdf/              # jsPDF dual-engine client export
│   │   │   ├── store/            # State management & settings
│   │   │   └── types/            # TypeScript interfaces
│   │   ├── pages/                # Module views (Dashboard, Analyzer, etc.)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css             # Cyber theme variables & animations
│   ├── tests/                    # Vitest test suite
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docs/                         # Architecture, API, Security, Installation
├── docker-compose.yml
└── README.md
```

---

## 2. Coding Standards

### Frontend
- Strict TypeScript mode enabled.
- Avoid using `any` type annotations; all crypto objects, findings, and analysis records must use defined interfaces in `src/lib/types/index.ts`.
- Use Tailwind CSS utility classes and the dark cyber theme color palette (`#080B14`, `#111827`, `#638BFF`, `#936BFF`, `#43D6A0`).
- Ensure all interactive buttons have explicit `cursor-pointer`, focus outlines, and active feedback states.

### Backend
- Follow PEP 8 style guidelines.
- Enforce strict typing with Pydantic models.
- All database operations must use SQLAlchemy parameterized queries to prevent SQL injection.
- Security middleware must intercept and reject any plaintext credential attempts.

---

## 3. Running Continuous Tests

### Backend Tests
```bash
cd backend
python -m pytest -v
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### TypeScript & Linter Validation
```bash
cd frontend
npm run build
```

