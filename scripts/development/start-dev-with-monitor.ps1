# Start Development Envir# Check current service status
$frontendRunning = Test-Port -Port 3005
$backendRunning = Test-Port -Port 3002

Write-Host "Current Status:" -ForegroundColor Cyan
Write-Host "  Frontend (3005): $(if($frontendRunning) { 'RUNNING' } else { 'STOPPED' })" -ForegroundColor $(if($frontendRunning) { 'Green' } else { 'Red' })
Write-Host "  Backend (3002):  $(if($backendRunning) { 'RUNNING' } else { 'STOPPED' })" -ForegroundColor $(if($backendRunning) { 'Green' } else { 'Red' })with Connection Monitoring
# This script starts the frontend, backend, and connection monitor

param(
    [switch]$QuietMonitor,  # Run monitor in quiet mode
    [switch]$NoMonitor      # Skip the connection monitor
)

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "    WEDDING WEBSITE - DEVELOPMENT STARTUP" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient('localhost', $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check current service status
$frontendRunning = Test-Port -Port 3000
$backendRunning = Test-Port -Port 5000

Write-Host "Current Status:" -ForegroundColor Cyan
Write-Host "  Frontend (3000): $(if($frontendRunning) { 'RUNNING' } else { 'STOPPED' })" -ForegroundColor $(if ($frontendRunning) { 'Green' } else { 'Red' })
Write-Host "  Backend (5000):  $(if($backendRunning) { 'RUNNING' } else { 'STOPPED' })" -ForegroundColor $(if ($backendRunning) { 'Green' } else { 'Red' })
Write-Host ""

# Start services if not running
if (-not $frontendRunning) {
    Write-Host "Starting Frontend (Next.js)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoProfile", "-Command", "cd '$PSScriptRoot'; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 3
} else {
    Write-Host "Frontend already running on port 3005" -ForegroundColor Green
}

if (-not $backendRunning) {
    Write-Host "Starting Backend (Express)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoProfile", "-Command", "cd '$PSScriptRoot\\backend'; npm start" -WindowStyle Minimized
    Start-Sleep -Seconds 3
} else {
    Write-Host "Backend already running on port 3002" -ForegroundColor Green
}

# Wait a moment for services to initialize
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start connection monitor unless disabled
if (-not $NoMonitor) {
    Write-Host ""
    Write-Host "Starting Connection Monitor..." -ForegroundColor Cyan
    
    $monitorArgs = @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", "$PSScriptRoot\\scripts\\connection-monitor.ps1"
    )
    
    if ($QuietMonitor) {
        $monitorArgs += "-Quiet"
    }
    
    $monitorArgs += "-LogToFile"
    
    Start-Process powershell -ArgumentList $monitorArgs -WindowStyle Normal
} else {
    Write-Host "Connection monitor skipped (use -NoMonitor to disable)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "Development environment startup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3005" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3002" -ForegroundColor White
Write-Host "  API Docs: http://localhost:3002/api-docs" -ForegroundColor White
Write-Host "  Health:   http://localhost:3002/api/health" -ForegroundColor White
Write-Host ""
Write-Host "VS Code Tasks available:" -ForegroundColor Cyan
Write-Host "  - Connection Monitor (auto-starts with workspace)" -ForegroundColor White
Write-Host "  - Connection Monitor (Quiet) - minimal output" -ForegroundColor White
Write-Host ""
Write-Host "To stop services, close the PowerShell windows or use Ctrl+C" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
