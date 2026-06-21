@echo off
REM ──────────────────────────────────────────────────────────────
REM Sasa · launch.bat
REM Windows one-command local launcher.
REM Double-click this file, or run it from cmd / PowerShell.
REM ──────────────────────────────────────────────────────────────

setlocal

echo.
echo Sasa - local launcher
echo.

REM Resolve the script's directory so this works from anywhere
set "SCRIPT_DIR=%~dp0"
set "APP_DIR=%SCRIPT_DIR%app"

if not exist "%APP_DIR%" (
  echo X Could not find app\ folder at: %APP_DIR%
  echo   Make sure this script is inside the sasa\ project root.
  pause
  exit /b 1
)

REM ── Check Node ────────────────────────────────────────────────
where node >nul 2>nul
if errorlevel 1 (
  echo X Node.js is not installed.
  echo   Install it from https://nodejs.org ^(LTS, v20+^)
  echo   Then run this script again.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo   [OK] Node.js %NODE_VER%

REM ── Check pnpm ────────────────────────────────────────────────
where pnpm >nul 2>nul
if errorlevel 1 (
  echo ! pnpm is not installed. Installing now...
  call npm install -g pnpm
  if errorlevel 1 (
    echo X pnpm install failed.
    echo   Try manually: npm install -g pnpm
    pause
    exit /b 1
  )
)
for /f "tokens=*" %%v in ('pnpm -v') do set PNPM_VER=%%v
echo   [OK] pnpm %PNPM_VER%

REM ── Install dependencies if needed ────────────────────────────
cd /d "%APP_DIR%"

if not exist "node_modules\.modules.yaml" (
  echo.
  echo Installing dependencies ^(first-time only, ~30 seconds^)...
  call pnpm install
  if errorlevel 1 (
    echo X Dependency install failed.
    pause
    exit /b 1
  )
  echo.
)

REM ── Start ─────────────────────────────────────────────────────
echo.
echo Starting Sasa...
echo.
echo   -^> Open http://localhost:3000 in your browser
echo.
echo   Press Ctrl+C to stop the server.
echo.

call pnpm dev
