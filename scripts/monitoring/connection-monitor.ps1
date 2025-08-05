# Development Connection Monitor
# Monitors frontend (Next.js) and backend (Express) connectivity
# Provides real-time status with color-coded output

param(
    [int]$CheckInterval = 15,  # seconds between checks
    [switch]$Quiet,            # minimal output mode
    [switch]$LogToFile         # log to file for debugging
)

# Error handling setup
$ErrorActionPreference = 'SilentlyContinue'
Set-StrictMode -Version Latest

# Configuration
$FrontendUrl = 'http://localhost:3001'  # Next.js dev server port
$BackendHealthUrl = 'http://localhost:3002/api/health'
$BackendBaseUrl = 'http://localhost:3002'
$LogFile = 'connection-monitor.log'
$MaxLogSize = 10MB

# Colors for status display
$Colors = @{
    'Success' = 'Green'
    'Warning' = 'Yellow' 
    'Error'   = 'Red'
    'Info'    = 'Cyan'
    'Header'  = 'Magenta'
}

# Statistics tracking
$Stats = @{
    'StartTime'           = Get-Date
    'FrontendChecks'      = 0
    'BackendChecks'       = 0
    'FrontendFailures'    = 0
    'BackendFailures'     = 0
    'LastFrontendSuccess' = $null
    'LastBackendSuccess'  = $null
}

function Write-ColoredOutput {
    param($Message, $Color = 'White', $NoNewline = $false)
    
    $timestamp = Get-Date -Format 'HH:mm:ss'
    $output = "[$timestamp] $Message"
    
    if ($NoNewline) {
        Write-Host $output -ForegroundColor $Color -NoNewline
    } else {
        Write-Host $output -ForegroundColor $Color
    }
    
    # Log to file if enabled
    if ($LogToFile -and -not $Quiet) {
        try {
            # Rotate log if too large
            if (Test-Path $LogFile) {
                $logItem = Get-Item $LogFile
                if ($logItem.Length -gt $MaxLogSize) {
                    Move-Item $LogFile "$LogFile.old" -Force
                }
            }
            Add-Content -Path $LogFile -Value $output -ErrorAction SilentlyContinue
        } catch {
            # Fail silently on log errors
        }
    }
}

function Test-ServiceHealth {
    param($Url, $ServiceName, $Timeout = 5)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        $responseTime = (Measure-Command { 
                Invoke-WebRequest -Uri $Url -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop 
            }).TotalMilliseconds
        
        return @{
            'Status'       = 'Healthy'
            'StatusCode'   = $response.StatusCode
            'ResponseTime' = [math]::Round($responseTime, 0)
            'Error'        = $null
        }
    } catch {
        return @{
            'Status'       = 'Unhealthy'
            'StatusCode'   = $null
            'ResponseTime' = $null
            'Error'        = $_.Exception.Message
        }
    }
}

function Show-Header {
    Clear-Host
    Write-ColoredOutput '═══════════════════════════════════════════════════════════════' $Colors.Header
    Write-ColoredOutput '    WEDDING WEBSITE - CONNECTION MONITOR' $Colors.Header
    Write-ColoredOutput '═══════════════════════════════════════════════════════════════' $Colors.Header
    Write-ColoredOutput "Frontend: $FrontendUrl" $Colors.Info
    Write-ColoredOutput "Backend:  $BackendHealthUrl" $Colors.Info
    Write-ColoredOutput "Started:  $($Stats.StartTime.ToString('yyyy-MM-dd HH:mm:ss'))" $Colors.Info
    Write-ColoredOutput "Check Interval: $CheckInterval seconds" $Colors.Info
    Write-ColoredOutput '' 
    Write-ColoredOutput 'Press Ctrl+C to stop monitoring...' $Colors.Warning
    Write-ColoredOutput '═══════════════════════════════════════════════════════════════' $Colors.Header
    Write-ColoredOutput ''
}

function Show-StatusLine {
    param($Service, $Result, $ServiceType)
    
    $statusSymbol = if ($Result.Status -eq 'Healthy') { '✓' } else { '✗' }
    $statusColor = if ($Result.Status -eq 'Healthy') { $Colors.Success } else { $Colors.Error }
    
    $timeInfo = if ($Result.ResponseTime) { "$($Result.ResponseTime)ms" } else { 'N/A' }
    
    if ($Result.Status -eq 'Healthy') {
        Write-ColoredOutput "$statusSymbol $Service" $statusColor -NoNewline
        Write-Host ' - ' -NoNewline
        Write-Host 'OK' -ForegroundColor $Colors.Success -NoNewline
        Write-Host " ($timeInfo)" -ForegroundColor $Colors.Info
        
        # Update success timestamps
        if ($ServiceType -eq 'Frontend') { $Stats.LastFrontendSuccess = Get-Date }
        if ($ServiceType -eq 'Backend') { $Stats.LastBackendSuccess = Get-Date }
    } else {
        Write-ColoredOutput "$statusSymbol $Service" $statusColor -NoNewline
        Write-Host ' - ' -NoNewline
        Write-Host 'FAILED' -ForegroundColor $Colors.Error
        
        if ($Result.Error) {
            Write-ColoredOutput "    └─ Error: $($Result.Error)" $Colors.Warning
        }
        
        # Show helpful commands
        if ($ServiceType -eq 'Frontend') {
            Write-ColoredOutput '    └─ Run: npm run dev (in main folder)' $Colors.Info
        } elseif ($ServiceType -eq 'Backend') {
            Write-ColoredOutput '    └─ Run: npm start (in backend folder)' $Colors.Info
        }
    }
}

function Show-Statistics {
    $uptime = (Get-Date) - $Stats.StartTime
    $frontendUptime = if ($Stats.FrontendChecks -gt 0) { 
        [math]::Round((($Stats.FrontendChecks - $Stats.FrontendFailures) / $Stats.FrontendChecks) * 100, 1) 
    } else { 0 }
    $backendUptime = if ($Stats.BackendChecks -gt 0) { 
        [math]::Round((($Stats.BackendChecks - $Stats.BackendFailures) / $Stats.BackendChecks) * 100, 1) 
    } else { 0 }
    
    Write-ColoredOutput ''
    Write-ColoredOutput '─────────────────────────────────────────────────────────────' $Colors.Header
    Write-ColoredOutput "STATISTICS (Runtime: $($uptime.ToString('hh\:mm\:ss')))" $Colors.Header
    Write-ColoredOutput "Frontend Uptime: $frontendUptime% ($($Stats.FrontendChecks - $Stats.FrontendFailures)/$($Stats.FrontendChecks))" $Colors.Info
    Write-ColoredOutput "Backend Uptime:  $backendUptime% ($($Stats.BackendChecks - $Stats.BackendFailures)/$($Stats.BackendChecks))" $Colors.Info
    
    if ($Stats.LastFrontendSuccess) {
        $frontendAge = (Get-Date) - $Stats.LastFrontendSuccess
        Write-ColoredOutput "Last Frontend Success: $($frontendAge.TotalSeconds.ToString('F0'))s ago" $Colors.Info
    }
    
    if ($Stats.LastBackendSuccess) {
        $backendAge = (Get-Date) - $Stats.LastBackendSuccess  
        Write-ColoredOutput "Last Backend Success:  $($backendAge.TotalSeconds.ToString('F0'))s ago" $Colors.Info
    }
}

# Main monitoring loop
try {
    if (-not $Quiet) {
        Show-Header
    }
    
    Write-ColoredOutput 'Starting connection monitoring...' $Colors.Success
    Write-ColoredOutput ''
    
    while ($true) {
        # Test Frontend (Next.js)
        $Stats.FrontendChecks++
        $frontendResult = Test-ServiceHealth -Url $FrontendUrl -ServiceName 'Frontend'
        if ($frontendResult.Status -ne 'Healthy') { $Stats.FrontendFailures++ }
        
        # Test Backend (Express API)
        $Stats.BackendChecks++
        $backendResult = Test-ServiceHealth -Url $BackendHealthUrl -ServiceName 'Backend Health'
        if ($backendResult.Status -ne 'Healthy') { 
            $Stats.BackendFailures++
            # If health endpoint fails, try base URL
            $backendBaseResult = Test-ServiceHealth -Url $BackendBaseUrl -ServiceName 'Backend Base'
            if ($backendBaseResult.Status -eq 'Healthy') {
                Write-ColoredOutput '⚠ Backend base URL responding but health endpoint failed' $Colors.Warning
            }
        }
        
        # Display results
        if (-not $Quiet) {
            Show-StatusLine -Service 'Frontend (Next.js)' -Result $frontendResult -ServiceType 'Frontend'
            Show-StatusLine -Service 'Backend API' -Result $backendResult -ServiceType 'Backend'
            Show-Statistics
            Write-ColoredOutput ''
        } else {
            # Quiet mode - only show failures
            if ($frontendResult.Status -ne 'Healthy') {
                Show-StatusLine -Service 'Frontend (Next.js)' -Result $frontendResult -ServiceType 'Frontend'
            }
            if ($backendResult.Status -ne 'Healthy') {
                Show-StatusLine -Service 'Backend API' -Result $backendResult -ServiceType 'Backend'
            }
        }
        
        # Wait for next check
        Start-Sleep -Seconds $CheckInterval
    }
} catch [System.Management.Automation.RuntimeException] {
    Write-ColoredOutput 'Monitoring stopped by user.' $Colors.Warning
    exit 0  # Normal exit when stopped by user
} catch {
    Write-ColoredOutput "Error in monitoring script: $($_.Exception.Message)" $Colors.Error
    if ($LogToFile) {
        Log-Message "FATAL ERROR: $($_.Exception.Message)"
    }
    Write-ColoredOutput 'Monitoring will restart automatically...' $Colors.Info
    Start-Sleep -Seconds 2  # Brief pause before restart
    exit 0  # Always exit cleanly to allow restart
} finally {
    Write-ColoredOutput ''
    Write-ColoredOutput '═══════════════════════════════════════════════════════════════' $Colors.Header
    Write-ColoredOutput 'Connection monitoring stopped.' $Colors.Info
    Write-ColoredOutput 'Final Statistics:' $Colors.Info
    Show-Statistics
    Write-ColoredOutput '═══════════════════════════════════════════════════════════════' $Colors.Header
}
