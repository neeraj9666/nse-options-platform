# D:\options-platform2\restart-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESTARTING NSE OPTIONS PLATFORM      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill all Node processes
Write-Host "[1/5] Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Clean server dist
Write-Host "[2/5] Cleaning server build..." -ForegroundColor Yellow
cd D:\options-platform2\server
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Rebuild server
Write-Host "[3/5] Rebuilding server..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Server built successfully" -ForegroundColor Green
Write-Host ""

# Start CLIENT FIRST
Write-Host "[4/5] Starting client (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$host.ui.RawUI.WindowTitle = 'CLIENT - Vite Dev Server'
cd D:\options-platform2\client
Write-Host '🌐 Starting Vite...' -ForegroundColor Cyan
npm run dev
"@ -WindowStyle Normal

# Wait for client
Write-Host "Waiting for Vite to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Start SERVER/ELECTRON
Write-Host "[5/5] Starting Electron..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$host.ui.RawUI.WindowTitle = 'SERVER - Electron Main Process'
cd D:\options-platform2\server
Write-Host '🚀 Starting Electron...' -ForegroundColor Cyan
npm run dev
"@ -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "         APPLICATION STARTED            " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Client (Vite):  http://localhost:5173" -ForegroundColor White
Write-Host "✅ Electron:       Opening automatically" -ForegroundColor White
Write-Host ""
Write-Host "Check the 'SERVER' window for database logs" -ForegroundColor Cyan
Write-Host ""
