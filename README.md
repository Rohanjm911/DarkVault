# 🛡️ DARKVAULT: Your Password Security Command Center

[![Zero-Knowledge](https://img.shields.io/badge/Privacy-Zero--Knowledge-10b981?style=for-the-badge&logo=shield)](file:///docs/SECURITY.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-React_19-3178c6?style=for-the-badge&logo=typescript)](file:///frontend)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.14-009688?style=for-the-badge&logo=fastapi)](file:///backend)
[![Docker](https://img.shields.io/badge/Docker-Compose_Ready-2496ed?style=for-the-badge&logo=docker)](file:///docker-compose.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **"Your Password Security Command Center."**  
> A professional-grade, privacy-first cybersecurity platform for real-time password strength analysis, Shannon entropy calculation, k-anonymity breach exposure detection, cryptographically secure password generation, and executive PDF audit reporting.

---

## 🌟 Key Highlights & Zero-Knowledge Architecture

- **🔒 100% Zero-Knowledge Guarantee:** Plaintext passwords **NEVER** leave your browser. Analysis is executed client-side using the native Web Crypto API.
- **⚡ K-Anonymity Breach Lookups:** Integrates with the Have I Been Pwned repository (>1 billion compromised passwords). Computes SHA-1 digests locally and transmits only the first 5 hexadecimal characters.
- **📊 Shannon Entropy & Pattern Detection:** Computes true mathematical entropy ($\text{bits}$) with heuristic deductions for keyboard walks, repeated characters, sequential runs, common wordlists (RockYou/SecLists), and leetspeak disguises.
- **🔑 Cryptographic Secret Generator:** Employs `crypto.getRandomValues()` with rejection sampling to eliminate statistical modulo bias. Supports alphanumeric secrets, Diceware passphrases, and secure PINs.
- **📑 Dual-Engine Executive PDF Reports:** Compiles print-ready cybersecurity audit documents with attack vector resilience tables and NIST compliance ratings (via backend ReportLab and client-side jsPDF).
- **📋 NIST SP 800-63B Compliance Matrix:** Audits credential hygiene against US Federal Digital Identity Guidelines.

---

## 🚀 Application Modules

| Module | Description | Implementation Details |
| :--- | :--- | :--- |
| **Command Dashboard** | Interactive security command overview | Composite security index, strength distribution charts, live activity timeline, and instant metric toggles. |
| **Password Analyzer** | Deep-dive cryptographic inspection | Real-time Shannon entropy meter, character diversity grid, pattern detections, and 4-tier threat crack times. |
| **Breach Checker** | K-Anonymity leak detection | SHA-1 prefix range queries, local memory suffix matching, and breach incident response guidance. |
| **Key Generator** | CSPRNG credential generator | Rejection-sampled Web Crypto engine, Diceware passphrases, and batch generation. |
| **Security Audit** | NIST compliance checklist | SP 800-63B policy validation, batch password auditing, and vulnerability categorization. |
| **Executive Reports** | Print-ready PDF compiler | Dual-engine PDF generator (server-side ReportLab & client-side jsPDF fallback). |
| **Settings & Privacy** | Runtime preferences | Vault memory purge, telemetry toggles, API proxy routing, and cyber accent themes. |

---

## 🛠️ Technology Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,python,fastapi,sqlite,postgres,docker,nginx,git,github" alt="DarkVault Tech Stack Logos" />
</p>

### 🎨 Frontend & Client-Side Cryptography

| Technology | Logo | Category | Role in DarkVault |
| :--- | :---: | :--- | :--- |
| **React 19** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="28" height="28" alt="React" /> | UI Library | Component-driven reactive architecture & state synchronization |
| **TypeScript** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="28" height="28" alt="TypeScript" /> | Language | End-to-end type safety for cryptographic keys and audit payloads |
| **Vite** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="28" height="28" alt="Vite" /> | Build Tool | Ultra-fast HMR and optimized tree-shaken production bundles |
| **Tailwind CSS v4** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="28" height="28" alt="Tailwind CSS" /> | Styling | Modern dark cyberpunk theme, glassmorphism surfaces & responsive grids |
| **Framer Motion** | <img src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/framer.svg" width="28" height="28" alt="Framer Motion" /> | Motion Engine | Smooth page transitions, radar gauge sweep, and micro-interactions |
| **Recharts** | <img src="https://raw.githubusercontent.com/recharts/recharts.org/master/public/favicon.ico" width="28" height="28" alt="Recharts" /> | Data Visualization | Interactive password entropy & strength distribution telemetry |
| **Web Crypto API** | <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/shield-halved.svg" width="28" height="28" alt="Web Crypto" /> | Security Standard | In-memory SHA-1 k-anonymity hashing and CSPRNG secret generation |
| **Vitest** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitest/vitest-original.svg" width="28" height="28" alt="Vitest" /> | Unit Testing | Fast in-memory unit tests for cryptographic algorithms & entropy |

### ⚙️ Backend & API Services

| Technology | Logo | Category | Role in DarkVault |
| :--- | :---: | :--- | :--- |
| **Python 3.14** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="28" height="28" alt="Python" /> | Core Language | Robust backend logic, cryptographic services, and data processing |
| **FastAPI** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" width="28" height="28" alt="FastAPI" /> | Web Framework | Asynchronous high-performance REST API with automated OpenAPI docs |
| **Pydantic v2** | <img src="https://raw.githubusercontent.com/pydantic/pydantic/main/docs/logo.svg" width="28" height="28" alt="Pydantic" /> | Data Validation | Strict schema validation guaranteeing zero plaintext leaks |
| **HTTPX** | <img src="https://raw.githubusercontent.com/encode/httpx/master/docs/img/favicon.ico" width="28" height="28" alt="HTTPX" /> | Async HTTP Client | Queries HIBP k-anonymity range API with anti-fingerprint padding |
| **ReportLab** | <img src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/file-pdf.svg" width="28" height="28" alt="ReportLab" /> | PDF Generation | Executive-grade vector PDF audit reports compilation |
| **Pytest** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/pytest/pytest-original.svg" width="28" height="28" alt="Pytest" /> | Testing Framework | Comprehensive integration tests for endpoints and security policies |

### 🗄️ Database & Storage

| Technology | Logo | Category | Role in DarkVault |
| :--- | :---: | :--- | :--- |
| **SQLite** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg" width="28" height="28" alt="SQLite" /> | Local Database | Lightweight zero-config database for local telemetry metrics |
| **PostgreSQL** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="28" height="28" alt="PostgreSQL" /> | Production DB | PostgreSQL-ready enterprise persistence via SQLAlchemy 2.0 |
| **SQLAlchemy** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlalchemy/sqlalchemy-original.svg" width="28" height="28" alt="SQLAlchemy" /> | ORM | Type-safe database mapping strictly limited to anonymous audit logs |

### 🚢 Deployment & Infrastructure

| Technology | Logo | Category | Role in DarkVault |
| :--- | :---: | :--- | :--- |
| **Docker** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" width="28" height="28" alt="Docker" /> | Containerization | Multi-stage, non-root isolated containers for backend and frontend |
| **Docker Compose** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" width="28" height="28" alt="Docker Compose" /> | Orchestration | Single-command deployment connecting frontend and API services |
| **Nginx** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg" width="28" height="28" alt="Nginx" /> | Web Server / Proxy | High-performance static asset delivery with reverse proxy and HSTS |
| **Git & GitHub** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" width="28" height="28" alt="Git" /> | Version Control | Modular architecture, CI testing, and open-source collaboration |

---

## ⚡ Quickstart

### 1. Windows One-Click Build & Run
- **Build Pipeline**: Double-click `build.bat` (or execute `.\build.bat`) to verify prerequisites, run backend Pytest, run frontend Vitest, and compile the production bundle.
- **Launch Application**: Double-click `run.bat` (or execute `.\run.bat`) to start both the FastAPI backend (`:8000`) and the React frontend (`:5173`) concurrently.

---

### 2. Run with Docker Compose
```bash
git clone https://github.com/Rohanjm911/DarkVault.git
cd DarkVault
docker compose up --build
```
- Frontend UI: `http://localhost:5173` (or `http://localhost`)
- Backend API Docs: `http://localhost:8000/docs`

---

### 3. Manual Development Setup

#### Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Running the Automated Test Suites

### Backend Tests (7/7 Passed)
```bash
cd backend
python -m pytest
```

### Frontend Tests (9/9 Passed)
```bash
cd frontend
npm run test
```

---

## 🔒 Security & Threat Model

For an in-depth breakdown of our threat modeling, mathematical heuristics, and zero-knowledge guarantees, see [docs/SECURITY.md](docs/SECURITY.md).

For detailed architecture diagrams and protocol data flows, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 📄 Documentation Sitemap
- [Installation Guide](docs/INSTALLATION.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Specification](docs/API.md)
- [Security Whitepaper](docs/SECURITY.md)
- [Development Guide](docs/DEVELOPMENT.md)

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for details.

