# ==========================================
# NSE Options Platform - Shutdown Script
# ==========================================

Clear-Host
Write-Host ""
Write-Host "🛑 Stopping NSE Options Platform..." -ForegroundColor Red
Write-Host ""

# Kill processes on specific ports
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    Write-Host "Stopping $Name (Port $Port)..." -ForegroundColor Yellow
    
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                 Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($processes) {
        foreach ($pid in $processes) {
            try {
                $processName = (Get-Process -Id $pid).ProcessName
                Stop-Process -Id $pid -Force
                Write-Host "  ✅ Stopped $processName (PID: $pid)" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Could not stop PID: $pid" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "  ℹ️  No process found on port $Port" -ForegroundColor Gray
    }
}

# Stop client (Vite)
Stop-ProcessOnPort 5173 "Client (Vite)"

# Stop server (Electron/Node)
Stop-ProcessOnPort 3000 "Server"

# Also kill any remaining node/electron processes
Write-Host ""
Write-Host "Cleaning up remaining processes..." -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Where-Object { $_.Path -like "*options-platform2*" } | ForEach-Object {
        Stop-Process -Id $_.Id -Force
        Write-Host "  ✅ Stopped Node.js (PID: $($_.Id))" -ForegroundColor Green
    }
}

$electronProcesses = Get-Process -Name "electron" -ErrorAction SilentlyContinue
if ($electronProcesses) {
    $electronProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force
        Write-Host "  ✅ Stopped Electron (PID: $($_.Id))" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ All processes stopped successfully!" -ForegroundColor Green
Write-Host ""
