# Deployment Verification Script
# Minna no Nihongo Chapter 1-10 Enhancement
# Verifies all enhanced data is correctly deployed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Verification Script" -ForegroundColor Cyan
Write-Host "Minna no Nihongo Chapter 1-10 Enhancement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$allPassed = $true

# Test 1: Verify all chapter files exist
Write-Host "Test 1: Verifying chapter files exist..." -ForegroundColor Yellow
$chapters = 1..10
$filesExist = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    if (Test-Path $filePath) {
        Write-Host "  ✅ $chapterFile exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $chapterFile NOT FOUND" -ForegroundColor Red
        $filesExist = $false
        $allPassed = $false
    }
}

Write-Host ""

# Test 2: Verify data completeness (10 conversations, 50 quiz per chapter)
Write-Host "Test 2: Verifying data completeness..." -ForegroundColor Yellow
$dataComplete = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    try {
        $chData = Get-Content $filePath | ConvertFrom-Json
        $convCount = $chData.conversations.Count
        $quizCount = $chData.quiz.Count
        
        if ($convCount -eq 10 -and $quizCount -eq 50) {
            Write-Host "  ✅ Chapter $chapter`: $convCount conversations, $quizCount quiz" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Chapter $chapter`: $convCount conversations, $quizCount quiz (Expected: 10, 50)" -ForegroundColor Red
            $dataComplete = $false
            $allPassed = $false
        }
    } catch {
        Write-Host "  ❌ Chapter $chapter`: Failed to parse JSON - $_" -ForegroundColor Red
        $dataComplete = $false
        $allPassed = $false
    }
}

Write-Host ""

# Test 3: Verify quiz category distribution
Write-Host "Test 3: Verifying quiz category distribution..." -ForegroundColor Yellow
$categoriesValid = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    try {
        $chData = Get-Content $filePath | ConvertFrom-Json
        $categories = $chData.quiz | Group-Object category
        
        $vocab = ($categories | Where-Object { $_.Name -eq "vocabulary" }).Count
        $grammar = ($categories | Where-Object { $_.Name -eq "grammar" }).Count
        $reading = ($categories | Where-Object { $_.Name -eq "reading" }).Count
        $conversation = ($categories | Where-Object { $_.Name -eq "conversation" }).Count
        
        # Check if all categories have at least 10 questions
        if ($vocab -ge 10 -and $grammar -ge 10 -and $reading -ge 10 -and $conversation -ge 10) {
            Write-Host "  ✅ Chapter $chapter`: vocab=$vocab, grammar=$grammar, reading=$reading, conv=$conversation" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Chapter $chapter`: vocab=$vocab, grammar=$grammar, reading=$reading, conv=$conversation (Min: 10 each)" -ForegroundColor Red
            $categoriesValid = $false
            $allPassed = $false
        }
    } catch {
        Write-Host "  ❌ Chapter $chapter`: Failed to analyze categories - $_" -ForegroundColor Red
        $categoriesValid = $false
        $allPassed = $false
    }
}

Write-Host ""

# Test 4: Verify JSON validity
Write-Host "Test 4: Verifying JSON validity..." -ForegroundColor Yellow
$jsonValid = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    try {
        $content = Get-Content $filePath -Raw | ConvertFrom-Json
        Write-Host "  ✅ $chapterFile is valid JSON" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ $chapterFile is INVALID JSON: $_" -ForegroundColor Red
        $jsonValid = $false
        $allPassed = $false
    }
}

Write-Host ""

# Test 5: Verify conversation structure
Write-Host "Test 5: Verifying conversation structure..." -ForegroundColor Yellow
$conversationValid = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    try {
        $chData = Get-Content $filePath | ConvertFrom-Json
        $invalidConv = 0
        
        foreach ($conv in $chData.conversations) {
            # Check required fields
            if (-not $conv.id -or -not $conv.chapterId -or -not $conv.order -or -not $conv.title -or -not $conv.turns) {
                $invalidConv++
            }
            
            # Check turns
            foreach ($turn in $conv.turns) {
                if (-not $turn.speaker -or -not $turn.japanese -or -not $turn.romaji -or -not $turn.indonesian -or -not $turn.hiragana) {
                    $invalidConv++
                }
            }
        }
        
        if ($invalidConv -eq 0) {
            Write-Host "  ✅ Chapter $chapter`: All conversations valid" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Chapter $chapter`: $invalidConv invalid conversations" -ForegroundColor Red
            $conversationValid = $false
            $allPassed = $false
        }
    } catch {
        Write-Host "  ❌ Chapter $chapter`: Failed to validate conversations - $_" -ForegroundColor Red
        $conversationValid = $false
        $allPassed = $false
    }
}

Write-Host ""

# Test 6: Verify quiz structure
Write-Host "Test 6: Verifying quiz structure..." -ForegroundColor Yellow
$quizValid = $true

foreach ($chapter in $chapters) {
    $chapterFile = "ch{0:D2}.json" -f $chapter
    $filePath = "data/$chapterFile"
    
    try {
        $chData = Get-Content $filePath | ConvertFrom-Json
        $invalidQuiz = 0
        
        foreach ($q in $chData.quiz) {
            # Check required fields
            if (-not $q.id -or -not $q.chapterId -or $null -eq $q.order -or -not $q.question -or -not $q.choices -or $null -eq $q.correctIndex -or -not $q.category) {
                $invalidQuiz++
            }
            
            # Check choices count
            if ($q.choices.Count -ne 4) {
                $invalidQuiz++
            }
            
            # Check correctIndex range
            if ($q.correctIndex -lt 0 -or $q.correctIndex -gt 3) {
                $invalidQuiz++
            }
        }
        
        if ($invalidQuiz -eq 0) {
            Write-Host "  ✅ Chapter $chapter`: All quiz questions valid" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Chapter $chapter`: $invalidQuiz invalid quiz questions" -ForegroundColor Red
            $quizValid = $false
            $allPassed = $false
        }
    } catch {
        Write-Host "  ❌ Chapter $chapter`: Failed to validate quiz - $_" -ForegroundColor Red
        $quizValid = $false
        $allPassed = $false
    }
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Timestamp: $timestamp" -ForegroundColor White
Write-Host ""
Write-Host "Test Results:" -ForegroundColor White
Write-Host "  1. Chapter files exist: $(if ($filesExist) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($filesExist) { "Green" } else { "Red" })
Write-Host "  2. Data completeness: $(if ($dataComplete) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($dataComplete) { "Green" } else { "Red" })
Write-Host "  3. Quiz category distribution: $(if ($categoriesValid) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($categoriesValid) { "Green" } else { "Red" })
Write-Host "  4. JSON validity: $(if ($jsonValid) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($jsonValid) { "Green" } else { "Red" })
Write-Host "  5. Conversation structure: $(if ($conversationValid) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($conversationValid) { "Green" } else { "Red" })
Write-Host "  6. Quiz structure: $(if ($quizValid) { "PASSED ✅" } else { "FAILED ❌" })" -ForegroundColor $(if ($quizValid) { "Green" } else { "Red" })
Write-Host ""

if ($allPassed) {
    Write-Host "✅ ALL TESTS PASSED - DEPLOYMENT VERIFIED" -ForegroundColor Green
    Write-Host ""
    Write-Host "The enhanced data for chapters 1-10 is correctly deployed." -ForegroundColor White
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Test the application in a browser" -ForegroundColor White
    Write-Host "  2. Verify furigana toggle functionality" -ForegroundColor White
    Write-Host "  3. Test quiz module with all categories" -ForegroundColor White
    Write-Host "  4. Monitor for any runtime errors" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "❌ SOME TESTS FAILED - DEPLOYMENT VERIFICATION INCOMPLETE" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the errors above and fix any issues." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
