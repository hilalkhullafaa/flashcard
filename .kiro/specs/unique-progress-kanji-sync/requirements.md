# Requirements Document

## Introduction

This document specifies the requirements for enhancing the Minna no Nihongo learning application's progress tracking system with two key features: unique progress counting and cross-chapter kanji memorization synchronization. The current system counts vocabulary and kanji items multiple times when they appear across different chapters, and tracks memorization status per vocabulary ID rather than per kanji text. This enhancement will provide more accurate progress statistics and a better learning experience by recognizing that the same kanji appearing in multiple chapters represents a single learning item.

## Glossary

- **Progress_Tracker**: The module responsible for tracking vocabulary and kanji memorization progress across all chapters
- **Vocabulary_Item**: A single entry in the vocabulary data containing id, kanji, kana, romaji, meaning, and wordClass
- **Kanji_Text**: The Japanese kanji characters in a vocabulary item (e.g., "私", "学生", "本")
- **Vocab_ID**: The unique identifier for a vocabulary item (e.g., "ch01_001", "ch02_007")
- **Memorization_Status**: A boolean state indicating whether a vocabulary item or kanji has been marked as memorized
- **Flashcard_Module**: The module that displays vocabulary flashcards in two modes: "all" (all vocabulary) and "kanji" (kanji-only)
- **Kotoba_Module**: The module that displays the vocabulary list for a chapter
- **LocalStorage**: Browser storage mechanism used to persist progress data between sessions
- **Unique_Count**: The count of distinct items (vocabulary or kanji) across all chapters, counting duplicates only once
- **Cross_Chapter_Sync**: The behavior where marking a kanji as memorized in one chapter automatically marks it in all other chapters

## Requirements

### Requirement 1: Unique Progress Statistics

**User Story:** As a learner, I want the overall progress statistics to count unique vocabulary and kanji across all chapters, so that I can see accurate progress without duplicate counting.

#### Acceptance Criteria

1. WHEN the Progress_Tracker calculates overall statistics, THE Progress_Tracker SHALL count each unique Vocabulary_Item only once based on its kanji and kana combination
2. WHEN the Progress_Tracker calculates overall statistics, THE Progress_Tracker SHALL count each unique Kanji_Text only once across all chapters
3. WHEN a Vocabulary_Item with the same kanji and kana appears in multiple chapters, THE Progress_Tracker SHALL include it only once in the total count
4. WHEN the Progress_Tracker calculates memorization percentage, THE Progress_Tracker SHALL use the unique count as the denominator
5. FOR ALL valid chapter data sets, THE unique vocabulary count SHALL be less than or equal to the sum of vocabulary counts per chapter
6. FOR ALL valid chapter data sets, THE unique kanji count SHALL be less than or equal to the sum of kanji counts per chapter

### Requirement 2: Cross-Chapter Kanji Memorization Synchronization

**User Story:** As a learner, I want kanji memorization to sync across all chapters, so that when I mark a kanji as memorized in one chapter, it automatically shows as memorized in all other chapters where that same kanji appears.

#### Acceptance Criteria

1. WHEN a user marks a kanji as memorized in any chapter, THE Progress_Tracker SHALL mark all Vocabulary_Items with the same Kanji_Text as memorized across all chapters
2. WHEN a user marks a kanji as forgotten in any chapter, THE Progress_Tracker SHALL mark all Vocabulary_Items with the same Kanji_Text as forgotten across all chapters
3. WHEN the Flashcard_Module checks if a kanji is memorized, THE Progress_Tracker SHALL return the Memorization_Status based on Kanji_Text rather than Vocab_ID
4. WHEN the Kotoba_Module displays vocabulary, THE Kotoba_Module SHALL show the memorization badge based on Kanji_Text for kanji vocabulary
5. FOR ALL Vocabulary_Items with identical Kanji_Text, THE Memorization_Status SHALL be identical across all chapters
6. WHEN a Vocabulary_Item has no kanji (hiragana/katakana only), THE Progress_Tracker SHALL track its memorization independently by Vocab_ID

### Requirement 3: Dual Tracking System

**User Story:** As a learner, I want the system to track both vocabulary memorization (per vocab ID) and kanji memorization (per kanji text), so that I can practice vocabulary in "all" mode and kanji in "kanji" mode independently.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL maintain two separate tracking systems: vocabulary memorization by Vocab_ID and kanji memorization by Kanji_Text
2. WHEN a user marks a vocabulary item as memorized in "all" mode, THE Progress_Tracker SHALL update the vocabulary memorization status for that Vocab_ID only
3. WHEN a user marks a kanji as memorized in "kanji" mode, THE Progress_Tracker SHALL update the kanji memorization status for that Kanji_Text across all chapters
4. WHEN the Flashcard_Module operates in "all" mode, THE Flashcard_Module SHALL use vocabulary memorization status by Vocab_ID
5. WHEN the Flashcard_Module operates in "kanji" mode, THE Flashcard_Module SHALL use kanji memorization status by Kanji_Text
6. THE vocabulary memorization status and kanji memorization status SHALL be independent and not affect each other

### Requirement 4: LocalStorage Data Structure

**User Story:** As a developer, I want the progress data to be stored efficiently in LocalStorage, so that the system can persist and retrieve memorization status correctly.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL store vocabulary memorization data in LocalStorage with key "mnn_vocab_progress" as an array of Vocab_IDs
2. THE Progress_Tracker SHALL store kanji memorization data in LocalStorage with key "mnn_kanji_progress" as an array of Kanji_Text strings
3. WHEN the Progress_Tracker saves kanji memorization data, THE Progress_Tracker SHALL store only unique Kanji_Text values
4. WHEN the Progress_Tracker loads data from LocalStorage, THE Progress_Tracker SHALL convert arrays to Set data structures for efficient lookup
5. WHEN LocalStorage is unavailable, THE Progress_Tracker SHALL continue to function with in-memory storage only
6. THE Progress_Tracker SHALL batch LocalStorage updates with a 100ms debounce to minimize write operations

### Requirement 5: Backward Compatibility

**User Story:** As an existing user, I want my current progress data to be preserved when the system is upgraded, so that I don't lose my learning progress.

#### Acceptance Criteria

1. WHEN the Progress_Tracker loads existing vocabulary progress data from LocalStorage, THE Progress_Tracker SHALL correctly interpret the array of Vocab_IDs
2. WHEN the Progress_Tracker encounters legacy data without kanji memorization tracking, THE Progress_Tracker SHALL initialize an empty kanji memorization set
3. WHEN the Progress_Tracker loads data, THE Progress_Tracker SHALL validate that the data is an array before processing
4. IF the loaded data is not a valid array, THEN THE Progress_Tracker SHALL reset to an empty Set and log a warning
5. THE Progress_Tracker SHALL maintain the existing localStorage key names for vocabulary progress
6. THE Progress_Tracker SHALL not modify or delete existing vocabulary progress data during migration

### Requirement 6: Progress Statistics Calculation

**User Story:** As a learner, I want to see accurate progress percentages based on unique items, so that I can track my learning progress correctly.

#### Acceptance Criteria

1. WHEN the Progress_Tracker calculates vocabulary progress, THE Progress_Tracker SHALL return memorized count, total unique count, and percentage
2. WHEN the Progress_Tracker calculates kanji progress, THE Progress_Tracker SHALL return memorized count, total unique count, and percentage
3. THE Progress_Tracker SHALL calculate percentage as (memorized / total) * 100 rounded to the nearest integer
4. WHEN the total count is zero, THE Progress_Tracker SHALL return 0% without division errors
5. THE Progress_Tracker SHALL cache total counts to avoid recalculating on every statistics request
6. WHEN chapter data changes, THE Progress_Tracker SHALL invalidate the cached totals

### Requirement 7: Flashcard Integration

**User Story:** As a learner, I want the flashcard system to correctly display and update memorization status based on the current mode, so that I can practice effectively.

#### Acceptance Criteria

1. WHEN the Flashcard_Module displays a card in "kanji" mode, THE Flashcard_Module SHALL check memorization status using Kanji_Text
2. WHEN the Flashcard_Module displays a card in "all" mode, THE Flashcard_Module SHALL check memorization status using Vocab_ID
3. WHEN a user clicks "Sudah Ingat" in "kanji" mode, THE Flashcard_Module SHALL call markKanjiMemorized with the Kanji_Text
4. WHEN a user clicks "Sudah Ingat" in "all" mode, THE Flashcard_Module SHALL call markVocabMemorized with the Vocab_ID
5. WHEN a user clicks "Belum Ingat" in "kanji" mode, THE Flashcard_Module SHALL call markKanjiForgotten with the Kanji_Text
6. WHEN a user clicks "Belum Ingat" in "all" mode, THE Flashcard_Module SHALL call markVocabForgotten with the Vocab_ID
7. THE Flashcard_Module SHALL update the progress bar after each memorization status change
8. THE Flashcard_Module SHALL display the "✓ Ingat" badge when the current item is marked as memorized

### Requirement 8: Kotoba Module Integration

**User Story:** As a learner, I want the vocabulary list to show which kanji I have memorized, so that I can quickly identify what I've already learned.

#### Acceptance Criteria

1. WHEN the Kotoba_Module displays a Vocabulary_Item with kanji, THE Kotoba_Module SHALL check if the Kanji_Text is memorized
2. WHEN a Vocabulary_Item's Kanji_Text is memorized, THE Kotoba_Module SHALL display a visual indicator (badge or highlight)
3. WHEN a Vocabulary_Item has no kanji, THE Kotoba_Module SHALL check vocabulary memorization status by Vocab_ID
4. THE Kotoba_Module SHALL display memorization status consistently with the Flashcard_Module
5. THE Kotoba_Module SHALL update memorization indicators when the user returns to the vocabulary list after using flashcards

### Requirement 9: Error Handling and Validation

**User Story:** As a developer, I want the system to handle invalid data gracefully, so that the application remains stable even with corrupted or missing data.

#### Acceptance Criteria

1. WHEN the Progress_Tracker receives invalid chapter data (not an array), THE Progress_Tracker SHALL return zero statistics and log an error
2. WHEN the Progress_Tracker encounters a Vocabulary_Item without a kanji field, THE Progress_Tracker SHALL treat it as non-kanji vocabulary
3. WHEN LocalStorage throws a SecurityError, THE Progress_Tracker SHALL disable storage and show a warning to the user
4. WHEN LocalStorage throws a QuotaExceededError, THE Progress_Tracker SHALL disable storage and show a warning to the user
5. THE Progress_Tracker SHALL validate that Kanji_Text is a non-empty string before using it as a key
6. THE Progress_Tracker SHALL handle null or undefined values gracefully without throwing exceptions

### Requirement 10: Performance Optimization

**User Story:** As a learner, I want the progress tracking system to be fast and responsive, so that marking items as memorized doesn't cause delays.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL use Set data structures for O(1) lookup performance
2. THE Progress_Tracker SHALL cache total vocabulary and kanji counts to avoid recalculating on every request
3. THE Progress_Tracker SHALL debounce LocalStorage writes to batch multiple updates within 100ms
4. WHEN calculating statistics, THE Progress_Tracker SHALL iterate through chapter data only once per calculation
5. THE Progress_Tracker SHALL invalidate cached totals only when necessary (not on every memorization update)
6. THE Flashcard_Module SHALL update the UI synchronously without waiting for LocalStorage writes to complete
