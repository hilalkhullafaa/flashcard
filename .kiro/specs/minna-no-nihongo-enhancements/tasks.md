# Implementation Plan: Minna no Nihongo Enhancements

## Overview

This implementation plan breaks down the four major enhancements into discrete coding tasks: flashcard split by kanji presence, materi consolidation, conversation display, and progress tracking. Tasks are ordered to build incrementally, with early validation through code and checkpoints at logical breaks.

## Tasks

- [x] 1. Create Progress Tracking Module
  - [x] 1.1 Implement ProgressTracker class with localStorage persistence
    - Create `js/modules/progress.js` with ProgressTracker class
    - Implement methods: `markVocabMemorized`, `markVocabForgotten`, `markKanjiMemorized`, `markKanjiForgotten`
    - Implement methods: `isVocabMemorized`, `isKanjiMemorized`, `getStats`
    - Implement `load()` and `save()` methods for localStorage persistence
    - Use localStorage keys: `mnn_vocab_progress` and `mnn_kanji_progress`
    - Handle localStorage errors gracefully (quota exceeded, unavailable)
    - Export singleton instance `progressTracker`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.10, 4.11_

  - [ ]* 1.2 Write unit tests for ProgressTracker
    - Test marking vocabulary as memorized/forgotten
    - Test localStorage save and load operations
    - Test corrupted data handling
    - Test statistics calculation across multiple chapters
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.10_

- [x] 2. Enhance Flashcard Module with Kanji Split
  - [x] 2.1 Add mode parameter and vocabulary filtering logic
    - Modify `renderFlashcard` function in `js/modules/flashcard.js` to accept `options.mode` parameter
    - Implement vocabulary filtering: filter by non-empty kanji field for 'kanji' mode
    - Add mode selector UI toggle (All Vocabulary / Kanji Only)
    - Update front side display logic: show only kanji in 'kanji' mode, hide hiragana
    - Maintain back side display: show romaji, meaning, word class for both modes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 2.2 Integrate progress tracking into flashcard module
    - Import `progressTracker` from progress module
    - Call `markVocabMemorized`/`markKanjiMemorized` when user clicks "Sudah Ingat" button
    - Call `markVocabForgotten`/`markKanjiForgotten` when user clicks "Belum Ingat" button
    - Update progress bar display to show memorized count
    - Maintain separate progress tracking for 'all' and 'kanji' modes
    - _Requirements: 1.8, 4.7, 4.11_

  - [x] 2.3 Handle empty kanji vocabulary edge case
    - Check if filtered kanji vocabulary is empty
    - Display empty state message: "Tidak ada kosakata kanji di bab ini"
    - Provide button to switch to "All Vocabulary" mode
    - _Requirements: 1.3, 1.7_

  - [ ]* 2.4 Write unit tests for flashcard filtering
    - Test vocabulary filtering by kanji presence
    - Test empty kanji field handling
    - Test mode switching behavior
    - Test progress tracking integration
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 1.8_

- [ ] 3. Checkpoint - Verify flashcard and progress tracking
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Create Consolidated Materi Module
  - [x] 4.1 Implement materi module with pattern and grammar merging
    - Create `js/modules/materi.js` with `renderMateri` function
    - Accept `container` and `chapterData` parameters
    - Merge `patterns` and `grammar` arrays from chapter data
    - Sort merged array by `order` property
    - Render unified list with consistent styling
    - Add visual badges to distinguish pattern vs grammar entries
    - Display pattern entries: pattern, explanation, examples
    - Display grammar entries: title, explanation, examples
    - Handle missing patterns or grammar arrays gracefully
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 4.2 Write unit tests for materi merging logic
    - Test merging patterns and grammar arrays
    - Test sorting by order property
    - Test handling missing arrays
    - Test entry type identification
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.7_

- [x] 5. Create Conversation Module
  - [x] 5.1 Implement conversation display module
    - Create `js/modules/conversation.js` with `renderConversation` function
    - Accept `container` and `chapterData` parameters
    - Check if `conversations` array exists and is non-empty
    - Display empty state message if no conversations: "Percakapan untuk bab ini belum tersedia"
    - Render conversation turns with speaker identification
    - Display Japanese text, romaji, and Indonesian translation for each turn
    - Apply consistent styling with conversation bubble layout
    - Support optional conversation title display
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 5.2 Write unit tests for conversation rendering
    - Test conversation data parsing
    - Test empty conversation handling
    - Test multi-turn conversation display
    - Test missing title handling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [-] 6. Update Chapter Detail Page
  - [x] 6.1 Integrate new modules into chapter detail tabs
    - Modify `js/pages/chapterDetail.js` to import new modules
    - Add "Percakapan" tab to TABS array with `renderConversation`
    - Update "Materi" tab to use `renderMateri` instead of separate pattern/grammar
    - Pass mode option to flashcard module based on user selection
    - Ensure tab navigation works correctly with new modules
    - _Requirements: 2.1, 3.7_

  - [ ]* 6.2 Write integration tests for chapter detail page
    - Test tab navigation between all tabs
    - Test module rendering for each tab
    - Test state preservation during navigation
    - _Requirements: 2.1, 3.7_

- [ ] 7. Checkpoint - Verify all modules integrated
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Add Progress Display to Navigation
  - [x] 8.1 Enhance chapter list page with overall progress statistics
    - Modify `js/pages/chapterList.js` to import `progressTracker`
    - Fetch all chapter data to calculate total vocabulary and kanji counts
    - Call `progressTracker.getStats(allChaptersData)` to get statistics
    - Render progress statistics UI at top of chapter list
    - Display vocabulary progress: count and percentage with progress bar
    - Display kanji progress: count and percentage with progress bar
    - Update progress display when returning from chapter detail page
    - _Requirements: 4.1, 4.2, 4.6, 4.8, 4.9, 4.11_

  - [ ]* 8.2 Write integration tests for progress display
    - Test progress statistics calculation
    - Test UI update after marking items as memorized
    - Test progress persistence across page navigation
    - _Requirements: 4.6, 4.7, 4.8, 4.11_

- [ ] 9. Add Conversation Data to Chapter JSON Files
  - [ ] 9.1 Create conversation data schema and add to sample chapters
    - Add `conversations` array field to chapter JSON schema
    - Create sample conversation data for ch01.json (はじめまして conversation)
    - Create sample conversation data for ch02.json
    - Create sample conversation data for ch03.json
    - Follow schema: id, chapterId, order, title (optional), turns array
    - Each turn: speaker, japanese, romaji, indonesian
    - Validate JSON structure is correct
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
    
    **Note**: This task requires user input for conversation content from the Minna no Nihongo textbook. The user should provide or validate conversation examples for accuracy.

  - [ ] 9.2 Add conversation data to remaining chapters (ch04-ch25)
    - Add conversation data for chapters 4-10
    - Add conversation data for chapters 11-17
    - Add conversation data for chapters 18-25
    - Ensure consistent schema across all chapters
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
    
    **Note**: This is a data preparation task that will require user input or validation for each chapter's conversation content.

- [x] 10. Error Handling and Edge Cases
  - [x] 10.1 Add comprehensive error handling
    - Add error handling for chapter data loading failures in all modules
    - Add retry button for data loading errors
    - Add validation for conversation data schema
    - Add localStorage error handling (unavailable, quota exceeded)
    - Add fallback to in-memory state when localStorage fails
    - Display warning message when progress cannot be persisted
    - Log errors to console for debugging
    - _Requirements: 5.5_

  - [ ]* 10.2 Write tests for error scenarios
    - Test missing conversation data handling
    - Test localStorage unavailable scenario
    - Test corrupted progress data handling
    - Test empty kanji vocabulary handling
    - _Requirements: 5.5_

- [x] 11. Final Integration and Polish
  - [x] 11.1 Add flashcard mode persistence
    - Persist selected flashcard mode (All/Kanji) per chapter in localStorage
    - Use key format: `mnn_flashcard_mode_ch{chapterId}`
    - Restore mode preference when returning to chapter
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 11.2 Performance optimizations
    - Cache total vocabulary and kanji counts to avoid recalculation
    - Merge patterns and grammar once per chapter load
    - Batch localStorage updates to minimize write operations
    - _Requirements: 4.1, 4.2, 4.11_

  - [x] 11.3 Accessibility improvements
    - Add ARIA labels to flashcard mode toggle
    - Add keyboard navigation support for all interactive elements
    - Add screen reader announcements for progress updates
    - Verify color contrast for all text elements
    - _Requirements: 1.1, 2.8, 3.3, 4.6_

  - [ ]* 11.4 Write end-to-end integration tests
    - Test complete user flow: chapter list → flashcard → mark memorized → return to list
    - Test progress persistence across browser sessions
    - Test all tab navigation flows
    - Test mode switching and state preservation
    - _Requirements: 1.8, 4.7, 4.11_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Task 9 (conversation data) requires user input/validation for textbook content accuracy
- Progress tracking is implemented first to enable integration with flashcard module
- All modules follow existing vanilla JavaScript architecture
- localStorage is used for progress persistence with graceful fallback
