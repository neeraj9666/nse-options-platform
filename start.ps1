# ============================================================================
# START SCRIPT - NSE Options Platform
# ============================================================================

Write-Host "🚀 Starting NSE Options Platform..." -ForegroundColor Cyan

# Kill existing processes
Write-Host "`n🛑 Stopping existing processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM electron.exe /T 2>$null
Start-Sleep -Seconds 2

# Start Server
Write-Host "`n📡 Starting Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

# Wait for server to start
Start-Sleep -Seconds 3

# Start Client
Write-Host "🎨 Starting Client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

# Wait for Vite to start
Start-Sleep -Seconds 5

# Start Electron
Write-Host "⚡ Starting Electron..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run electron"

Write-Host "`n✅ All processes started!" -ForegroundColor Cyan
Write-Host "   Server:   http://localhost:3001" -ForegroundColor Gray
Write-Host "   Client:   http://localhost:5173" -ForegroundColor Gray
Write-Host "   Electron: Desktop app opened" -ForegroundColor Gray
