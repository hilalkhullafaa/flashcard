# Implementation Plan: Unique Progress and Kanji Synchronization

## Overview

This implementation plan converts the design for unique progress counting and cross-chapter kanji synchronization into discrete coding tasks. The feature enhances the ProgressTracker to count vocabulary and kanji items only once across all chapters, and synchronizes kanji memorization status based on kanji text rather than vocabulary ID.

The implementation will modify the existing `ProgressTracker` class in `js/modules/progress.js` and update the `Flashcard` and `Kotoba` modules to use the new tracking system. The changes maintain backward compatibility with existing user progress data.

## Tasks

- [x] 1. Enhance ProgressTracker with kanji text extraction and lookup
  - [x] 1.1 Add helper method to extract kanji text from vocabulary ID
    - Create `_getVocabById(vocabId)` method that searches all chapter data for a vocabulary item
    - Create `_extractKanjiText(vocab)` method that returns the kanji field or empty string
    - Add validation to ensure kanji text contains actual kanji characters (not just hiragana/katakana)
    - _Requirements: 2.6, 9.2, 9.5_
  
  - [x] 1.2 Modify markKanjiMemorized to use kanji text instead of vocab ID
    - Update `markKanjiMemorized(vocabId)` to extract kanji text using helper methods
    - Add kanji text to `kanjiMemorized` Set instead of vocab ID
    - Handle vocabulary items without kanji gracefully (return early)
    - _Requirements: 2.1, 2.3_
  
  - [x] 1.3 Modify markKanjiForgotten to use kanji text instead of vocab ID
    - Update `markKanjiForgotten(vocabId)` to extract kanji text using helper methods
    - Remove kanji text from `kanjiMemorized` Set instead of vocab ID
    - Handle vocabulary items without kanji gracefully (return early)
    - _Requirements: 2.2_
  
  - [x] 1.4 Modify isKanjiMemorized to check by kanji text instead of vocab ID
    - Update `isKanjiMemorized(vocabId)` to extract kanji text using helper methods
    - Check if kanji text exists in `kanjiMemorized` Set
    - Return false for vocabulary items without kanji
    - _Requirements: 2.3, 2.6_

- [x] 2. Implement unique counting in getStats method
  - [x] 2.1 Add unique vocabulary counting logic
    - Create a Map to track unique vocabulary by `${kanji}|${kana}` combination
    - Iterate through all chapters and vocabulary items
    - Add each vocabulary item to the Map using the combined key
    - Count the Map size as the unique vocabulary total
    - _Requirements: 1.1, 1.3, 1.5_
  
  - [x] 2.2 Add unique kanji counting logic
    - Create a Set to track unique kanji texts
    - Iterate through all chapters and vocabulary items
    - For each vocabulary item with kanji, add the kanji text to the Set
    - Count the Set size as the unique kanji total
    - _Requirements: 1.2, 1.6_
  
  - [x] 2.3 Update cached totals to use unique counts
    - Modify `cachedTotals` to store unique counts instead of sum of all items
    - Update cache invalidation logic (currently not needed since totals don't change)
    - _Requirements: 6.5, 6.6_
  
  - [ ]* 2.4 Write property test for unique vocabulary counting
    - **Property 1: Unique Vocabulary Counting**
    - **Validates: Requirements 1.1, 1.3, 1.5**
    - Generate random chapter data with known duplicate vocabulary items
    - Verify unique count ≤ sum of vocabulary counts across all chapters
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 2.5 Write property test for unique kanji counting
    - **Property 2: Unique Kanji Counting**
    - **Validates: Requirements 1.2, 1.6**
    - Generate random chapter data with duplicate kanji texts
    - Verify unique kanji count ≤ sum of kanji counts across all chapters
    - Use fast-check with minimum 100 iterations

- [x] 3. Add chapter data access to ProgressTracker
  - [x] 3.1 Store reference to all chapters data
    - Add `allChaptersData` property to ProgressTracker constructor
    - Create `setChaptersData(allChaptersData)` method to update the reference
    - Validate that input is an array before storing
    - _Requirements: 9.1_
  
  - [x] 3.2 Call setChaptersData from app initialization
    - In `js/app.js` or `js/data.js`, call `progressTracker.setChaptersData(allChaptersData)` after loading chapter data
    - Ensure this happens before any flashcard or kotoba rendering
    - _Requirements: 9.1_

- [x] 4. Checkpoint - Verify ProgressTracker enhancements
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update Flashcard module integration
  - [x] 5.1 Verify mode-specific memorization calls
    - Confirm "all" mode calls `markVocabMemorized(vocabId)` / `markVocabForgotten(vocabId)`
    - Confirm "kanji" mode calls `markKanjiMemorized(vocabId)` / `markKanjiForgotten(vocabId)`
    - Review existing implementation in `js/modules/flashcard.js` (already correct)
    - _Requirements: 7.3, 7.4, 7.5, 7.6_
  
  - [x] 5.2 Verify mode-specific status checks
    - Confirm "all" mode calls `isVocabMemorized(vocabId)`
    - Confirm "kanji" mode calls `isKanjiMemorized(vocabId)`
    - Review existing implementation in `js/modules/flashcard.js` (already correct)
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 5.3 Write unit tests for flashcard mode-specific behavior
    - Test "all" mode marks vocabulary by ID
    - Test "kanji" mode marks kanji by text
    - Test progress bar updates after memorization changes
    - Test memorization badge display
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7, 7.8_

- [x] 6. Update Kotoba module to display kanji memorization status
  - [x] 6.1 Add memorization badge to vocabulary cards
    - In `js/modules/kotoba.js`, find the vocabulary card rendering function
    - For each vocabulary item with kanji, check `progressTracker.isKanjiMemorized(vocab.id)`
    - If memorized, add a visual badge (e.g., "✓ Ingat") to the card
    - For vocabulary without kanji, optionally check `isVocabMemorized(vocab.id)`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 6.2 Write unit tests for kotoba memorization display
    - Test badge displayed for memorized kanji vocabulary
    - Test no badge for non-memorized kanji vocabulary
    - Test no badge for hiragana-only vocabulary
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 7. Write property tests for cross-chapter synchronization
  - [ ]* 7.1 Write property test for cross-chapter kanji memorization
    - **Property 4: Cross-Chapter Kanji Synchronization (Memorize)**
    - **Validates: Requirements 2.1, 2.3, 2.5**
    - Generate chapters with duplicate kanji texts
    - Mark one vocabulary item as memorized
    - Verify all vocabulary items with same kanji text are marked as memorized
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 7.2 Write property test for cross-chapter kanji forgetting
    - **Property 5: Cross-Chapter Kanji Synchronization (Forget)**
    - **Validates: Requirements 2.2, 2.5**
    - Generate chapters with duplicate kanji texts
    - Mark kanji as memorized, then mark as forgotten
    - Verify all vocabulary items with same kanji text are marked as forgotten
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 7.3 Write property test for kanji lookup consistency
    - **Property 6: Kanji Lookup Consistency**
    - **Validates: Requirements 2.3, 2.5**
    - Generate two vocabulary items with identical kanji text
    - Mark one as memorized
    - Verify `isKanjiMemorized()` returns same status for both vocab IDs
    - Use fast-check with minimum 100 iterations

- [ ] 8. Write property tests for independent tracking systems
  - [ ]* 8.1 Write property test for independent tracking
    - **Property 7: Independent Tracking Systems**
    - **Validates: Requirements 3.1, 3.2, 3.6**
    - Generate a vocabulary item
    - Mark as memorized in vocabulary tracking system
    - Verify kanji tracking system status unchanged
    - Mark as memorized in kanji tracking system
    - Verify vocabulary tracking system status unchanged
    - Use fast-check with minimum 100 iterations

- [ ] 9. Write property tests for data persistence and error handling
  - [ ]* 9.1 Write property test for storage round-trip preservation
    - **Property 8: Storage Round-Trip Preservation**
    - **Validates: Requirements 4.3, 4.4, 5.6**
    - Generate random sets of vocabulary IDs and kanji texts
    - Save to localStorage (mock)
    - Load from localStorage
    - Verify all items preserved without loss or duplication
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 9.2 Write property test for invalid data handling
    - **Property 9: Invalid Data Graceful Handling**
    - **Validates: Requirements 9.1, 9.6**
    - Generate various invalid inputs (non-array, null, undefined, malformed)
    - Call `getStats()` with invalid data
    - Verify returns zero statistics without throwing exceptions
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 9.3 Write property test for kanji text validation
    - **Property 10: Kanji Text Validation**
    - **Validates: Requirements 2.6, 9.2, 9.5**
    - Generate vocabulary items with empty, null, or non-kanji text
    - Mark as memorized
    - Verify tracked independently by vocabulary ID, not by kanji text
    - Use fast-check with minimum 100 iterations

- [ ] 10. Write property tests for UI consistency
  - [ ]* 10.1 Write property test for percentage calculation
    - **Property 3: Percentage Calculation Formula**
    - **Validates: Requirements 1.4, 6.3, 6.4**
    - Generate random memorized and total counts
    - Verify percentage equals `Math.round((memorized / total) * 100)`
    - Verify percentage is 0 when total is 0
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 10.2 Write property test for progress bar update consistency
    - **Property 11: Progress Bar Update Consistency**
    - **Validates: Requirements 7.7**
    - Generate random memorization status changes
    - Verify progress bar reflects updated count and percentage immediately
    - Use fast-check with minimum 100 iterations
  
  - [ ]* 10.3 Write property test for badge display consistency
    - **Property 12: Badge Display Consistency**
    - **Validates: Requirements 7.8, 8.2, 8.4**
    - Generate memorized vocabulary items
    - Verify both Flashcard and Kotoba modules display memorization badge
    - Use fast-check with minimum 100 iterations

- [ ] 11. Write unit tests for ProgressTracker methods
  - [ ]* 11.1 Write unit tests for kanji text extraction
    - Test `_getVocabById()` finds vocabulary item by ID
    - Test `_extractKanjiText()` returns kanji field
    - Test handling of vocabulary without kanji
    - Test handling of hiragana-only vocabulary
    - _Requirements: 2.6, 9.2, 9.5_
  
  - [ ]* 11.2 Write unit tests for unique counting
    - Test unique vocabulary counting with known duplicates
    - Test unique kanji counting with known duplicates
    - Test handling of vocabulary without kanji
    - Test empty chapter data
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_
  
  - [ ]* 11.3 Write unit tests for error handling
    - Test localStorage unavailable (SecurityError)
    - Test localStorage quota exceeded (QuotaExceededError)
    - Test invalid JSON in localStorage
    - Test null/undefined vocabulary items
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_
  
  - [ ]* 11.4 Write unit tests for performance optimizations
    - Test debounced save behavior (100ms)
    - Test cached totals usage
    - Test cache invalidation (if implemented)
    - _Requirements: 4.6, 6.5, 10.1, 10.2, 10.3_

- [x] 12. Final checkpoint - Integration testing and verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility with existing user progress data
- All changes are incremental and build on the existing ProgressTracker implementation
