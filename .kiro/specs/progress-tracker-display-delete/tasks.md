# Implementation Plan: Progress Tracker Display & Delete

## Overview

This implementation plan breaks down the Progress Tracker Display & Delete feature into discrete, actionable coding tasks. The feature extends the existing Progress Tracker module to display memorized vocabulary and kanji items with the ability to delete them. The implementation follows a modular architecture with clear separation between data layer (Progress Tracker), UI layer (Progress Display component), and integration layer (routing and home page).

## Tasks

- [x] 1. Enhance Progress Tracker module with new methods
  - [x] 1.1 Implement `getMemorizedVocabList()` method
    - Add method to Progress Tracker class that retrieves all memorized vocabulary IDs from the Set
    - Look up full vocabulary details from `allChaptersData` for each ID
    - Return array of vocabulary items with structure: `{id, kanji, kana, romaji, meaning, chapterId}`
    - Handle missing vocabulary IDs gracefully (skip items not found in chapters data)
    - Sort results by chapter ID for consistent ordering
    - _Requirements: 1.1, 1.2, 7.3_
  
  - [x] 1.2 Implement `getMemorizedKanjiList()` method
    - Add method to Progress Tracker class that retrieves all memorized kanji texts from the Set
    - For each kanji text, find the associated vocabulary item from `allChaptersData`
    - Return array of kanji items with structure: `{kanjiText, vocab: {id, kanji, kana, romaji, meaning}, chapterId}`
    - Handle missing kanji texts gracefully (skip items not found in chapters data)
    - Sort results by chapter ID for consistent ordering
    - _Requirements: 2.1, 2.2, 7.3_
  
  - [x] 1.3 Implement `deleteMemorizedVocab()` method
    - Add method to Progress Tracker class that accepts a vocabulary ID parameter
    - Remove the vocabulary ID from the `vocabMemorized` Set
    - Trigger batched localStorage save (using existing `save()` method)
    - Return `true` if deletion successful, `false` if item not found
    - Handle localStorage errors gracefully (log warning, return false)
    - _Requirements: 3.2, 3.3, 3.5, 7.1_
  
  - [x] 1.4 Implement `deleteMemorizedKanji()` method
    - Add method to Progress Tracker class that accepts a kanji text parameter
    - Remove the kanji text from the `kanjiMemorized` Set
    - Trigger batched localStorage save (using existing `save()` method)
    - Return `true` if deletion successful, `false` if kanji not found
    - Handle localStorage errors gracefully (log warning, return false)
    - _Requirements: 4.2, 4.3, 4.5, 7.2_
  
  - [ ]* 1.5 Write unit tests for new Progress Tracker methods
    - Test `getMemorizedVocabList()` returns empty array when no items memorized
    - Test `getMemorizedVocabList()` returns correct items with full details
    - Test `getMemorizedVocabList()` handles missing vocabulary IDs gracefully
    - Test `getMemorizedKanjiList()` returns empty array when no kanji memorized
    - Test `getMemorizedKanjiList()` returns correct kanji with associated vocabulary
    - Test `getMemorizedKanjiList()` handles missing kanji texts gracefully
    - Test `deleteMemorizedVocab()` successfully removes item and returns true
    - Test `deleteMemorizedVocab()` returns false when item not found
    - Test `deleteMemorizedKanji()` successfully removes kanji and returns true
    - Test `deleteMemorizedKanji()` returns false when kanji not found
    - Test data consistency: deleting vocab doesn't affect kanji status
    - Test data consistency: deleting kanji doesn't affect vocab status
    - _Requirements: 3.2, 4.2, 7.1, 7.2, 7.5_

- [x] 2. Checkpoint - Verify Progress Tracker enhancements
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Create Progress Display UI component
  - [x] 3.1 Create `js/pages/progressDetail.js` file with main render function
    - Create new file `js/pages/progressDetail.js`
    - Implement `renderProgressDetail(container, allChaptersData)` function
    - Set up page structure with header, main content area, and footer
    - Add loading state while fetching data
    - Handle error states (no data, localStorage unavailable)
    - _Requirements: 5.1, 5.2_
  
  - [x] 3.2 Implement vocabulary list rendering
    - Create `renderVocabList(container, vocabList)` function in `progressDetail.js`
    - Call `progressTracker.getMemorizedVocabList()` to get vocabulary items
    - Display each vocabulary item with kanji, kana, romaji, and meaning
    - Show chapter ID badge for each item
    - Display empty state message when no vocabulary memorized
    - Use Tailwind CSS classes matching existing design (slate/indigo theme)
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [x] 3.3 Implement kanji list rendering
    - Create `renderKanjiList(container, kanjiList)` function in `progressDetail.js`
    - Call `progressTracker.getMemorizedKanjiList()` to get kanji items
    - Display each kanji item with kanji text and associated vocabulary details
    - Show chapter ID badge for each item
    - Display empty state message when no kanji memorized
    - Use Tailwind CSS classes matching existing design (slate/indigo theme)
    - _Requirements: 2.1, 2.2, 2.3, 2.5_
  
  - [x] 3.4 Add delete buttons to vocabulary items
    - Add delete button to each vocabulary item in the list
    - Style button with red color to indicate destructive action
    - Include trash icon SVG for visual clarity
    - Ensure button has adequate touch target size (min 44x44px)
    - Add proper ARIA labels for accessibility
    - _Requirements: 3.1, 6.4_
  
  - [x] 3.5 Add delete buttons to kanji items
    - Add delete button to each kanji item in the list
    - Style button with red color to indicate destructive action
    - Include trash icon SVG for visual clarity
    - Ensure button has adequate touch target size (min 44x44px)
    - Add proper ARIA labels for accessibility
    - _Requirements: 4.1, 6.4_
  
  - [x] 3.6 Implement vocabulary delete handler
    - Create `handleVocabDelete(vocabId, itemElement)` function
    - Show loading state on button during deletion (disable button, show spinner)
    - Call `progressTracker.deleteMemorizedVocab(vocabId)`
    - On success: remove item from DOM with fade-out animation, show success feedback
    - On failure: show error message, keep item in display, re-enable button
    - Update statistics display after successful deletion
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.5_
  
  - [x] 3.7 Implement kanji delete handler
    - Create `handleKanjiDelete(kanjiText, itemElement)` function
    - Show loading state on button during deletion (disable button, show spinner)
    - Call `progressTracker.deleteMemorizedKanji(kanjiText)`
    - On success: remove item from DOM with fade-out animation, show success feedback
    - On failure: show error message, keep item in display, re-enable button
    - Update statistics display after successful deletion
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.5_
  
  - [x] 3.8 Add progress statistics display to Progress Detail page
    - Display current vocabulary and kanji statistics at top of page
    - Show memorized count, total count, and percentage for both vocab and kanji
    - Include progress bars matching home page design
    - Update statistics dynamically after deletions
    - _Requirements: 5.4_
  
  - [ ]* 3.9 Write unit tests for Progress Display UI component
    - Test vocabulary list renders all memorized items correctly
    - Test vocabulary list shows empty state when no items
    - Test kanji list renders all memorized items correctly
    - Test kanji list shows empty state when no kanji
    - Test delete button triggers delete operation
    - Test loading state appears during deletion
    - Test item removed from display on successful delete
    - Test error message shown on failed delete
    - Test statistics update after deletion
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.4, 4.1, 4.4, 6.2, 6.3_

- [x] 4. Checkpoint - Verify Progress Display UI component
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Integrate Progress Display with routing and home page
  - [x] 5.1 Add new route to `js/app.js`
    - Import `renderProgressDetail` from `js/pages/progressDetail.js`
    - Add route handler for `#/progress` hash
    - Fetch all chapters data and pass to `renderProgressDetail`
    - Handle navigation to progress detail page
    - _Requirements: 5.1, 5.2_
  
  - [x] 5.2 Add "View Details" button to home page progress section
    - Modify `renderProgressStats()` function in `js/pages/chapterList.js`
    - Add button below progress bars with text "Lihat Detail Progress"
    - Style button with indigo theme matching existing design
    - Add click handler to navigate to `#/progress` route
    - Ensure button is keyboard accessible
    - _Requirements: 5.1_
  
  - [x] 5.3 Add back navigation from Progress Detail to home page
    - Add back button in Progress Detail page header
    - Style button with arrow icon and "Kembali" text
    - Add click handler to navigate to `#/` (home page)
    - Ensure button is keyboard accessible
    - _Requirements: 5.5_
  
  - [ ]* 5.4 Write integration tests for navigation and data flow
    - Test navigation from home page to Progress Display
    - Test navigation from Progress Display back to home page
    - Test delete vocab from display updates localStorage
    - Test delete kanji from display updates localStorage
    - Test statistics on home page reflect changes after deletion
    - Test can re-memorize deleted items in flashcard mode
    - _Requirements: 5.1, 5.5, 7.1, 7.2, 7.3, 7.4_

- [x] 6. Checkpoint - Verify integration and end-to-end flow
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Add error handling and user feedback
  - [x] 7.1 Implement error messages for delete failures
    - Define error message constants in `progressDetail.js`
    - Show error toast/banner when delete operation fails
    - Include retry option in error message
    - Auto-dismiss error message after 5 seconds
    - _Requirements: 6.3_
  
  - [x] 7.2 Implement success feedback for deletions
    - Show visual confirmation (checkmark or toast) on successful delete
    - Use smooth fade-out animation when removing items
    - Provide haptic feedback on mobile devices (if supported)
    - Auto-dismiss success message after 3 seconds
    - _Requirements: 6.2_
  
  - [x] 7.3 Handle localStorage unavailable scenario
    - Check `progressTracker.storageAvailable` flag
    - Display warning banner if localStorage is unavailable
    - Explain that progress won't persist after page reload
    - Continue operation in memory-only mode
    - _Requirements: 5.5, 7.3_
  
  - [x] 7.4 Handle data corruption and missing items
    - Detect when vocabulary ID exists in Set but not in chapters data
    - Log warning to console for debugging
    - Skip rendering missing items
    - Display count mismatch warning if significant (>5% difference)
    - Offer "Reset Progress" option if data appears corrupted
    - _Requirements: 7.3, 7.4_

- [x] 8. Final checkpoint and polish
  - [x] 8.1 Verify mobile responsiveness
    - Test Progress Display UI on mobile viewport sizes
    - Ensure touch targets are adequate (min 44x44px)
    - Verify text is readable on small screens
    - Test delete buttons work correctly on touch devices
    - _Requirements: 5.2_
  
  - [x] 8.2 Verify accessibility
    - Test keyboard navigation through all interactive elements
    - Verify ARIA labels are present on delete buttons
    - Test with screen reader (announce delete confirmations)
    - Ensure sufficient color contrast (WCAG AA)
    - Verify focus indicators are visible
    - _Requirements: 3.1, 4.1, 6.2_
  
  - [x] 8.3 Performance optimization
    - Verify Progress Display loads within 1000ms
    - Verify delete operations complete within 500ms
    - Test with large datasets (>100 items)
    - Optimize rendering if performance issues detected
    - _Requirements: 1.4, 2.4, 3.3, 3.4, 4.3, 4.4, 5.2_
  
  - [x] 8.4 Final integration test
    - Test complete user flow: home → progress display → delete items → back to home
    - Verify statistics update correctly throughout flow
    - Test page reload preserves data correctly
    - Verify can re-memorize deleted items in flashcard mode
    - Test multiple rapid deletions work correctly
    - _Requirements: 5.5, 6.5, 7.1, 7.2, 7.3, 7.4_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- The implementation uses JavaScript with existing Tailwind CSS styling
- All new code should match the existing project structure and conventions
- Error handling is built into each component for robustness
- Accessibility and mobile responsiveness are considered throughout
