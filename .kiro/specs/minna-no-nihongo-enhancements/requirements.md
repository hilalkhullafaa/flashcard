# Requirements Document

## Introduction

This document specifies requirements for enhancements to the Minna no Nihongo learning application. The enhancements focus on improving the flashcard experience by separating kanji and hiragana vocabulary, consolidating learning materials, adding conversation examples, and implementing progress tracking across all chapters.

## Glossary

- **Application**: The Minna no Nihongo learning web application
- **Flashcard_Module**: The component that displays vocabulary flashcards for memorization
- **Kotoba**: Japanese vocabulary items stored in chapter JSON files
- **Kanji_Kotoba**: Vocabulary items that contain kanji characters (kanji field is non-empty)
- **Hiragana_Kotoba**: Vocabulary items that do not contain kanji characters (kanji field is empty)
- **Materi_Section**: The consolidated learning materials section combining patterns and grammar
- **Conversation_Section**: A new section displaying conversation examples from the textbook
- **Progress_Tracker**: A component that tracks and displays memorization progress for vocabulary and kanji
- **Chapter_Data**: JSON data structure containing vocabulary, patterns, grammar, and quiz information for each chapter
- **Navigation**: The application's navigation interface

## Requirements

### Requirement 1: Split Flashcard Kotoba by Kanji Presence

**User Story:** As a learner, I want flashcards separated into kanji and hiragana-only vocabulary, so that I can practice them differently based on my learning needs.

#### Acceptance Criteria

1. THE Flashcard_Module SHALL provide two separate flashcard modes: "All Vocabulary" and "Kanji Only"
2. WHEN "All Vocabulary" mode is selected, THE Flashcard_Module SHALL display all vocabulary items from the chapter
3. WHEN "Kanji Only" mode is selected, THE Flashcard_Module SHALL display only Kanji_Kotoba items
4. FOR ALL vocabulary items in "Kanji Only" mode, THE Flashcard_Module SHALL hide hiragana readings on the front side of flashcards
5. WHEN displaying Kanji_Kotoba in "Kanji Only" mode, THE Flashcard_Module SHALL show only the kanji character on the front side
6. WHEN a flashcard is flipped in "Kanji Only" mode, THE Flashcard_Module SHALL reveal the hiragana reading, romaji, meaning, and word class
7. THE Flashcard_Module SHALL filter vocabulary items where the kanji field is non-empty for "Kanji Only" mode
8. THE Flashcard_Module SHALL maintain separate progress tracking for each flashcard mode

### Requirement 2: Consolidate Materi Section

**User Story:** As a learner, I want patterns and grammar combined into one materials section, so that I can access all learning content in one place.

#### Acceptance Criteria

1. THE Application SHALL combine patterns and grammar into a single Materi_Section
2. THE Materi_Section SHALL display both pattern entries and grammar entries in a unified list
3. WHEN rendering the Materi_Section, THE Application SHALL preserve the order property of each entry
4. THE Materi_Section SHALL display pattern entries with their pattern, explanation, and examples
5. THE Materi_Section SHALL display grammar entries with their title, explanation, and examples
6. THE Application SHALL source Materi_Section content from Chapter_Data patterns and grammar arrays
7. WHERE Chapter_Data contains both patterns and grammar, THE Application SHALL merge them into a single ordered list
8. THE Materi_Section SHALL maintain consistent visual styling for both pattern and grammar entries

### Requirement 3: Add Conversation Examples

**User Story:** As a learner, I want to see conversation examples from the textbook, so that I can understand how vocabulary and grammar are used in context.

#### Acceptance Criteria

1. THE Application SHALL provide a new Conversation_Section for each chapter
2. THE Conversation_Section SHALL display conversation examples sourced from the Minna no Nihongo textbook
3. WHEN rendering a conversation, THE Conversation_Section SHALL display Japanese text, romaji, and Indonesian translation
4. THE Conversation_Section SHALL support multi-turn conversations with speaker identification
5. THE Application SHALL store conversation data in Chapter_Data JSON files
6. WHEN Chapter_Data contains no conversation data, THE Conversation_Section SHALL display a message indicating conversations are not yet available
7. THE Conversation_Section SHALL be accessible from the chapter detail navigation tabs

### Requirement 4: Implement Progress Tracking

**User Story:** As a learner, I want to see my overall progress for vocabulary and kanji memorization, so that I can track my learning achievements across all chapters.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL calculate total vocabulary items across all chapters
2. THE Progress_Tracker SHALL calculate total Kanji_Kotoba items across all chapters
3. THE Progress_Tracker SHALL track which vocabulary items have been marked as memorized
4. THE Progress_Tracker SHALL track which Kanji_Kotoba items have been marked as memorized
5. THE Progress_Tracker SHALL persist memorization state in browser local storage
6. THE Progress_Tracker SHALL display overall progress statistics in the Navigation
7. WHEN a vocabulary item is marked as memorized in the Flashcard_Module, THE Progress_Tracker SHALL update the overall progress count
8. THE Progress_Tracker SHALL display progress as both count (e.g., "150/500") and percentage (e.g., "30%")
9. THE Progress_Tracker SHALL provide separate progress indicators for vocabulary and kanji
10. WHEN the Application loads, THE Progress_Tracker SHALL restore memorization state from local storage
11. THE Progress_Tracker SHALL update progress statistics in real-time as users mark items as memorized

### Requirement 5: Data Structure Updates

**User Story:** As a developer, I want Chapter_Data to support conversation examples, so that the application can display conversation content.

#### Acceptance Criteria

1. THE Chapter_Data SHALL include a conversations array field
2. WHEN a conversation is defined, THE Chapter_Data SHALL store conversation id, chapter id, order, and turns
3. WHEN a conversation turn is defined, THE Chapter_Data SHALL store speaker, japanese text, romaji, and indonesian translation
4. THE Application SHALL validate that conversation data follows the defined schema
5. WHERE conversation data is missing from Chapter_Data, THE Application SHALL handle it gracefully without errors
