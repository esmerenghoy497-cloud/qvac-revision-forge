@echo off
title QVAC Revision Forge Quickstart

echo.
echo ==========================================
echo        QVAC Revision Forge
echo        Command-Line Quickstart
echo ==========================================
echo.

echo [1/2] Installing dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting Revision Forge...
echo.
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop the server.
echo.

call npm start