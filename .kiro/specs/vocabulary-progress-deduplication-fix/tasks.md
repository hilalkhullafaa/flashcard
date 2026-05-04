# Implementation Plan

## Phase 1: Exploratory Bug Condition Testing (BEFORE Fix)

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Duplicate Vocabulary and Kanji Counting
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Test concrete failing cases with duplicate vocabulary/kanji across chapters
  - Test implementation details from Bug Condition in design:
    - Test duplicate vocabulary count: vocabulary with same kanji+kana in multiple chapters should count as 1 in total
    - Test duplicate kanji count: kanji appearing in multiple vocabulary items should count as 1 in total
    - Test unsynchronized status: marking vocabulary in one chapter should mark all instances with same kanji+kana
    - Test status removal synchronization: unmarking vocabulary in one chapter should unmark all instances
  - The test assertions should match the Expected Behavior Properties from design
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause:
    - Example: "私" (わたし) appears in ch01 and ch03, total count = 2 instead of 1
    - Example: Marking "私" in ch01 doesn't mark it in ch03
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

## Phase 2: Preservation Property Testing (BEFORE Fix)

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Duplicate Behavior and Data Format
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy operations:
    - Progress per bab calculation (should count all items without deduplication)
    - localStorage format (should be array of strings)
    - Data validation and cleaning (should handle invalid/corrupted data)
    - Debounced save behavior (should batch updates with 100ms delay)
    - Storage warning display (should show warning when localStorage unavailable)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Test progress per bab: for any chapter, progress should count all vocabulary items in that chapter
    - Test localStorage format: saved data should always be array of strings
    - Test data validation: invalid data should be cleaned/reset on load
    - Test debounced save: multiple rapid saves should be batched
    - Test storage warning: unavailable storage should trigger warning
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

## Phase 3: Implementation

- [x] 3. Fix for vocabulary progress deduplication

  - [x] 3.1 Add helper function for unique identifier generation
    - Create `_getVocabUniqueKey(vocab)` function that returns `${vocab.kanji}|${vocab.kana}`
    - This function will be used for deduplication and status synchronization
    - Add unit tests for edge cases: empty kanji, empty kana, special characters
    - _Bug_Condition: isBugCondition(input) where vocabulary with same kanji+kana exists in multiple chapters_
    - _Expected_Behavior: Unique key generation enables deduplication and synchronization_
    - _Preservation: No impact on existing functionality_
    - _Requirements: 2.1, 2.3_

  - [x] 3.2 Modify getStats() for deduplicated total count
    - Use `Map` to track unique vocabulary by unique key (kanji+kana)
    - Use `Set` to track unique kanji by kanji text
    - Update `cachedTotals` with deduplicated results
    - Ensure per-chapter progress calculation remains unchanged (no deduplication)
    - Add unit tests with mock data containing duplicates
    - _Bug_Condition: isBugCondition(input) where duplicate vocabulary/kanji exists across chapters_
    - _Expected_Behavior: Total count reflects unique vocabulary/kanji only_
    - _Preservation: Per-chapter progress calculation unchanged, cache mechanism unchanged_
    - _Requirements: 2.1, 2.2, 3.3_

  - [x] 3.3 Modify markVocabMemorized() for status synchronization
    - Find all vocabulary items with same unique key across all chapters
    - Add all matching vocabulary IDs to `vocabMemorized` Set
    - Ensure save() is called to persist changes
    - Add unit tests for synchronization across multiple chapters
    - _Bug_Condition: isBugCondition(input) where vocabulary with same kanji+kana exists in multiple chapters_
    - _Expected_Behavior: Marking vocabulary in one chapter marks all instances with same kanji+kana_
    - _Preservation: localStorage format unchanged, save mechanism unchanged_
    - _Requirements: 2.3, 2.4, 2.5_

  - [x] 3.4 Modify markVocabForgotten() for status removal synchronization
    - Find all vocabulary items with same unique key across all chapters
    - Remove all matching vocabulary IDs from `vocabMemorized` Set
    - Ensure save() is called to persist changes
    - Add unit tests for removal synchronization across multiple chapters
    - _Bug_Condition: isBugCondition(input) where vocabulary with same kanji+kana exists in multiple chapters_
    - _Expected_Behavior: Unmarking vocabulary in one chapter unmarks all instances with same kanji+kana_
    - _Preservation: localStorage format unchanged, save mechanism unchanged_
    - _Requirements: 2.6_

  - [x] 3.5 Modify isVocabMemorized() for unique key-based checking
    - Look up vocabulary item by vocabId
    - Generate unique key from vocabulary item
    - Check if any vocabulary ID with same unique key exists in `vocabMemorized`
    - Return true if any match found
    - Add unit tests for cross-chapter status checking
    - _Bug_Condition: isBugCondition(input) where vocabulary with same kanji+kana exists in multiple chapters_
    - _Expected_Behavior: Status check returns true if any instance with same kanji+kana is marked_
    - _Preservation: Existing status check behavior for unique vocabulary unchanged_
    - _Requirements: 2.5_

  - [x] 3.6 Implement backward compatibility migration
    - In load() method, detect if data needs migration
    - For each vocabulary ID in `vocabMemorized`, find all vocabulary with same unique key
    - Add all matching vocabulary IDs to `vocabMemorized`
    - Save migrated data automatically
    - Log migration for debugging
    - Add unit tests for migration scenarios: old format data, mixed format data, already migrated data
    - _Bug_Condition: N/A (migration handles existing data)_
    - _Expected_Behavior: Old data automatically migrated to new format without user intervention_
    - _Preservation: localStorage format unchanged, existing data remains valid_
    - _Requirements: 3.2_

  - [x] 3.7 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Deduplicated Counting and Synchronized Status
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms bug is fixed)
    - Verify counterexamples from step 1 are resolved:
      - Duplicate vocabulary/kanji now counted as 1
      - Status synchronized across chapters
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.8 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Duplicate Behavior and Data Format
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all preservation behaviors still work:
      - Progress per bab calculation unchanged
      - localStorage format unchanged
      - Data validation unchanged
      - Debounced save unchanged
      - Storage warning unchanged
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

## Phase 4: Additional Testing

- [x] 4. Integration and edge case testing

  - [x] 4.1 Test full migration flow
    - Create test with old format localStorage data
    - Load data and verify automatic migration
    - Mark/unmark vocabulary and verify synchronization
    - Save and reload, verify persistence
    - _Requirements: 3.2_

  - [x] 4.2 Test edge cases
    - Vocabulary without kanji (empty kanji field)
    - Vocabulary with same kanji but different kana
    - Vocabulary with same kana but different kanji
    - Vocabulary with special characters in kanji/kana
    - Empty vocabulary list
    - Single chapter with no duplicates
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.3 Test UI synchronization
    - Verify checkbox status updates across chapter pages
    - Verify progress statistics update correctly
    - Verify memorized vocabulary list displays correctly
    - Test marking/unmarking from different chapter pages
    - _Requirements: 2.5_

  - [x] 4.4 Test performance
    - Verify deduplication doesn't slow down getStats() significantly
    - Verify synchronization doesn't slow down mark/unmark operations
    - Test with large dataset (all 25 chapters)
    - Verify debounced save still works efficiently
    - _Requirements: 3.7_

- [x] 5. Checkpoint - Ensure all tests pass
  - Run full test suite: `npm test`
  - Verify all bug condition tests pass (Property 1)
  - Verify all preservation tests pass (Property 2)
  - Verify all integration tests pass
  - Verify all edge case tests pass
  - Review test coverage and add missing tests if needed
  - Ask user if questions arise or if manual testing is needed

## Phase 5: Manual Testing and Validation

- [x] 6. Manual testing checklist
  - [x] 6.1 Test duplicate vocabulary counting
    - Open progress page, verify total vocabulary count is accurate (deduplicated)
    - Compare with manual count of unique vocabulary across all chapters
    - Verify percentage calculation is correct
  
  - [x] 6.2 Test duplicate kanji counting
    - Open progress page, verify total kanji count is accurate (deduplicated)
    - Compare with manual count of unique kanji across all chapters
    - Verify percentage calculation is correct
  
  - [x] 6.3 Test status synchronization
    - Mark vocabulary in chapter 1
    - Navigate to another chapter with same vocabulary
    - Verify checkbox is checked
    - Unmark vocabulary in second chapter
    - Navigate back to chapter 1
    - Verify checkbox is unchecked
  
  - [x] 6.4 Test backward compatibility
    - Clear localStorage
    - Add old format data manually (single vocabulary ID per item)
    - Reload page
    - Verify automatic migration works
    - Verify status synchronization works after migration
  
  - [x] 6.5 Test localStorage persistence
    - Mark several vocabulary items across different chapters
    - Close and reopen browser
    - Verify all marked items are still marked
    - Verify synchronization still works
  
  - [x] 6.6 Test edge cases in UI
    - Test vocabulary without kanji
    - Test vocabulary with same kanji but different readings
    - Test marking/unmarking rapidly
    - Test with localStorage disabled (incognito mode)
    - Verify appropriate warnings are shown

## Notes

- **Test Execution Order**: Tasks must be executed in order (1 → 2 → 3 → 4 → 5 → 6)
- **Property-Based Testing**: Tasks 1 and 2 use property-based testing for comprehensive coverage
- **Test Reuse**: Tasks 3.7 and 3.8 reuse tests from tasks 1 and 2 (do NOT write new tests)
- **Migration**: Task 3.6 handles backward compatibility automatically, no user action required
- **Performance**: Deduplication uses efficient data structures (Map, Set) to minimize performance impact
- **UI Testing**: Task 6 requires manual testing in browser to verify UI behavior
