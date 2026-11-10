# DarkVault Installation Guide

This guide details how to install, configure, and execute the DarkVault Password Security Command Center in development and production environments.

---

## 1. Prerequisites

Ensure the following tools are installed on your host system:

- **Node.js**: v18.0.0 or later (v20+ / v22+ recommended)
- **npm**: v9.0.0 or later
- **Python**: v3.10 or later (v3.11, v3.12, v3.13, v3.14 supported)
- **pip**: Latest
- **Docker & Docker Compose** (optional, for containerized deployment)

### A. One-Click Windows Build & Launch
- **Build Pipeline**: Double-click `build.bat` (or run `.\build.bat` in PowerShell/CMD) to run backend tests, frontend tests, and generate the production bundle.
- **Run Application**: Double-click `run.bat` (or run `.\run.bat`) to launch both the FastAPI backend and Vite frontend dev servers in parallel.

---

## 3. Manual Development Setup

### A. Clone & Setup Workspace
```bash
git clone https://github.com/your-username/DarkVault.git
cd DarkVault
```

### B. Setup Python Backend
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend API server (runs at http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### C. Setup React Frontend
Open a new terminal window:
```bash
cd frontend

# Install frontend dependencies
npm install

# Run frontend development server (runs at http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 3. Running with Docker Compose

For a one-command production-like deployment:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:5173` (or `http://localhost`)
- **Backend API Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

---

## 4. Running the Test Suites

### Backend Unit & Integration Tests (Pytest)
```bash
cd backend
python -m pytest
```

### Frontend Tests (Vitest)
```bash
cd frontend
npm run test
```

### Production Build Validation
```bash
cd frontend
npm run build
```

