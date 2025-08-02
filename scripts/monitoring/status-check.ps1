# Quick Connection Status Check
# Provides instant status of frontend and backend services

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "    WEDDING WEBSITE - CONNECTION STATUS" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

function Test-ServiceQuick {
    param($Url, $Name, $Timeout = 3)
    
    try {
        $start = Get-Date
        $null = Invoke-WebRequest -Uri $Url -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        $responseTime = ((Get-Date) - $start).TotalMilliseconds
        
        Write-Host "✓ $Name" -ForegroundColor Green -NoNewline
        Write-Host " - OK" -ForegroundColor White -NoNewline
        Write-Host " ($([math]::Round($responseTime, 0))ms)" -ForegroundColor Gray
        
        return $true
    } catch {
        Write-Host "✗ $Name" -ForegroundColor Red -NoNewline
        Write-Host " - FAILED" -ForegroundColor White -NoNewline
        Write-Host " ($($_.Exception.Message.Split('.')[0]))" -ForegroundColor Gray
        
        return $false
    }
}

# Test services
$frontendOk = Test-ServiceQuick -Url "http://localhost:3005" -Name "Frontend (Next.js)"
$backendOk = Test-ServiceQuick -Url "http://localhost:3002/api/health" -Name "Backend API Health"

Write-Host ""

# Overall status
if ($frontendOk -and $backendOk) {
    Write-Host "🎉 All services are healthy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available URLs:" -ForegroundColor Cyan
    Write-Host "  🌐 Website:  http://localhost:3005" -ForegroundColor White
    Write-Host "  🔧 API:      http://localhost:3002" -ForegroundColor White
    Write-Host "  📚 Docs:     http://localhost:3002/api-docs" -ForegroundColor White
    Write-Host "  ❤️  Health:   http://localhost:3002/api/health" -ForegroundColor White
} else {
    Write-Host "⚠️  Some services are not responding" -ForegroundColor Yellow
    Write-Host ""
    if (-not $frontendOk) {
        Write-Host "To start frontend: npm run dev" -ForegroundColor Cyan
    }
    if (-not $backendOk) {
        Write-Host "To start backend:  Set-Location backend && npm start" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "Or use: .\\start-dev-with-monitor.ps1" -ForegroundColor Magenta
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
