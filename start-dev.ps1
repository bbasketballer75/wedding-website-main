# Wedding Website Development Setup

Write-Host "Starting Firebase Emulator and Backend Server for Development..." -ForegroundColor Green

# Check if Firebase CLI is available
try {
    firebase --version | Out-Null
    Write-Host "✓ Firebase CLI found" -ForegroundColor Green
} catch {
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Start Firebase emulator in background
Write-Host "Starting Firebase Emulator..." -ForegroundColor Yellow
Start-Process -WindowStyle Hidden -FilePath "firebase" -ArgumentList "emulators:start", "--only", "firestore"

# Wait for emulator to start
Write-Host "Waiting for emulator to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Set environment variables and start backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location backend
$env:NODE_ENV = "development"
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"
$env:PORT = "3001"

Write-Host ""
Write-Host "Both services should now be running:" -ForegroundColor Green
Write-Host "- Firebase Emulator UI: http://localhost:4000" -ForegroundColor Cyan
Write-Host "- Firestore Emulator: localhost:8080" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

npm start
