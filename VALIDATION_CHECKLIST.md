# Validation Checklist: Unique Progress and Kanji Synchronization

This checklist can be used for manual validation of the implementation in a browser environment.

## Prerequisites
- [ ] Browser with localStorage enabled
- [ ] Application running (open index.html)
- [ ] Browser console open for debugging (F12)

## Test Scenario 1: Unique Progress Counting

### Setup
1. [ ] Clear localStorage: `localStorage.clear()` in console
2. [ ] Reload the page
3. [ ] Navigate to the home page (chapter list)

### Validation Steps
1. [ ] Check overall progress statistics displayed on home page
2. [ ] Note the total vocabulary count
3. [ ] Note the total kanji count
4. [ ] Verify counts are reasonable (should be less than sum of all chapters)

### Expected Results
- [ ] Total vocabulary count shows unique items (not sum of all chapters)
- [ ] Total kanji count shows unique items (not sum of all chapters)
- [ ] Percentages are calculated correctly (0% initially)

## Test Scenario 2: Cross-Chapter Kanji Synchronization

### Setup
1. [ ] Navigate to Chapter 1
2. [ ] Open Flashcard in "Kanji Saja" mode
3. [ ] Find a vocabulary item with kanji that appears in multiple chapters (e.g., "私")

### Validation Steps
1. [ ] Mark the kanji as memorized (click "Sudah Ingat")
2. [ ] Navigate back to chapter list
3. [ ] Navigate to Chapter 3 (or another chapter with the same kanji)
4. [ ] Open Flashcard in "Kanji Saja" mode
5. [ ] Find the same kanji

### Expected Results
- [ ] The same kanji in Chapter 3 shows as memorized (has "✓ Ingat" badge)
- [ ] Progress bar reflects the memorization
- [ ] Overall progress on home page updated

## Test Scenario 3: Kanji Forgetting Synchronization

### Setup
1. [ ] Continue from Test Scenario 2 (kanji marked as memorized)
2. [ ] Stay in Chapter 3 flashcard

### Validation Steps
1. [ ] Mark the kanji as forgotten (click "Belum Ingat")
2. [ ] Navigate back to Chapter 1
3. [ ] Open Flashcard in "Kanji Saja" mode
4. [ ] Find the same kanji

### Expected Results
- [ ] The kanji in Chapter 1 shows as NOT memorized (no badge)
- [ ] Progress bar reflects the change
- [ ] Overall progress on home page updated

## Test Scenario 4: Independent Tracking Systems

### Setup
1. [ ] Navigate to Chapter 1
2. [ ] Open Flashcard in "Semua Kosakata" mode

### Validation Steps
1. [ ] Mark a vocabulary item with kanji as memorized (e.g., "先生")
2. [ ] Switch to "Kanji Saja" mode
3. [ ] Find the same vocabulary item

### Expected Results
- [ ] In "Semua Kosakata" mode: item shows as memorized
- [ ] In "Kanji Saja" mode: item shows as NOT memorized (independent tracking)
- [ ] Switching back to "Semua Kosakata" mode: item still shows as memorized

### Validation Steps (Reverse)
1. [ ] Switch to "Kanji Saja" mode
2. [ ] Mark a different kanji as memorized (e.g., "学生")
3. [ ] Switch to "Semua Kosakata" mode
4. [ ] Find the same vocabulary item

### Expected Results
- [ ] In "Kanji Saja" mode: item shows as memorized
- [ ] In "Semua Kosakata" mode: item shows as NOT memorized (independent tracking)
- [ ] Switching back to "Kanji Saja" mode: item still shows as memorized

## Test Scenario 5: Kotoba Module Badge Display

### Setup
1. [ ] Navigate to Chapter 1
2. [ ] Open Flashcard in "Kanji Saja" mode
3. [ ] Mark a kanji as memorized (e.g., "私")

### Validation Steps
1. [ ] Navigate back to chapter detail page
2. [ ] Scroll to the Kotoba (vocabulary list) section
3. [ ] Find the vocabulary item you marked as memorized

### Expected Results
- [ ] Vocabulary item with memorized kanji shows "✓ Ingat" badge
- [ ] Badge has green background color
- [ ] Badge is positioned in top-right corner of vocabulary card
- [ ] Other vocabulary items without memorized kanji don't show badge

## Test Scenario 6: Hiragana/Katakana Filtering

### Setup
1. [ ] Navigate to a chapter with hiragana-only vocabulary (e.g., "あなた", "これ")
2. [ ] Open Flashcard in "Kanji Saja" mode

### Validation Steps
1. [ ] Check which vocabulary items are displayed
2. [ ] Verify hiragana-only items are NOT shown
3. [ ] Verify katakana-only items are NOT shown
4. [ ] Verify items with actual kanji ARE shown

### Expected Results
- [ ] Hiragana-only vocabulary (e.g., "あなた") is filtered out
- [ ] Katakana-only vocabulary (e.g., "エンジニア") is filtered out
- [ ] Vocabulary with actual kanji (e.g., "私", "先生") is displayed
- [ ] If no kanji vocabulary exists, empty state message is shown

## Test Scenario 7: LocalStorage Persistence

### Setup
1. [ ] Mark several vocabulary items as memorized in "Semua Kosakata" mode
2. [ ] Mark several kanji as memorized in "Kanji Saja" mode
3. [ ] Note the progress statistics

### Validation Steps
1. [ ] Check localStorage in console:
   - `localStorage.getItem('mnn_vocab_progress')`
   - `localStorage.getItem('mnn_kanji_progress')`
2. [ ] Verify data is stored
3. [ ] Reload the page (F5)
4. [ ] Check progress statistics

### Expected Results
- [ ] Vocabulary IDs are stored in `mnn_vocab_progress` as JSON array
- [ ] Kanji texts are stored in `mnn_kanji_progress` as JSON array
- [ ] After reload, all memorization status is preserved
- [ ] Progress statistics match pre-reload values

## Test Scenario 8: Progress Statistics Accuracy

### Setup
1. [ ] Clear localStorage and reload
2. [ ] Navigate to home page

### Validation Steps
1. [ ] Note initial statistics (should be 0/X for both vocab and kanji)
2. [ ] Mark 3 vocabulary items as memorized in "Semua Kosakata" mode
3. [ ] Check home page statistics
4. [ ] Mark 2 kanji as memorized in "Kanji Saja" mode
5. [ ] Check home page statistics

### Expected Results
- [ ] Initial: 0/X vocabulary, 0/Y kanji
- [ ] After marking 3 vocab: 3/X vocabulary (percentage calculated correctly)
- [ ] After marking 2 kanji: 2/Y kanji (percentage calculated correctly)
- [ ] Percentages are rounded to nearest integer
- [ ] Progress bars reflect correct percentages

## Test Scenario 9: Error Handling

### Setup
1. [ ] Open browser console
2. [ ] Disable localStorage (if possible) or simulate quota exceeded

### Validation Steps
1. [ ] Try to mark vocabulary as memorized
2. [ ] Check console for warnings
3. [ ] Verify app continues to function

### Expected Results
- [ ] Warning message displayed in console
- [ ] Optional: User-visible warning banner shown
- [ ] App continues to work with in-memory storage
- [ ] No crashes or exceptions

## Test Scenario 10: Mode Switching

### Setup
1. [ ] Navigate to Chapter 1
2. [ ] Open Flashcard

### Validation Steps
1. [ ] Switch between "Semua Kosakata" and "Kanji Saja" modes
2. [ ] Verify mode selection is saved
3. [ ] Reload the page
4. [ ] Check which mode is active

### Expected Results
- [ ] Mode switches correctly when buttons are clicked
- [ ] Active mode button has different styling (bg-indigo-600)
- [ ] Mode selection persists to localStorage
- [ ] After reload, last selected mode is active

## Test Scenario 11: Empty State Handling

### Setup
1. [ ] Navigate to a chapter with no kanji vocabulary (all hiragana/katakana)
2. [ ] Open Flashcard in "Kanji Saja" mode

### Validation Steps
1. [ ] Check what is displayed
2. [ ] Look for empty state message
3. [ ] Look for "Lihat Semua Kosakata" button

### Expected Results
- [ ] Empty state message: "Tidak ada kosakata kanji di bab ini"
- [ ] "Lihat Semua Kosakata" button is displayed
- [ ] Clicking button switches to "Semua Kosakata" mode
- [ ] After switching, vocabulary is displayed

## Test Scenario 12: Navigation and Card Flip

### Setup
1. [ ] Navigate to Chapter 1
2. [ ] Open Flashcard in any mode

### Validation Steps
1. [ ] Click on card to flip
2. [ ] Verify front and back content
3. [ ] Click "Berikutnya" to go to next card
4. [ ] Click "Sebelumnya" to go to previous card
5. [ ] Click shuffle button

### Expected Results
- [ ] Card flips correctly showing front/back content
- [ ] Front shows kanji (and kana in "Semua Kosakata" mode)
- [ ] Back shows kana, romaji, meaning, word class
- [ ] Navigation buttons work correctly
- [ ] Shuffle randomizes card order
- [ ] Card counter updates correctly (e.g., "1 / 10")

## Summary

After completing all test scenarios:

- [ ] All unique counting features work correctly
- [ ] Cross-chapter synchronization works correctly
- [ ] Independent tracking systems work correctly
- [ ] Kotoba badges display correctly
- [ ] Filtering works correctly
- [ ] Persistence works correctly
- [ ] Error handling works correctly
- [ ] UI/UX is smooth and responsive

## Notes

Use this space to record any issues or observations:

```
[Add notes here]
```

## Sign-off

**Tester Name:** ___________________
**Date:** ___________________
**Status:** [ ] PASSED  [ ] FAILED  [ ] NEEDS REVIEW
**Comments:** ___________________
