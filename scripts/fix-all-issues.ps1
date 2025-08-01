# Wedding Website - Automated Issue Fixer
# This script automatically detects and fixes common code quality issues

param(
    [switch]$Verbose,
    [switch]$DryRun
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "🔧 AUTOMATED ISSUE FIXER - Wedding Website" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$fixes = @()

# Function to log issues and fixes
function Log-Issue {
    param($Type, $Description, $Action = "")
    $global:issues += @{Type = $Type; Description = $Description; Action = $Action }
    
    if ($Verbose) {
        Write-Host "⚠️  [$Type] $Description" -ForegroundColor Yellow
        if ($Action) {
            Write-Host "   → $Action" -ForegroundColor Gray
        }
    }
}

function Log-Fix {
    param($Description)
    $global:fixes += $Description
    Write-Host "✅ $Description" -ForegroundColor Green
}

# 1. ESLint Issues
Write-Host "🔍 Checking ESLint issues..." -ForegroundColor Blue

try {
    $lintOutput = npm run lint 2>&1
    if ($LASTEXITCODE -ne 0) {
        Log-Issue "ESLint" "Found linting issues" "Running auto-fix"
        
        if (-not $DryRun) {
            npm run lint:fix
            Log-Fix "ESLint auto-fix applied"
        }
    } else {
        Log-Fix "No ESLint issues found"
    }
} catch {
    Log-Issue "ESLint" "Failed to run ESLint check" "Manual intervention needed"
}

# 2. Test Issues
Write-Host "🧪 Running tests..." -ForegroundColor Blue

try {
    $frontendTests = npx vitest run --reporter=basic 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Fix "Frontend tests passing"
    } else {
        Log-Issue "Tests" "Frontend tests failing" "Check test output"
    }
} catch {
    Log-Issue "Tests" "Failed to run frontend tests" "Check test configuration"
}

try {
    $backendTests = Set-Location backend; npm test 2>&1; Set-Location ..
    if ($LASTEXITCODE -eq 0) {
        Log-Fix "Backend tests passing"
    } else {
        Log-Issue "Tests" "Backend tests failing" "Check test output"
    }
} catch {
    Log-Issue "Tests" "Failed to run backend tests" "Check test configuration"
}

# 3. Build Issues
Write-Host "🏗️  Checking build..." -ForegroundColor Blue

try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Fix "Build successful"
    } else {
        Log-Issue "Build" "Build failing" "Check build configuration"
    }
} catch {
    Log-Issue "Build" "Failed to run build" "Check build scripts"
}

# 4. Security Issues
Write-Host "🔒 Checking security..." -ForegroundColor Blue

try {
    $auditOutput = npm audit --audit-level moderate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Fix "No security vulnerabilities found"
    } else {
        Log-Issue "Security" "Security vulnerabilities found" "Run npm audit fix"
        
        if (-not $DryRun) {
            npm audit fix --force
            Log-Fix "Security vulnerabilities fixed"
        }
    }
} catch {
    Log-Issue "Security" "Failed to run security audit" "Check npm configuration"
}

# 5. Accessibility Issues
Write-Host "♿ Checking accessibility..." -ForegroundColor Blue

try {
    if (Test-Path "scripts/accessibility-audit.mjs") {
        $a11yOutput = node scripts/accessibility-audit.mjs 2>&1
        if ($LASTEXITCODE -eq 0) {
            Log-Fix "Accessibility audit passed"
        } else {
            Log-Issue "Accessibility" "Accessibility issues found" "Check audit report"
        }
    } else {
        Log-Issue "Accessibility" "Accessibility audit script not found" "Create audit script"
    }
} catch {
    Log-Issue "Accessibility" "Failed to run accessibility audit" "Check audit configuration"
}

# 6. Code Formatting
Write-Host "💅 Checking code formatting..." -ForegroundColor Blue

try {
    $formatCheck = npm run format:check 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Fix "Code formatting is correct"
    } else {
        Log-Issue "Formatting" "Code formatting issues found" "Running auto-format"
        
        if (-not $DryRun) {
            npm run format
            Log-Fix "Code formatting applied"
        }
    }
} catch {
    Log-Issue "Formatting" "Failed to check code formatting" "Check prettier configuration"
}

# 7. Environment Issues
Write-Host "🌍 Checking environment..." -ForegroundColor Blue

# Check Node.js version
$nodeVersion = node --version
if ($nodeVersion -match "v(\d+)\.") {
    $majorVersion = [int]$matches[1]
    if ($majorVersion -ge 18) {
        Log-Fix "Node.js version $nodeVersion is compatible"
    } else {
        Log-Issue "Environment" "Node.js version $nodeVersion is outdated" "Upgrade to Node.js 18+"
    }
}

# Check for required files
$requiredFiles = @(
    "package.json",
    "next.config.ts",
    "eslint.config.mjs",
    "tsconfig.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Log-Fix "Required file $file exists"
    } else {
        Log-Issue "Environment" "Missing required file: $file" "Create missing file"
    }
}

# Summary
Write-Host ""
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Fixes Applied: $($fixes.Count)" -ForegroundColor Green
foreach ($fix in $fixes) {
    Write-Host "   • $fix" -ForegroundColor Gray
}

Write-Host ""
Write-Host "⚠️  Issues Found: $($issues.Count)" -ForegroundColor Yellow
foreach ($issue in $issues) {
    Write-Host "   • [$($issue.Type)] $($issue.Description)" -ForegroundColor Gray
    if ($issue.Action) {
        Write-Host "     → $($issue.Action)" -ForegroundColor DarkGray
    }
}

# Auto-run recommendations
if ($issues.Count -gt 0) {
    Write-Host ""
    Write-Host "🚀 RECOMMENDATIONS" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "To automatically fix many issues, run:" -ForegroundColor White
    Write-Host "   npm run lint:fix && npm run format" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run this fixer without dry-run mode:" -ForegroundColor White
    Write-Host "   pwsh -ExecutionPolicy Bypass -File scripts/fix-all-issues.ps1" -ForegroundColor Yellow
}

if ($DryRun) {
    Write-Host ""
    Write-Host "🔍 DRY RUN MODE - No changes were made" -ForegroundColor Magenta
}

# Exit with appropriate code
exit $issues.Count
