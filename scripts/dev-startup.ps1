# Wedding Website Development Startup Script
# This script handles all port conflicts and starts servers in the correct order

param(
    [switch]$Force,
    [switch]$Clean,
    [string]$FrontendPort = "3001",
    [string]$BackendPort = "3002"
)

Write-Host "🚀 Starting Wedding Website Development Environment..." -ForegroundColor Green
Write-Host "Frontend Port: $FrontendPort | Backend Port: $BackendPort" -ForegroundColor Cyan

# Function to kill processes on specific ports
function Stop-ProcessOnPort {
    param([string]$Port)
    
    Write-Host "🔍 Checking for processes on port $Port..." -ForegroundColor Yellow
    
    $processes = netstat -ano | Select-String ":$Port\s" | ForEach-Object {
        $fields = $_.ToString().Split(' ', [StringSplitOptions]::RemoveEmptyEntries)
        if ($fields.Length -ge 5) { $fields[4] }
    } | Where-Object { $_ -ne "0" } | Sort-Object -Unique
    
    if ($processes) {
        foreach ($processId in $processes) {
            try {
                Write-Host "⚡ Stopping process $processId on port $Port..." -ForegroundColor Red
                taskkill /f /pid $processId 2>$null
            } catch {
                Write-Host "⚠️  Could not stop process $processId" -ForegroundColor Yellow
            }
        }
        Start-Sleep -Seconds 2
    } else {
        Write-Host "✅ Port $Port is available" -ForegroundColor Green
    }
}

# Function to update CORS configuration
function Update-CorsConfiguration {
    param([string]$FrontendPort, [string]$BackendPort)
    
    Write-Host "🔧 Updating CORS configuration..." -ForegroundColor Cyan
    
    $portsFile = "config\ports.js"
    if (Test-Path $portsFile) {
        $content = Get-Content $portsFile -Raw
        
        # Update frontend port in CORS origins if it's not already there
        if ($content -notmatch "localhost:$FrontendPort") {
            $newOrigin = "  ``http://`${HOSTS.LOCAL}:$FrontendPort``, // Current dev server port"
            $content = $content -replace "(// Current dev server port.*\n|// Fallback for default Next\.js port.*\n)", "$&$newOrigin`n"
            
            # Remove duplicate entries
            $lines = $content -split "`n"
            $uniqueLines = @()
            $seenOrigins = @()
            
            foreach ($line in $lines) {
                if ($line -match "localhost:(\d+)") {
                    $port = $Matches[1]
                    if ($port -notin $seenOrigins) {
                        $seenOrigins += $port
                        $uniqueLines += $line
                    }
                } else {
                    $uniqueLines += $line
                }
            }
            
            $content = $uniqueLines -join "`n"
            Set-Content -Path $portsFile -Value $content -Encoding UTF8
            Write-Host "✅ CORS configuration updated with port $FrontendPort" -ForegroundColor Green
        }
    }
}

# Clean up old processes if requested
if ($Clean -or $Force) {
    Write-Host "🧹 Cleaning up old processes..." -ForegroundColor Yellow
    Stop-ProcessOnPort $FrontendPort
    Stop-ProcessOnPort $BackendPort
    
    # Kill any remaining Node.js processes
    if ($Force) {
        Write-Host "💥 Force killing all Node.js processes..." -ForegroundColor Red
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Sleep -Seconds 3
    }
}

# Check and free up ports
Stop-ProcessOnPort $FrontendPort
Stop-ProcessOnPort $BackendPort

# Update CORS configuration
Update-CorsConfiguration -FrontendPort $FrontendPort -BackendPort $BackendPort

# Verify environment
Write-Host "🔍 Verifying environment..." -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Are you in the project root?" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend\package.json")) {
    Write-Host "❌ Backend package.json not found" -ForegroundColor Red
    exit 1
}

# Start backend server
Write-Host "🚀 Starting backend server on port $BackendPort..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    param($BackendPort)
    Set-Location "backend"
    $env:PORT = $BackendPort
    npm start
} -ArgumentList $BackendPort

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if backend started successfully
$backendRunning = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendRunning = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $backendRunning) {
    Write-Host "❌ Backend failed to start. Check the logs." -ForegroundColor Red
    Stop-Job $backendJob -PassThru | Remove-Job
    exit 1
}

Write-Host "✅ Backend server running on http://localhost:$BackendPort" -ForegroundColor Green

# Start frontend server
Write-Host "🚀 Starting frontend server on port $FrontendPort..." -ForegroundColor Green
$env:PORT = $FrontendPort
$frontendJob = Start-Job -ScriptBlock {
    param($FrontendPort)
    $env:PORT = $FrontendPort
    npm run dev
} -ArgumentList $FrontendPort

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if frontend started successfully
$frontendRunning = $false
for ($i = 0; $i -lt 15; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -Method GET -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $frontendRunning = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 3
    }
}

if ($frontendRunning) {
    Write-Host "✅ Frontend server running on http://localhost:$FrontendPort" -ForegroundColor Green
    Write-Host "" 
    Write-Host "🎉 Development environment ready!" -ForegroundColor Green -BackgroundColor DarkGreen
    Write-Host "   Frontend: http://localhost:$FrontendPort" -ForegroundColor Cyan
    Write-Host "   Backend:  http://localhost:$BackendPort" -ForegroundColor Cyan
    Write-Host "   Press Ctrl+C to stop all servers" -ForegroundColor Yellow
    Write-Host ""
    
    # Keep script running and monitor jobs
    try {
        while ($true) {
            if ((Get-Job -Id $backendJob.Id).State -eq "Failed") {
                Write-Host "❌ Backend server crashed!" -ForegroundColor Red
                break
            }
            if ((Get-Job -Id $frontendJob.Id).State -eq "Failed") {
                Write-Host "❌ Frontend server crashed!" -ForegroundColor Red
                break
            }
            Start-Sleep -Seconds 5
        }
    } catch {
        Write-Host "🛑 Shutting down servers..." -ForegroundColor Yellow
    } finally {
        Stop-Job $backendJob, $frontendJob -PassThru | Remove-Job
        Stop-ProcessOnPort $FrontendPort
        Stop-ProcessOnPort $BackendPort
    }
} else {
    Write-Host "❌ Frontend failed to start. Check the logs." -ForegroundColor Red
    Stop-Job $backendJob, $frontendJob -PassThru | Remove-Job
    exit 1
}
