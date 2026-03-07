@echo off
REM Arbeey's Creative Door - Windows Launcher
REM Double-click this file to start the app

cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Then try again.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Then try again.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start the server
echo Starting Arbeey's Creative Door...
echo The app will open in your browser shortly.

REM Open browser after a delay
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

REM Start Next.js dev server
call npm run dev
