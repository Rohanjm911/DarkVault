@echo off
setlocal enabledelayedexpansion

title DarkVault - Build System

echo =====================================================================
echo               DARKVAULT - SECURITY COMMAND CENTER
echo                   Production Build ^& Test Pipeline
echo =====================================================================
echo.

:: 1. Check Node.js
echo [1/5] Checking Node.js environment...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in PATH. Please install Node.js v18+.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  -- Found Node.js %NODE_VER%

:: 2. Check Python
echo.
echo [2/5] Checking Python environment...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not found in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version') do set PY_VER=%%v
echo  -- Found %PY_VER%

:: 3. Run Backend Tests
echo.
echo [3/5] Verifying Backend Tests (FastAPI ^& Security Engine)...
cd backend
python -m pytest
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend tests failed. Aborting build.
    cd ..
    pause
    exit /b 1
)
echo  -- Backend tests: PASSED (All endpoints, k-anonymity ^& PDF services verified).
cd ..

:: 4. Run Frontend Unit Tests
echo.
echo [4/5] Executing Frontend Tests (Web Crypto ^& Entropy Engines)...
cd frontend
call npm run test
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend tests failed. Aborting build.
    cd ..
    pause
    exit /b 1
)
echo  -- Frontend unit tests: PASSED.

:: 5. Compile Frontend Production Bundle
echo.
echo [5/5] Compiling Frontend Production Bundle (Vite + TypeScript)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend production build failed.
    cd ..
    pause
    exit /b 1
)
echo  -- Production bundle generated successfully in frontend/dist.
cd ..

echo.
echo =====================================================================
echo   [SUCCESS] DARKVAULT BUILD COMPLETED WITH ZERO ERRORS!
echo =====================================================================
echo.
echo Output artifacts:
echo   - Backend:  backend/ (FastAPI / SQLAlchemy / ReportLab ready)
echo   - Frontend: frontend/dist/ (Optimized production assets)
echo.
echo To run the application:
echo   - For local development: run 'run_dev.bat' or start backend ^& frontend
echo   - For Docker deployment: run 'docker compose up --build'
echo.
pause

