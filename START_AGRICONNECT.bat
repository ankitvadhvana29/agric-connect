@echo off
title AgriConnect Launcher
echo ========================================================
echo          AgriConnect - Direct Saurashtra Agri
echo ========================================================
echo.

echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js (v18 or higher) from https://nodejs.org
    pause
    exit /b
)
echo Node.js is installed.
echo.

echo [2/3] Checking dependencies...
if not exist node_modules (
    echo Installing frontend dependencies (npm install)...
    call npm install
)

if not exist server\node_modules (
    echo Installing backend dependencies (cd server ^&^& npm install)...
    cd server
    call npm install
    cd ..
)
echo Dependencies ready.
echo.

echo [3/3] Launching Backend Server and Frontend App...
start "AgriConnect Backend (Port 5000)" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
start "AgriConnect Frontend (Port 5173)" cmd /k "npm run dev"

echo.
echo ========================================================
echo   AgriConnect is running!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000
echo ========================================================
echo.
pause
