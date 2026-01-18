# ==========================================
# NSE OPTIONS PLATFORM - PRODUCTION STARTUP
# ==========================================
# Complete rewrite with robust error handling
# Author: Auto-generated for options-platform2
# Date: 2026-01-19

#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ==========================================
# CONFIGURATION
# ==========================================

$Config = @{
    ProjectRoot = "D:\options-platform2"
    PostgreSQL  = @{
        Path            = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
        ServiceName     = "postgresql-x64-15"
        DefaultDatabase = "options_platform"
        DefaultUser     = "postgres"
    }
    Ports       = @{
        Vite = 5173
    }
    Timeout     = @{
        ServiceStart  = 30
        ViteStart     = 30
        ElectronStart = 10
    }
}

# ==========================================
# HELPER FUNCTIONS
# ==========================================

function Write-Status {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [ValidateSet('Info', 'Success', 'Warning', 'Error', 'Header')]
        [string]$Type = 'Info'
    )
    
    $colors = @{
        'Info'    = 'Cyan'
        'Success' = 'Green'
        'Warning' = 'Yellow'
        'Error'   = 'Red'
        'Header'  = 'Magenta'
    }
    
    $icons = @{
        'Info'    = '[i]'
        'Success' = '[OK]'
        'Warning' = '[!]'
        'Error'   = '[X]'
        'Header'  = '[>]'
    }
    
    Write-Host "  $($icons[$Type]) " -NoNewline -ForegroundColor $colors[$Type]
    Write-Host $Message -ForegroundColor $colors[$Type]
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor White
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Test-PortInUse {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        return $null -ne $connection
    }
    catch {
        return $false
    }
}

function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connections) {
            $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($pid in $pids) {
                Write-Status "Killing process $pid on port $Port" Warning
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
            return $true
        }
        return $false
    }
    catch {
        Write-Status "Failed to stop process on port ${Port}: $_" Error
        return $false
    }
}

function Read-EnvFile {
    param([string]$Path)
    
    $envVars = @{}
    
    if (-not (Test-Path $Path)) {
        Write-Status ".env file not found at: $Path" Warning
        return $envVars
    }
    
    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        
        # Skip comments and empty lines
        if ($line -and -not $line.StartsWith('#')) {
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                
                # Remove quotes if present
                if ($value -match '^"(.*)"$') {
                    $value = $matches[1]
                }
                elseif ($value -match "^'(.*)'$") {
                    $value = $matches[1]
                }
                
                $envVars[$key] = $value
            }
        }
    }
    
    return $envVars
}

function Test-PostgreSQLConnection {
    param(
        [string]$PSQLPath,
        [string]$Database,
        [string]$User,
        [string]$Password
    )
    
    # Set password in environment
    $env:PGPASSWORD = $Password
    
    try {
        # Test basic connection
        $result = & $PSQLPath -U $User -d $Database -t -c "SELECT 1;" 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            $errorMsg = "Connection test failed: $result"
            throw $errorMsg
        }
        
        # Test table existence
        $tableCheck = & $PSQLPath -U $User -d $Database -t -c "SELECT COUNT(*) FROM options_data_ht LIMIT 1;" 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            $errorMsg = "Table options_data_ht not found or inaccessible"
            throw $errorMsg
        }
        
        $rowCount = $tableCheck.Trim()
        
        return @{
            Success  = $true
            Message  = "Connected successfully"
            RowCount = $rowCount
        }
    }
    catch {
        return @{
            Success  = $false
            Message  = $_.Exception.Message
            RowCount = 0
        }
    }
    finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

function Start-ServiceAndWait {
    param(
        [string]$Title,
        [string]$Location,
        [string]$WindowTitle,
        [string]$Command,
        [string]$LogFile,
        [int]$Port,
        [int]$TimeoutSeconds
    )
    
    Write-Status "Starting $Title..." Info
    Write-Host "    Location: $Location" -ForegroundColor Gray
    Write-Host "    Port: $Port" -ForegroundColor Gray
    Write-Host "    Log: $LogFile" -ForegroundColor Gray
    Write-Host ""
    
    # Build script block
    $scriptBlock = @"
Set-Variable -Name 'host.ui.RawUI.WindowTitle' -Value '$WindowTitle'
Set-Location '$Location'
Write-Host '=======================================================' -ForegroundColor Cyan
Write-Host '  $WindowTitle' -ForegroundColor Cyan
Write-Host '=======================================================' -ForegroundColor Cyan
Write-Host ''
$Command 2>&1 | Tee-Object -FilePath '$LogFile'
"@
    
    # Start process
    Start-Process powershell -ArgumentList '-NoExit', '-Command', $scriptBlock -WindowStyle Normal
    
    # Wait for service to start
    Write-Host "    Waiting for service to start" -NoNewline
    
    $started = $false
    $waited = 0
    
    while (-not $started -and $waited -lt $TimeoutSeconds) {
        Start-Sleep -Seconds 1
        $waited++
        Write-Host "." -NoNewline
        
        if (Test-PortInUse $Port) {
            $started = $true
            Write-Host ""
            Write-Status "$Title started successfully (${waited}s)" Success
        }
    }
    
    if (-not $started) {
        Write-Host ""
        Write-Status "$Title failed to start within ${TimeoutSeconds}s" Error
        Write-Status "Check log: $LogFile" Warning
        throw "$Title startup timeout"
    }
    
    Write-Host ""
    return $true
}

# ==========================================
# MAIN SCRIPT
# ==========================================

Clear-Host

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "                                                       " -ForegroundColor Cyan
Write-Host "       NSE OPTIONS TRADING PLATFORM - STARTUP         " -ForegroundColor White
Write-Host "                                                       " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Version: 1.0.0" -ForegroundColor Gray
Write-Host "  Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

try {
    # ==========================================
    # PHASE 1: ENVIRONMENT VALIDATION
    # ==========================================
    
    Write-Section "PHASE 1: Environment Validation"
    
    # Check project directories
    Write-Status "Checking project structure..." Info
    
    $requiredDirs = @(
        "$($Config.ProjectRoot)\client",
        "$($Config.ProjectRoot)\server"
    )
    
    foreach ($dir in $requiredDirs) {
        if (Test-Path $dir) {
            Write-Status "Found: $(Split-Path $dir -Leaf)" Success
        }
        else {
            Write-Status "Missing: $dir" Error
            throw "Required directory not found: $dir"
        }
    }
    
    # Check .env file
    $envPath = "$($Config.ProjectRoot)\.env"
    if (Test-Path $envPath) {
        Write-Status "Found: .env file" Success
    }
    else {
        Write-Status "Missing: .env file" Error
        throw ".env file not found at: $envPath"
    }
    
    Write-Host ""
    
    # Load environment variables
    Write-Status "Loading configuration from .env..." Info
    
    $envVars = Read-EnvFile $envPath
    
    if ($envVars.Count -eq 0) {
        throw ".env file is empty or invalid"
    }
    
    $dbConfig = @{
        Host     = if ($envVars['PGHOST']) { $envVars['PGHOST'] } else { 'localhost' }
        Port     = if ($envVars['PGPORT']) { $envVars['PGPORT'] } else { '5432' }
        Database = if ($envVars['PGDATABASE']) { $envVars['PGDATABASE'] } else { $Config.PostgreSQL.DefaultDatabase }
        User     = if ($envVars['PGUSER']) { $envVars['PGUSER'] } else { $Config.PostgreSQL.DefaultUser }
        Password = $envVars['PGPASSWORD']
    }
    
    Write-Status "Database: $($dbConfig.Database)" Info
    Write-Status "User: $($dbConfig.User)" Info
    Write-Host ""
    
    # ==========================================
    # PHASE 2: POSTGRESQL VALIDATION
    # ==========================================
    
    Write-Section "PHASE 2: PostgreSQL Validation"
    
    # Check PostgreSQL installation
    Write-Status "Checking PostgreSQL installation..." Info
    
    if (-not (Test-Path $Config.PostgreSQL.Path)) {
        throw "PostgreSQL not found at: $($Config.PostgreSQL.Path)"
    }
    
    $pgVersion = & $Config.PostgreSQL.Path --version
    Write-Status "Version: $pgVersion" Success
    Write-Host ""
    
    # Check PostgreSQL service
    Write-Status "Checking PostgreSQL service..." Info
    
    $service = Get-Service -Name $Config.PostgreSQL.ServiceName -ErrorAction SilentlyContinue
    
    if (-not $service) {
        throw "PostgreSQL service not found: $($Config.PostgreSQL.ServiceName)"
    }
    
    if ($service.Status -ne 'Running') {
        Write-Status "Service is stopped. Attempting to start..." Warning
        Start-Service -Name $Config.PostgreSQL.ServiceName
        Start-Sleep -Seconds 3
        
        $service = Get-Service -Name $Config.PostgreSQL.ServiceName
        if ($service.Status -ne 'Running') {
            throw "Failed to start PostgreSQL service"
        }
    }
    
    Write-Status "Service status: $($service.Status)" Success
    Write-Host ""
    
    # Test database connection
    Write-Status "Testing database connection..." Info
    
    if (-not $dbConfig.Password) {
        throw "PGPASSWORD not set in .env file"
    }
    
    $connTest = Test-PostgreSQLConnection `
        -PSQLPath $Config.PostgreSQL.Path `
        -Database $dbConfig.Database `
        -User $dbConfig.User `
        -Password $dbConfig.Password
    
    if (-not $connTest.Success) {
        throw "Database connection failed: $($connTest.Message)"
    }
    
    Write-Status $connTest.Message Success
    Write-Status "Data verification: options_data_ht table accessible" Success
    Write-Host ""
    
    # ==========================================
    # PHASE 3: PORT MANAGEMENT
    # ==========================================
    
    Write-Section "PHASE 3: Port Management"
    
    Write-Status "Checking port $($Config.Ports.Vite) (Vite)..." Info
    
    if (Test-PortInUse $Config.Ports.Vite) {
        Write-Status "Port $($Config.Ports.Vite) is in use" Warning
        
        if (Stop-ProcessOnPort $Config.Ports.Vite) {
            Write-Status "Port $($Config.Ports.Vite) freed successfully" Success
        }
        else {
            throw "Failed to free port $($Config.Ports.Vite)"
        }
    }
    else {
        Write-Status "Port $($Config.Ports.Vite) is available" Success
    }
    
    Write-Host ""
    
    # ==========================================
    # PHASE 4: SERVICE STARTUP
    # ==========================================
    
    Write-Section "PHASE 4: Service Startup"
    
    # Create logs directory
    $logDir = "$($Config.ProjectRoot)\logs"
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd"
    
    # Export environment variables for child processes
    foreach ($key in $envVars.Keys) {
        [Environment]::SetEnvironmentVariable($key, $envVars[$key], 'Process')
    }
    
    # Start Client (Vite)
    $clientStarted = Start-ServiceAndWait `
        -Title "Frontend (Vite)" `
        -Location "$($Config.ProjectRoot)\client" `
        -WindowTitle "CLIENT - Vite Dev Server" `
        -Command "npm run dev" `
        -LogFile "$logDir\client-$timestamp.log" `
        -Port $Config.Ports.Vite `
        -TimeoutSeconds $Config.Timeout.ViteStart
    
    # Start Server (Electron)
    Write-Status "Starting Backend (Electron)..." Info
    Write-Host "    Location: $($Config.ProjectRoot)\server" -ForegroundColor Gray
    Write-Host "    Waits for: http://localhost:$($Config.Ports.Vite)" -ForegroundColor Gray
    Write-Host "    Log: $logDir\server-$timestamp.log" -ForegroundColor Gray
    Write-Host ""
    
    $serverScript = @"
Set-Location '$($Config.ProjectRoot)\server'
Write-Host '=======================================================' -ForegroundColor Cyan
Write-Host '  SERVER - Electron Main Process' -ForegroundColor Cyan
Write-Host '=======================================================' -ForegroundColor Cyan
Write-Host ''
npm run dev 2>&1 | Tee-Object -FilePath '$logDir\server-$timestamp.log'
"@
    
    Start-Process powershell -ArgumentList '-NoExit', '-Command', $serverScript -WindowStyle Normal
    
    Write-Status "Electron will open automatically..." Info
    Start-Sleep -Seconds $Config.Timeout.ElectronStart
    
    Write-Host ""
    
    # ==========================================
    # STARTUP COMPLETE
    # ==========================================
    
    Write-Section "STARTUP COMPLETE"
    
    Write-Host ""
    Write-Host "  [OK] " -NoNewline -ForegroundColor Green
    Write-Host "All services started successfully!" -ForegroundColor White
    Write-Host ""
    Write-Host "  Frontend:    " -NoNewline -ForegroundColor Cyan
    Write-Host "http://localhost:$($Config.Ports.Vite)" -ForegroundColor White
    Write-Host "  Electron:    " -NoNewline -ForegroundColor Cyan
    Write-Host "Opening automatically" -ForegroundColor White
    Write-Host ""
    Write-Host "  Logs Directory: " -NoNewline -ForegroundColor Yellow
    Write-Host "$logDir" -ForegroundColor Gray
    Write-Host "     - client-$timestamp.log" -ForegroundColor Gray
    Write-Host "     - server-$timestamp.log" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  [!] " -NoNewline -ForegroundColor Yellow
    Write-Host "Press Ctrl+C in terminal windows to stop services" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Red
    Write-Host "  STARTUP FAILED" -ForegroundColor Red
    Write-Host "=======================================================" -ForegroundColor Red
    Write-Host ""
    Write-Status "Error: $($_.Exception.Message)" Error
    Write-Host ""
    Write-Host "  Troubleshooting:" -ForegroundColor Yellow
    Write-Host "    1. Check .env file configuration" -ForegroundColor Gray
    Write-Host "    2. Verify PostgreSQL service is running" -ForegroundColor Gray
    Write-Host "    3. Check log files in: $($Config.ProjectRoot)\logs" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
finally {
    Write-Host "  Press any key to close this window..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
