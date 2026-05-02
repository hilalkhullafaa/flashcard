# Deployment Backup Script
# Minna no Nihongo Chapter 1-10 Enhancement
# Creates timestamped backup of all chapter data files

# Create timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups/deployment_$timestamp"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Backup Script" -ForegroundColor Cyan
Write-Host "Minna no Nihongo Chapter 1-10 Enhancement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create backup directory
Write-Host "Creating backup directory: $backupDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

if (Test-Path $backupDir) {
    Write-Host "✅ Backup directory created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create backup directory" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Backup chapter data files
Write-Host "Backing up chapter data files..." -ForegroundColor Yellow

$chapters = 1..10
$successCount = 0
$failCount = 0

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $sourcePath = "data/$chapterFile"
    $destPath = "$backupDir/$chapterFile"
    
    if (Test-Path $sourcePath) {
        try {
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            $fileSize = (Get-Item $sourcePath).Length
            Write-Host "  ✅ $chapterFile ($fileSize bytes)" -ForegroundColor Green
            $successCount++
        } catch {
            Write-Host "  ❌ Failed to backup $chapterFile : $_" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host "  ⚠️  $chapterFile not found" -ForegroundColor Yellow
        $failCount++
    }
}

Write-Host ""

# Backup configuration files
Write-Host "Backing up configuration files..." -ForegroundColor Yellow

$configFiles = @("package.json", "index.html")

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        try {
            Copy-Item -Path $file -Destination "$backupDir/$file" -Force
            $fileSize = (Get-Item $file).Length
            Write-Host "  ✅ $file ($fileSize bytes)" -ForegroundColor Green
            $successCount++
        } catch {
            Write-Host "  ❌ Failed to backup $file : $_" -ForegroundColor Red
            $failCount++
        }
    } else {
        Write-Host "  ⚠️  $file not found" -ForegroundColor Yellow
    }
}

Write-Host ""

# Create backup manifest
Write-Host "Creating backup manifest..." -ForegroundColor Yellow

$manifest = @"
========================================
Deployment Backup Manifest
========================================

Backup Created: $timestamp
Backup Location: $backupDir

Files Backed Up:
----------------

Chapter Data Files (10 files):
"@

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "$backupDir/$chapterFile"
    if (Test-Path $filePath) {
        $fileSize = (Get-Item $filePath).Length
        $manifest += "`n  - $chapterFile ($fileSize bytes)"
    }
}

$manifest += @"


Configuration Files:
"@

foreach ($file in $configFiles) {
    $filePath = "$backupDir/$file"
    if (Test-Path $filePath) {
        $fileSize = (Get-Item $filePath).Length
        $manifest += "`n  - $file ($fileSize bytes)"
    }
}

$manifest += @"


Summary:
--------
Total Files Backed Up: $successCount
Failed Backups: $failCount
Backup Status: $(if ($failCount -eq 0) { "SUCCESS ✅" } else { "PARTIAL ⚠️" })

Backup Verification:
--------------------
1. Verify all chapter files (ch01.json - ch10.json) are present
2. Verify configuration files (package.json, index.html) are present
3. Verify file sizes are reasonable (> 0 bytes)
4. Test JSON validity by opening files

Rollback Procedure:
-------------------
To rollback to this backup, run:

    .\restore-deployment-backup.ps1 -BackupDir "$backupDir"

Or manually copy files from backup directory to original locations.

========================================
End of Backup Manifest
========================================
"@

$manifest | Out-File -FilePath "$backupDir/BACKUP_MANIFEST.txt" -Encoding UTF8

if (Test-Path "$backupDir/BACKUP_MANIFEST.txt") {
    Write-Host "✅ Backup manifest created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create backup manifest" -ForegroundColor Red
}

Write-Host ""

# Verify backup integrity
Write-Host "Verifying backup integrity..." -ForegroundColor Yellow

$verifySuccess = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "$backupDir/$chapterFile"
    
    if (Test-Path $filePath) {
        try {
            # Test JSON validity
            $content = Get-Content $filePath -Raw | ConvertFrom-Json
            Write-Host "  ✅ $chapterFile is valid JSON" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ $chapterFile is invalid JSON: $_" -ForegroundColor Red
            $verifySuccess = $false
        }
    }
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backup Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup Location: $backupDir" -ForegroundColor White
Write-Host "Files Backed Up: $successCount" -ForegroundColor White
Write-Host "Failed Backups: $failCount" -ForegroundColor White
Write-Host "Integrity Check: $(if ($verifySuccess) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($verifySuccess) { "Green" } else { "Red" })
Write-Host ""

if ($failCount -eq 0 -and $verifySuccess) {
    Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Review backup manifest: $backupDir/BACKUP_MANIFEST.txt" -ForegroundColor White
    Write-Host "  2. Proceed with deployment" -ForegroundColor White
    Write-Host "  3. Keep this backup for rollback if needed" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "⚠️  Backup completed with issues" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please review the errors above and:" -ForegroundColor Yellow
    Write-Host "  1. Fix any issues" -ForegroundColor White
    Write-Host "  2. Re-run this backup script" -ForegroundColor White
    Write-Host "  3. Do not proceed with deployment until backup is successful" -ForegroundColor White
    Write-Host ""
    exit 1
}
