# Robust Connection Monitor Restart Script
# Use this to manually restart Connection Monitor when it stops unexpectedly

param(
    [switch]$Force,     # Force kill all existing monitors
    [switch]$Status     # Just show status, don't restart
)

Write-Host '🔍 Connection Monitor Management' -ForegroundColor Magenta
Write-Host '================================' -ForegroundColor Magenta
Write-Host ''

# Function to check status
function Get-MonitorStatus {
    $jobs = Get-Job -Name '*ConnectionMonitor*' -ErrorAction SilentlyContinue
    $processes = Get-Process pwsh -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like '*connection-monitor*' 
    }
    
    Write-Host '📊 Current Status:' -ForegroundColor Blue
    if ($jobs) {
        Write-Host "   PowerShell Jobs: $($jobs.Count)" -ForegroundColor Green
        $jobs | ForEach-Object { 
            Write-Host "   - $($_.Name): $($_.State)" -ForegroundColor Cyan 
        }
    } else {
        Write-Host '   PowerShell Jobs: None' -ForegroundColor Yellow
    }
    
    if ($processes) {
        Write-Host "   Active Processes: $($processes.Count)" -ForegroundColor Green
    } else {
        Write-Host '   Active Processes: None' -ForegroundColor Yellow
    }
    
    # Check log file
    if (Test-Path 'connection-monitor.log') {
        $lastWrite = (Get-Item 'connection-monitor.log').LastWriteTime
        $timeDiff = (Get-Date) - $lastWrite
        Write-Host "   Last Log Update: $($timeDiff.TotalMinutes.ToString('0.1')) minutes ago" -ForegroundColor Cyan
    } else {
        Write-Host '   Log File: Not found' -ForegroundColor Yellow
    }
}

# Show current status
Get-MonitorStatus

if ($Status) {
    exit 0
}

# Clean up existing monitors if Force is specified or if they're in bad state
if ($Force -or (Get-Job -Name '*ConnectionMonitor*' -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Failed' -or $_.State -eq 'Stopped' })) {
    Write-Host ''
    Write-Host '🧹 Cleaning up existing monitors...' -ForegroundColor Yellow
    
    # Remove jobs
    Get-Job -Name '*ConnectionMonitor*' -ErrorAction SilentlyContinue | Remove-Job -Force
    
    # Kill processes
    Get-Process pwsh -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like '*connection-monitor*' 
    } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Start-Sleep -Seconds 2
    Write-Host '✅ Cleanup complete' -ForegroundColor Green
}

# Start new robust monitor
Write-Host ''
Write-Host '🚀 Starting robust Connection Monitor...' -ForegroundColor Blue

try {
    Start-Job -Name 'ConnectionMonitorRobust' -ScriptBlock {
        Set-Location $using:PWD
        
        # Continuous restart loop with better error handling
        $restartCount = 0
        while ($restartCount -lt 10) {
            # Limit restarts to prevent infinite loops
            try {
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting Connection Monitor (attempt $($restartCount + 1))" -ForegroundColor Cyan
                
                # Run the monitor script
                & 'scripts\monitoring\connection-monitor.ps1' -LogToFile -Quiet
                
                # If we get here, the script ended normally
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Monitor ended normally" -ForegroundColor Yellow
                break
                
            } catch [System.Management.Automation.RuntimeException] {
                # User interrupted or VS Code restart
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Monitor interrupted (user/system)" -ForegroundColor Yellow
                $restartCount++
                if ($restartCount -lt 10) {
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Restarting in 5 seconds..." -ForegroundColor Cyan
                    Start-Sleep -Seconds 5
                }
            } catch {
                # Other errors
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Monitor error: $($_.Exception.Message)" -ForegroundColor Red
                $restartCount++
                if ($restartCount -lt 10) {
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Restarting in 10 seconds..." -ForegroundColor Cyan
                    Start-Sleep -Seconds 10
                }
            }
        }
        
        if ($restartCount -ge 10) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Too many restart attempts, giving up" -ForegroundColor Red
        }
    }
    
    Write-Host '✅ Robust Connection Monitor started!' -ForegroundColor Green
    Write-Host '📊 Will automatically restart if interrupted (up to 10 times)' -ForegroundColor Cyan
    Write-Host ''
    Write-Host '💡 Commands:' -ForegroundColor Magenta
    Write-Host '   Get-Job                                    # Check status'
    Write-Host '   .\restart-connection-monitor.ps1 -Status   # Show detailed status' 
    Write-Host '   .\restart-connection-monitor.ps1 -Force    # Force restart'
    
} catch {
    Write-Host "❌ Failed to start monitor: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host '💡 Try running with -Force parameter' -ForegroundColor Yellow
}
