# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Kanji Filter Validation
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that mode "Kanji Saja" displays vocabulary with `kanji` field containing only hiragana (e.g., "あなた", "これ", "それ")
  - Test that mode "Kanji Saja" displays vocabulary with `kanji` field containing only katakana (e.g., "エンジニア", "ノート", "テレビ")
  - Test that mode "Kanji Saja" correctly displays vocabulary with actual kanji characters (e.g., "私", "会社員")
  - The test assertions should verify that vocabulary WITHOUT actual kanji (hiragana/katakana only) are NOT displayed in "Kanji Saja" mode
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (e.g., "vocabulary with kanji='あなた' is displayed in Kanji mode but should not be")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - All Vocabulary Mode Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for mode "Semua Kosakata"
  - Observe that all vocabulary entries are displayed regardless of kanji/hiragana/katakana content
  - Observe that card display (front/back), navigation buttons, and progress tracking work correctly
  - Write property-based tests capturing observed behavior patterns:
    - For all vocabulary entries, mode "Semua Kosakata" displays them
    - For all card interactions (flip, navigation), behavior remains consistent
    - For all progress tracking actions (Sudah Ingat, Belum Ingat), data is saved correctly
    - For all mode switches, localStorage persistence works correctly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3. Fix for kanji filter bug

  - [x] 3.1 Add hasKanji() helper function to js/utils.js
    - Create function that checks if a string contains at least one actual kanji character
    - Use Unicode range check: U+4E00-U+9FAF (CJK Unified Ideographs) or U+3400-U+4DBF (CJK Extension A)
    - Loop through each character and check if code point is in kanji range
    - Return true if any kanji found, false otherwise
    - Add JSDoc documentation for the function
    - Export the function in the export statement
    - _Bug_Condition: isBugCondition(input) where input.mode === 'kanji' AND input.vocabulary.kanji contains only hiragana/katakana_
    - _Expected_Behavior: hasKanji(text) returns true if text contains at least one kanji character (U+4E00-U+9FAF or U+3400-U+4DBF), false otherwise_
    - _Preservation: No changes to existing utility functions (shuffleArray, calculateQuizResult, getNextIndex, getPrevIndex, searchVocabAndPatterns)_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Update flashcard.js to use hasKanji() filter
    - Import hasKanji from '../utils.js' in the import statement at line 1
    - Update kanjiVocabulary filter at line 51-52 from `v.kanji && v.kanji !== ''` to `v.kanji && hasKanji(v.kanji)`
    - No other changes to renderFlashcard() function
    - Preserve all existing functionality: mode handling, card display, navigation, progress tracking, localStorage persistence
    - _Bug_Condition: Filter uses `v.kanji && v.kanji !== ''` which allows hiragana/katakana to pass_
    - _Expected_Behavior: Filter uses `v.kanji && hasKanji(v.kanji)` which only allows vocabulary with actual kanji characters_
    - _Preservation: All mode "Semua Kosakata" behavior, card display, navigation, progress tracking, and localStorage persistence remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Kanji Filter Validation
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify that vocabulary with only hiragana/katakana in `kanji` field are NOT displayed in "Kanji Saja" mode
    - Verify that vocabulary with actual kanji characters ARE displayed in "Kanji Saja" mode
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - All Vocabulary Mode Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - Verify mode "Semua Kosakata" still displays all vocabulary
    - Verify card display, navigation, and progress tracking still work correctly
    - Verify localStorage persistence still works correctly
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 4. Checkpoint - Ensure all tests pass
  - Run all tests (bug condition + preservation)
  - Verify no regressions in existing functionality
  - Test manually with real chapter data containing mixed vocabulary
  - Verify empty state handling when no kanji vocabulary exists
  - Ask the user if questions arise
