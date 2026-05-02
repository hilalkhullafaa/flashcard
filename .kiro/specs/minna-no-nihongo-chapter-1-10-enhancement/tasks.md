# Implementation Plan: Minna no Nihongo Chapter 1-10 Enhancement

## Overview

This implementation plan converts the feature design into actionable coding tasks for enhancing the Minna no Nihongo flashcard application for chapters 1-10. The enhancement focuses on three main areas:

1. **Data Preparation**: Creating 10 conversations and 50 quiz questions per chapter (chapters 1-10)
2. **Furigana System Enhancement**: Ensuring furigana toggle works correctly with new conversation data
3. **Quiz System Enhancement**: Implementing progressive learning and proper category distribution

All tasks build incrementally, with each step validating core functionality through code. The implementation uses JavaScript/TypeScript and leverages existing utilities (kanjiParser, vocabularyMatcher, displayMode).

**Key Constraints**:
- NEVER modify vocabulary datasets
- All content must align with Minna no Nihongo 1 textbook
- Scope limited to chapters 1-10 only
- Full automation without manual intervention

## Tasks

### Phase 1: Data Preparation for Chapters 1-10

- [x] 1. Create conversation data for Chapter 1
  - Create 10 conversation entries in data/ch01.json following the existing structure
  - Each conversation must have: id, chapterId, order, title, turns array
  - Each turn must have: speaker, japanese, romaji, indonesian, hiragana fields
  - Align conversations with Minna no Nihongo 1 Chapter 1 textbook dialogues
  - Use ONLY vocabulary from Chapter 1 vocabulary dataset
  - Ensure hiragana field matches japanese field exactly for furigana matching
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 1.6_

- [x]* 1.1 Write property test for conversation data completeness
  - **Property 4: Conversation Data Completeness**
  - **Validates: Requirements 2.4, 2.5**
  - Test that all conversation turns have required fields (speaker, japanese, romaji, indonesian, hiragana)
  - Test that all fields are non-empty strings
  - _Requirements: 2.4, 2.5_

- [x]* 1.2 Write property test for vocabulary consistency
  - **Property 1: Vocabulary Consistency in Furigana**
  - **Validates: Requirements 1.6, 1.7, 3.8**
  - Test that kanji in conversations match vocabulary dataset readings
  - _Requirements: 1.6, 1.7_

- [x] 2. Create quiz data for Chapter 1
  - Create exactly 50 quiz questions in data/ch01.json
  - Distribute questions: 15 vocabulary, 15 grammar, 10 reading, 10 conversation
  - Each question must have: id, chapterId, order, question, choices (4), correctIndex (0-3), category
  - Use ONLY vocabulary and grammar from Chapter 1
  - Include furigana in vocabulary and conversation questions using ruby tags
  - _Requirements: 3.1, 3.2, 3.5, 9.1-9.4_

- [x]* 2.1 Write property test for quiz question structure
  - **Property 9: Quiz Question Structure Validity**
  - **Validates: Requirements 3.9**
  - Test that all quiz questions have exactly 4 choices
  - Test that correctIndex is between 0-3
  - Test that category is valid (vocabulary, grammar, reading, conversation)
  - _Requirements: 3.9_

- [x]* 2.2 Write property test for quiz category distribution
  - **Property 10: Quiz Category Distribution**
  - **Validates: Requirements 3.5, 9.1-9.10**
  - Test that all four categories are represented
  - Test that each category has at least 10 questions
  - _Requirements: 3.5, 9.1-9.4_

- [x] 3. Create conversation data for Chapter 2
  - Create 10 conversation entries in data/ch02.json
  - Follow same structure and validation as Chapter 1
  - Use vocabulary from Chapters 1-2
  - Align with Minna no Nihongo 1 Chapter 2 textbook dialogues
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Create quiz data for Chapter 2 with progressive learning
  - Create exactly 50 quiz questions in data/ch02.json
  - Distribute questions: 15 vocabulary, 15 grammar, 10 reading, 10 conversation
  - Include material from Chapters 1-2 (70% Chapter 2, 30% Chapter 1)
  - Ensure at least one question references Chapter 1 material
  - _Requirements: 3.1, 3.3, 3.4, 10.1, 10.2_

- [x]* 4.1 Write property test for progressive learning coverage
  - **Property 7: Progressive Learning Coverage**
  - **Validates: Requirements 3.3, 3.4, 10.1-10.10**
  - Test that Chapter 2 quiz includes material from Chapters 1-2
  - Test that at least one question references previous chapter material
  - _Requirements: 3.3, 3.4, 10.2_

- [x] 5. Create conversation and quiz data for Chapter 3
  - Create 10 conversations in data/ch03.json using vocabulary from Chapters 1-3
  - Create 50 quiz questions with progressive learning (60% Ch3, 30% Ch2, 10% Ch1)
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.3_

- [x] 6. Create conversation and quiz data for Chapter 4
  - Create 10 conversations in data/ch04.json using vocabulary from Chapters 1-4
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.4_

- [x] 7. Create conversation and quiz data for Chapter 5
  - Create 10 conversations in data/ch05.json using vocabulary from Chapters 1-5
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.5_

- [x] 8. Checkpoint - Validate Chapters 1-5 data integrity
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create conversation and quiz data for Chapter 6
  - Create 10 conversations in data/ch06.json using vocabulary from Chapters 1-6
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.6_

- [x] 10. Create conversation and quiz data for Chapter 7
  - Create 10 conversations in data/ch07.json using vocabulary from Chapters 1-7
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.7_

- [x] 11. Create conversation and quiz data for Chapter 8
  - Create 10 conversations in data/ch08.json using vocabulary from Chapters 1-8
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.8_

- [x] 12. Create conversation and quiz data for Chapter 9
  - Create 10 conversations in data/ch09.json using vocabulary from Chapters 1-9
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.9_

- [x] 13. Create conversation and quiz data for Chapter 10
  - Create 10 conversations in data/ch10.json using vocabulary from Chapters 1-10
  - Create 50 quiz questions with progressive learning distribution
  - Follow same structure and validation as previous chapters
  - _Requirements: 2.1, 3.1, 10.10_

- [x] 14. Checkpoint - Validate all Chapters 1-10 data integrity
  - Ensure all tests pass, ask the user if questions arise.

### Phase 2: Furigana System Enhancement

- [x] 15. Test existing furigana utilities with new conversation data
  - [x] 15.1 Test kanjiParser.js with Chapter 1-10 conversation data
    - Verify kanji parsing works correctly for all conversation turns
    - Identify any edge cases or parsing failures
    - Log warnings for any kanji sequences not found in vocabulary
    - _Requirements: 1.8, 8.1, 8.2_

  - [x]* 15.2 Write unit tests for kanji parser edge cases
    - Test empty strings, special characters, mixed scripts
    - Test hiragana-only text, katakana-only text, punctuation
    - Test long kanji sequences, compound words
    - _Requirements: 8.3, 8.8_

- [x] 16. Test vocabularyMatcher.js with new conversation data
  - [x] 16.1 Test vocabulary matching for all chapters
    - Verify kanji-to-hiragana matching accuracy
    - Identify any vocabulary mismatches or missing entries
    - Test matching performance (should complete within 100ms per turn)
    - _Requirements: 1.7, 8.4, 8.5, 8.9_

  - [x]* 16.2 Write property test for vocabulary dataset immutability
    - **Property 2: Vocabulary Dataset Immutability**
    - **Validates: Requirements 1.9, 2.7, 3.10, 7.1-7.10**
    - Test that vocabulary dataset remains unchanged after furigana generation
    - Test that vocabulary dataset remains unchanged after conversation validation
    - _Requirements: 1.9, 7.1-7.10_

- [x] 17. Enhance error handling for unknown kanji sequences
  - [x] 17.1 Implement warning logging for unknown kanji
    - When kanji sequence not found in vocabulary, log detailed warning
    - Include kanji sequence, chapter number, and conversation ID in warning
    - Display kanji without furigana in UI
    - _Requirements: 1.8, 8.7_

  - [x]* 17.2 Write property test for unknown kanji handling
    - **Property 11: Unknown Kanji Handling**
    - **Validates: Requirements 1.8**
    - Test that unknown kanji displays without furigana
    - Test that warning message is logged
    - _Requirements: 1.8_

- [x] 18. Test display mode toggle with new conversation data
  - [x] 18.1 Test kanji-only display mode
    - Verify conversations display kanji without ruby tags in default mode
    - Test that non-kanji text displays as-is
    - _Requirements: 1.1, 1.2_

  - [x]* 18.2 Write property test for kanji display mode
    - **Property 5: Kanji Display Mode Behavior**
    - **Validates: Requirements 1.2**
    - Test that kanji text renders without ruby tags in kanji mode
    - _Requirements: 1.2_

  - [x] 18.3 Test furigana display mode
    - Verify conversations display ruby tags with hiragana readings when toggled
    - Test that non-kanji text has no furigana
    - Verify display mode toggle completes within 200ms
    - _Requirements: 1.4, 1.5, 1.10_

  - [x]* 18.4 Write property test for furigana display mode
    - **Property 6: Furigana Display Mode Behavior**
    - **Validates: Requirements 1.4**
    - Test that kanji text renders with ruby tags in hiragana mode
    - _Requirements: 1.4_

  - [x]* 18.5 Write property test for non-kanji text
    - **Property 3: Non-Kanji Text Has No Furigana**
    - **Validates: Requirements 1.3, 1.5**
    - Test that hiragana/katakana-only text has no ruby tags
    - Test in both kanji and hiragana display modes
    - _Requirements: 1.3, 1.5_

- [x] 19. Optimize furigana generation performance
  - [x] 19.1 Profile furigana generation for all chapters
    - Measure time to generate furigana for each conversation turn
    - Identify any performance bottlenecks
    - Ensure generation completes within 100ms per turn
    - _Requirements: 8.9, 12.3_

  - [x] 19.2 Implement vocabulary mapping cache
    - Cache kanji-to-hiragana mappings to avoid repeated parsing
    - Optimize DOM updates to minimize reflows and repaints
    - _Requirements: 12.6, 12.7_

- [x] 20. Checkpoint - Verify furigana system performance
  - Ensure all tests pass, ask the user if questions arise.

### Phase 3: Quiz System Enhancement

- [x] 21. Validate quiz data structure for all chapters
  - [x] 21.1 Create validation utility for quiz data
    - Validate all required fields present (id, chapterId, order, question, choices, correctIndex, category)
    - Validate choices array has exactly 4 elements
    - Validate correctIndex is 0-3
    - Validate category is one of: vocabulary, grammar, reading, conversation
    - _Requirements: 3.9, 6.4, 13.8, 13.9_

  - [x]* 21.2 Write unit tests for quiz validation
    - Test validation with valid quiz data
    - Test validation with missing fields
    - Test validation with invalid field types
    - Test validation with out-of-range correctIndex
    - _Requirements: 13.2, 13.3, 13.4_

- [x] 22. Verify category distribution for all chapters
  - [x] 22.1 Create category distribution analyzer
    - Count questions in each category for each chapter
    - Verify each chapter has at least 10 questions per category
    - Generate distribution report for Chapters 1-10
    - _Requirements: 9.1-9.4_

  - [x] 22.2 Fix any category distribution issues
    - If any chapter has insufficient questions in a category, add more questions
    - Ensure total remains exactly 50 questions per chapter
    - _Requirements: 3.1, 3.5_

- [x] 23. Verify progressive learning implementation
  - [x] 23.1 Create progressive learning analyzer
    - For each chapter 2-10, identify which previous chapters are referenced
    - Verify at least one question per chapter references previous material
    - Generate progressive learning report
    - _Requirements: 3.3, 3.4, 10.1-10.10_

  - [x] 23.2 Fix any progressive learning gaps
    - If any chapter lacks previous chapter references, add review questions
    - Maintain proper distribution (current chapter emphasis, previous chapter review)
    - _Requirements: 10.1-10.10_

- [x] 24. Add furigana to vocabulary and conversation quiz questions
  - [x] 24.1 Update quiz rendering to support ruby tags
    - Modify quiz.js to render ruby tags in question text
    - Test furigana display in vocabulary questions
    - Test furigana display in conversation questions
    - _Requirements: 3.6, 3.7, 3.8_

  - [x] 24.2 Validate furigana in quiz questions
    - Verify kanji-hiragana consistency with vocabulary dataset
    - Ensure furigana displays correctly in all quiz categories
    - _Requirements: 3.8_

- [x]* 25. Write property test for chapter data completeness
  - **Property 8: Chapter Data Completeness**
  - **Validates: Requirements 2.1, 3.1**
  - Test that all chapters 1-10 have exactly 10 conversations
  - Test that all chapters 1-10 have exactly 50 quiz questions
  - _Requirements: 2.1, 3.1_

- [x] 26. Checkpoint - Verify quiz system functionality
  - Ensure all tests pass, ask the user if questions arise.

### Phase 4: Pattern and Grammar Material Alignment

- [x] 27. Validate pattern data for Chapters 1-10
  - [x] 27.1 Review existing pattern data
    - Verify patterns align with Minna no Nihongo 1 textbook
    - Check that pattern examples use vocabulary from current or previous chapters
    - Validate all required fields present (id, chapterId, order, pattern, explanation, examples)
    - _Requirements: 5.2, 5.4, 6.5_

  - [x] 27.2 Update pattern data if needed
    - Fix any patterns that don't align with textbook
    - Update examples to use appropriate vocabulary
    - Ensure pattern notation matches textbook (e.g., "N は N です")
    - _Requirements: 5.1, 5.2_

- [x] 28. Validate grammar data for Chapters 1-10
  - [x] 28.1 Review existing grammar data
    - Verify grammar explanations align with Minna no Nihongo 1 textbook
    - Check that grammar examples use vocabulary from current or previous chapters
    - Validate all required fields present (id, chapterId, order, title, explanation, examples)
    - _Requirements: 5.1, 5.3, 5.4, 6.6_

  - [x] 28.2 Update grammar data if needed
    - Fix any grammar explanations that don't align with textbook
    - Update examples to use appropriate vocabulary
    - Ensure terminology is consistent with vocabulary dataset
    - _Requirements: 5.1, 5.3_

- [x]* 29. Write unit tests for pattern and grammar validation
  - Test pattern validation with valid and invalid data
  - Test grammar validation with valid and invalid data
  - Test that invalid entries are skipped with error logging
  - _Requirements: 5.5, 5.6, 5.7_

- [x] 30. Checkpoint - Verify material alignment
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Testing and Validation

- [x] 31. Run comprehensive data validation
  - [x] 31.1 Create master validation script
    - Validate all chapter JSON files (ch01.json - ch10.json)
    - Check vocabulary dataset integrity (no modifications)
    - Validate conversation data structure and completeness
    - Validate quiz data structure and completeness
    - Validate pattern and grammar data structure
    - Generate comprehensive validation report
    - _Requirements: 6.1-6.7, 7.1-7.10, 13.1_

  - [x] 31.2 Fix any validation errors
    - Address any data structure issues identified
    - Fix any missing or invalid fields
    - Ensure all chapters pass validation
    - _Requirements: 13.2-13.4_

- [x]* 32. Run all property-based tests
  - Execute all 13 property tests with 100 iterations each
  - Property 1: Vocabulary Consistency in Furigana
  - Property 2: Vocabulary Dataset Immutability
  - Property 3: Non-Kanji Text Has No Furigana
  - Property 4: Conversation Data Completeness
  - Property 5: Kanji Display Mode Behavior
  - Property 6: Furigana Display Mode Behavior
  - Property 7: Progressive Learning Coverage
  - Property 8: Chapter Data Completeness
  - Property 9: Quiz Question Structure Validity
  - Property 10: Quiz Category Distribution
  - Property 11: Unknown Kanji Handling
  - Verify all properties pass
  - _Requirements: 14.1-14.10_

- [x]* 33. Run all unit tests
  - Execute unit tests for kanjiParser, vocabularyMatcher, displayMode
  - Execute unit tests for conversation, quiz, pattern, grammar modules
  - Execute unit tests for validation utilities
  - Verify code coverage ≥ 80% for enhancement code
  - _Requirements: 14.1-14.7_

- [x]* 34. Run integration tests
  - Test conversation module with furigana toggle end-to-end
  - Test quiz module with all categories end-to-end
  - Test pattern and grammar modules end-to-end
  - Verify all modules work together correctly
  - _Requirements: 14.3, 14.4_

- [x]* 35. Run performance tests
  - Measure conversation initial load time (should be ≤ 500ms)
  - Measure display mode toggle time (should be ≤ 200ms)
  - Measure furigana generation time per turn (should be ≤ 100ms)
  - Measure quiz question load time (should be ≤ 300ms)
  - Measure quiz navigation time (should be ≤ 100ms)
  - _Requirements: 12.1-12.5, 14.8_

- [x]* 36. Run accessibility tests
  - Test keyboard navigation for furigana toggle
  - Test screen reader compatibility
  - Test focus indicators visibility
  - Test color contrast ratios (WCAG 2.1 Level AA)
  - Test text scaling up to 200%
  - _Requirements: 11.1-11.10, 14.9_

- [x] 37. Checkpoint - Verify all tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Phase 6: Error Handling and Edge Cases

- [x] 38. Implement comprehensive error handling
  - [x] 38.1 Add error handling for data validation failures
    - When required field is missing, log detailed error with field name and location
    - When field has invalid type, log error with expected and actual types
    - Display user-friendly error messages in Indonesian
    - _Requirements: 13.2, 13.3, 13.10_

  - [x] 38.2 Add error handling for furigana matching failures
    - When kanji not found in vocabulary, log warning and display kanji without furigana
    - When ambiguous kanji sequences found, log warning and use best match
    - _Requirements: 1.8, 8.7, 13.6_

  - [x] 38.3 Add error handling for invalid data entries
    - When conversation entry is invalid, skip entry and log error
    - When quiz entry is invalid, skip entry and log error
    - When pattern/grammar entry is invalid, skip entry and log error
    - _Requirements: 2.6, 13.4, 13.5_

- [x]* 39. Write property test for invalid data error handling
  - **Property 12: Invalid Data Error Handling**
  - **Validates: Requirements 2.6**
  - Test that invalid conversation entries are skipped with error logging
  - Test that invalid quiz entries are skipped with error logging
  - _Requirements: 2.6_

- [x]* 40. Write unit tests for error handling
  - Test error handling with missing fields
  - Test error handling with invalid field types
  - Test error handling with out-of-range values
  - Test error messages are user-friendly and informative
  - _Requirements: 13.2-13.4, 13.10_

- [x] 41. Test edge cases
  - [x] 41.1 Test with empty conversation data
    - Verify application handles empty conversations array gracefully
    - Display appropriate message to user
    - _Requirements: 14.7_

  - [x] 41.2 Test with empty quiz data
    - Verify application handles empty quiz array gracefully
    - Display appropriate message to user
    - _Requirements: 14.7_

  - [x] 41.3 Test with special characters and punctuation
    - Test furigana generation with punctuation marks
    - Test with numbers, symbols, mixed scripts
    - _Requirements: 8.8, 14.7_

- [x] 42. Checkpoint - Verify error handling and edge cases
  - Ensure all tests pass, ask the user if questions arise.

### Phase 7: Documentation and Deployment

- [x] 43. Update documentation
  - [x] 43.1 Update README with new features
    - Document furigana toggle feature
    - Document quiz system enhancements
    - Document progressive learning implementation
    - Include usage examples and screenshots
    - _Requirements: 15.3, 15.4_

  - [x] 43.2 Document data structure changes
    - Document conversation data structure with examples
    - Document quiz data structure with examples
    - Document validation rules for all data types
    - _Requirements: 15.5, 15.6_

  - [x] 43.3 Create developer guide
    - Document how to add new chapters (chapters 11-25)
    - Document how to create conversations aligned with textbook
    - Document how to create quiz questions with proper distribution
    - Include troubleshooting guide for common issues
    - _Requirements: 15.7, 15.8_

  - [x] 43.4 Add JSDoc comments to all enhancement code
    - Add JSDoc comments to all public functions
    - Add inline comments for complex logic
    - Document function parameters, return values, and exceptions
    - _Requirements: 15.1, 15.2_

- [x] 44. Create deployment checklist
  - [x] 44.1 Verify pre-deployment requirements
    - All chapter JSON files validated ✓
    - All unit tests passing ✓
    - All property tests passing (100 iterations each) ✓
    - Performance benchmarks met ✓
    - Accessibility requirements verified ✓
    - Documentation complete ✓
    - _Requirements: 14.1-14.10_

  - [x] 44.2 Create backup of current data
    - Backup all ch01.json - ch10.json files
    - Store backup with timestamp
    - Document rollback procedure
    - _Requirements: 15.9_

- [x] 45. Deploy enhanced data
  - [x] 45.1 Replace chapter JSON files
    - Deploy enhanced ch01.json - ch10.json files
    - Verify file integrity after deployment
    - _Requirements: 6.1-6.7_

  - [x] 45.2 Verify deployment
    - Test conversation module with furigana toggle
    - Test quiz module with all categories
    - Test pattern and grammar modules
    - Verify performance requirements met
    - Monitor error logs for any issues
    - _Requirements: 12.1-12.5_

- [x] 46. Final checkpoint - Deployment verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 47. Fix conversation kanji usage consistency
  - Review all conversation data in chapters 1-10
  - Replace hiragana words with kanji equivalents from vocabulary dataset
  - Ensure japanese field uses kanji while hiragana field contains hiragana readings
  - Examples: "ぎんこう" → "銀行", "なんじ" → "何時", "おきます" → "起きます"
  - Maintain vocabulary dataset integrity (read-only)
  - _Requirements: 1.6, 2.4, 2.5_
  - ✅ Fixed 171 conversation turns across chapters 1-4, 7-8
  - ⚠️  Chapters 5, 6, 9, 10 have corrupted data - need reconstruction

- [x] 48. Reconstruct corrupted conversations in chapters 5, 6, 9, 10
  - Rebuild conversation data for chapters with encoding issues
  - Ensure all conversations use proper kanji from vocabulary dataset
  - Maintain 10 conversations per chapter
  - Fix all corrupted characters and symbols
  - _Requirements: 1.6, 2.4, 2.5_

- [x] 49. Comprehensive corruption fix for all chapters
  - Fix 264 corrupted fields across chapters 1-10
  - Priority 1: Conversations (chapters 5, 6, 9, 10)
  - Priority 2: Quiz questions (chapters 1-4, 8)
  - Priority 3: Grammar & Patterns (chapters 3, 5, 6, 8, 9, 10)
  - Priority 4: Chapter titles (chapters 5, 6, 8, 9, 10)
  - Use Chapter 7 as clean reference template
  - _Requirements: 1.6, 2.4, 2.5, 3.1, 5.1-5.7_

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties (13 properties total)
- Unit tests validate specific examples and edge cases
- All tasks build incrementally with no orphaned code
- Vocabulary datasets must NEVER be modified (read-only constraint)
- All content must align with Minna no Nihongo 1 textbook standards
- Scope is strictly limited to chapters 1-10 only

## Success Criteria

### Data Completeness
- ✓ All chapters 1-10 have exactly 10 conversations
- ✓ All chapters 1-10 have exactly 50 quiz questions
- ✓ 0 modifications to vocabulary datasets

### Furigana System
- ✓ Furigana accuracy ≥ 95% (correct kanji-hiragana matching)
- ✓ Display mode toggle ≤ 200ms
- ✓ Furigana generation ≤ 100ms per turn

### Quiz System
- ✓ All 4 categories represented in each chapter (vocabulary, grammar, reading, conversation)
- ✓ Chapters 2-10 include material from previous chapters
- ✓ Quiz rendering ≤ 300ms

### Quality
- ✓ Code coverage ≥ 80% for enhancement code
- ✓ All 13 property tests pass (100 iterations each)
- ✓ 0 critical bugs in production
- ✓ WCAG 2.1 Level AA accessibility compliance

### Content Alignment
- ✓ All conversations align with Minna no Nihongo 1 textbook
- ✓ All quiz questions follow JLPT standards
- ✓ All grammar/patterns match textbook content
- ✓ All examples use vocabulary from current or previous chapters only
