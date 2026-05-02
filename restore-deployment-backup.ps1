# Deployment Rollback Script
# Minna no Nihongo Chapter 1-10 Enhancement
# Restores files from a timestamped backup

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupDir
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Rollback Script" -ForegroundColor Cyan
Write-Host "Minna no Nihongo Chapter 1-10 Enhancement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify backup directory exists
if (-not (Test-Path $BackupDir)) {
    Write-Host "❌ Backup directory not found: $BackupDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available backups:" -ForegroundColor Yellow
    if (Test-Path "backups") {
        Get-ChildItem "backups" -Directory | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor White
        }
    } else {
        Write-Host "  No backups found" -ForegroundColor White
    }
    Write-Host ""
    exit 1
}

Write-Host "Backup Directory: $BackupDir" -ForegroundColor White
Write-Host ""

# Verify backup manifest exists
$manifestPath = "$BackupDir/BACKUP_MANIFEST.txt"
if (Test-Path $manifestPath) {
    Write-Host "Backup Manifest Found:" -ForegroundColor Green
    Write-Host ""
    Get-Content $manifestPath | Select-Object -First 20
    Write-Host ""
} else {
    Write-Host "⚠️  Backup manifest not found" -ForegroundColor Yellow
    Write-Host ""
}

# Confirm rollback
Write-Host "⚠️  WARNING: This will overwrite current files with backup files" -ForegroundColor Yellow
Write-Host ""
$confirmation = Read-Host "Are you sure you want to proceed with rollback? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host ""
    Write-Host "Rollback cancelled by user" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "Starting rollback..." -ForegroundColor Yellow
Write-Host ""

# Restore chapter data files
Write-Host "Restoring chapter data files..." -ForegroundColor Yellow

$chapters = 1..10
$successCount = 0
$failCount = 0

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $sourcePath = "$BackupDir/$chapterFile"
    $destPath = "data/$chapterFile"
    
    if (Test-Path $sourcePath) {
        try {
            # Create backup of current file before overwriting
            if (Test-Path $destPath) {
                $currentBackup = "$destPath.pre-rollback"
                Copy-Item -Path $destPath -Destination $currentBackup -Force
            }
            
            # Restore from backup
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            
            # Verify restoration
            if (Test-Path $destPath) {
                $fileSize = (Get-Item $destPath).Length
                Write-Host "  ✅ $chapterFile restored ($fileSize bytes)" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "  ❌ Failed to restore $chapterFile" -ForegroundColor Red
                $failCount++
            }
        } catch {
            Write-Host "  ❌ Error restoring $chapterFile : $_" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host "  ⚠️  $chapterFile not found in backup" -ForegroundColor Yellow
        $failCount++
    }
}

Write-Host ""

# Restore configuration files
Write-Host "Restoring configuration files..." -ForegroundColor Yellow

$configFiles = @("package.json", "index.html")

foreach ($file in $configFiles) {
    $sourcePath = "$BackupDir/$file"
    
    if (Test-Path $sourcePath) {
        try {
            # Create backup of current file before overwriting
            if (Test-Path $file) {
                $currentBackup = "$file.pre-rollback"
                Copy-Item -Path $file -Destination $currentBackup -Force
            }
            
            # Restore from backup
            Copy-Item -Path $sourcePath -Destination $file -Force
            
            # Verify restoration
            if (Test-Path $file) {
                $fileSize = (Get-Item $file).Length
                Write-Host "  ✅ $file restored ($fileSize bytes)" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "  ❌ Failed to restore $file" -ForegroundColor Red
                $failCount++
            }
        } catch {
            Write-Host "  ❌ Error restoring $file : $_" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host "  ⚠️  $file not found in backup" -ForegroundColor Yellow
    }
}

Write-Host ""

# Verify restored files
Write-Host "Verifying restored files..." -ForegroundColor Yellow

$verifySuccess = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    if (Test-Path $filePath) {
        try {
            # Test JSON validity
            $content = Get-Content $filePath -Raw | ConvertFrom-Json
            Write-Host "  ✅ $chapterFile is valid JSON" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ $chapterFile is invalid JSON: $_" -ForegroundColor Red
            $verifySuccess = $false
        }
    } else {
        Write-Host "  ❌ $chapterFile not found after restoration" -ForegroundColor Red
        $verifySuccess = $false
    }
}

Write-Host ""

# Create rollback report
$rollbackReport = @"
========================================
Deployment Rollback Report
========================================

Rollback Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Backup Source: $BackupDir

Files Restored:
---------------
Chapter Data Files: $($chapters.Count) files
Configuration Files: $($configFiles.Count) files

Summary:
--------
Successfully Restored: $successCount
Failed Restorations: $failCount
Verification: $(if ($verifySuccess) { "PASSED ✅" } else { "FAILED ❌" })

Rollback Status: $(if ($failCount -eq 0 -and $verifySuccess) { "SUCCESS ✅" } else { "PARTIAL ⚠️" })

Pre-Rollback Backups:
---------------------
Current files were backed up with .pre-rollback extension before restoration.
These can be used to re-deploy if needed.

Next Steps:
-----------
1. Clear browser caches
2. Hard refresh application (Ctrl+F5)
3. Verify application functionality
4. Notify users of rollback
5. Investigate and fix deployment issues
6. Plan re-deployment when ready

========================================
End of Rollback Report
========================================
"@

$reportPath = "ROLLBACK_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
$rollbackReport | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "Rollback report created: $reportPath" -ForegroundColor White
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rollback Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup Source: $BackupDir" -ForegroundColor White
Write-Host "Files Restored: $successCount" -ForegroundColor White
Write-Host "Failed Restorations: $failCount" -ForegroundColor White
Write-Host "Verification: $(if ($verifySuccess) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($verifySuccess) { "Green" } else { "Red" })
Write-Host ""

if ($failCount -eq 0 -and $verifySuccess) {
    Write-Host "✅ Rollback completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Clear browser caches" -ForegroundColor White
    Write-Host "  2. Hard refresh application (Ctrl+F5)" -ForegroundColor White
    Write-Host "  3. Verify application functionality" -ForegroundColor White
    Write-Host "  4. Review rollback report: $reportPath" -ForegroundColor White
    Write-Host "  5. Investigate deployment issues" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "⚠️  Rollback completed with issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please review the errors above and:" -ForegroundColor Yellow
    Write-Host "  1. Check file integrity" -ForegroundColor White
    Write-Host "  2. Manually verify critical files" -ForegroundColor White
    Write-Host "  3. Review rollback report: $reportPath" -ForegroundColor White
    Write-Host "  4. Contact technical support if needed" -ForegroundColor White
    Write-Host ""
    exit 1
}
