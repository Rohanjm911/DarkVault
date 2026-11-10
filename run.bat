@echo off
setlocal enabledelayedexpansion

title DarkVault - Launch Command Center

echo =====================================================================
echo               DARKVAULT - SECURITY COMMAND CENTER
echo                     Launcher (Backend + Frontend)
echo =====================================================================
echo.

echo Starting DarkVault FastAPI Backend on http://localhost:8000 ...
start "DarkVault Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 >nul

echo Starting DarkVault React Frontend on http://localhost:5173 ...
start "DarkVault Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo  DarkVault instances have been launched in separate terminal windows:
echo    - Frontend UI:  http://localhost:5173
echo    - Backend API:  http://localhost:8000/docs
echo =====================================================================
echo.
echo Press any key to exit this launcher window (services keep running)...
pause >nul

