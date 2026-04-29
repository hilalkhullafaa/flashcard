# Requirements Document

## Introduction

This feature enhances the Progress Tracker to display lists of memorized vocabulary and kanji items, and provides the ability to delete items from the memorized lists. Currently, the Progress Tracker only shows aggregate statistics (counts and percentages). This enhancement will allow users to view the actual items they have memorized and manage their learning progress by removing items they want to practice again.

## Glossary

- **Progress_Tracker**: The module that tracks and persists vocabulary and kanji memorization progress across all chapters
- **Memorized_Vocab_List**: The collection of vocabulary items that have been marked as memorized by the user
- **Memorized_Kanji_List**: The collection of kanji items that have been marked as memorized by the user
- **Progress_Display_UI**: The user interface component that displays the lists of memorized items
- **Delete_Button**: An interactive control that removes an item from the memorized list
- **Vocab_Item**: A vocabulary entry containing kanji, kana (hiragana/katakana), romaji, and meaning
- **Kanji_Item**: A kanji character entry with its associated vocabulary information
- **LocalStorage**: Browser storage mechanism used to persist progress data

## Requirements

### Requirement 1: Display Memorized Vocabulary List

**User Story:** As a learner, I want to view a list of all vocabulary items I have memorized, so that I can review what I have learned and track my progress.

#### Acceptance Criteria

1. THE Progress_Display_UI SHALL display all vocabulary items from the Memorized_Vocab_List
2. WHEN a vocabulary item is displayed, THE Progress_Display_UI SHALL show the kanji, kana, romaji, and meaning
3. WHEN the Memorized_Vocab_List is empty, THE Progress_Display_UI SHALL display a message indicating no vocabulary has been memorized
4. WHEN a vocabulary item is added to the Memorized_Vocab_List, THE Progress_Display_UI SHALL update to include the new item within 500 milliseconds
5. THE Progress_Display_UI SHALL display vocabulary items in a readable format with clear visual separation between items

### Requirement 2: Display Memorized Kanji List

**User Story:** As a learner, I want to view a list of all kanji I have memorized, so that I can review my kanji knowledge and track my progress.

#### Acceptance Criteria

1. THE Progress_Display_UI SHALL display all kanji items from the Memorized_Kanji_List
2. WHEN a kanji item is displayed, THE Progress_Display_UI SHALL show the kanji text and its associated vocabulary information
3. WHEN the Memorized_Kanji_List is empty, THE Progress_Display_UI SHALL display a message indicating no kanji has been memorized
4. WHEN a kanji item is added to the Memorized_Kanji_List, THE Progress_Display_UI SHALL update to include the new item within 500 milliseconds
5. THE Progress_Display_UI SHALL display kanji items in a readable format with clear visual separation between items

### Requirement 3: Delete Vocabulary from Memorized List

**User Story:** As a learner, I want to remove vocabulary items from my memorized list, so that I can practice them again if I have forgotten them.

#### Acceptance Criteria

1. WHEN a vocabulary item is displayed in the Progress_Display_UI, THE Progress_Display_UI SHALL provide a Delete_Button for that item
2. WHEN the Delete_Button is clicked for a vocabulary item, THE Progress_Tracker SHALL remove the item from the Memorized_Vocab_List
3. WHEN a vocabulary item is removed from the Memorized_Vocab_List, THE Progress_Tracker SHALL update LocalStorage within 500 milliseconds
4. WHEN a vocabulary item is removed from the Memorized_Vocab_List, THE Progress_Display_UI SHALL remove the item from the display within 500 milliseconds
5. WHEN a vocabulary item is removed from the Memorized_Vocab_List, THE Progress_Tracker SHALL update the vocabulary statistics to reflect the change

### Requirement 4: Delete Kanji from Memorized List

**User Story:** As a learner, I want to remove kanji items from my memorized list, so that I can practice them again if I have forgotten them.

#### Acceptance Criteria

1. WHEN a kanji item is displayed in the Progress_Display_UI, THE Progress_Display_UI SHALL provide a Delete_Button for that item
2. WHEN the Delete_Button is clicked for a kanji item, THE Progress_Tracker SHALL remove the item from the Memorized_Kanji_List
3. WHEN a kanji item is removed from the Memorized_Kanji_List, THE Progress_Tracker SHALL update LocalStorage within 500 milliseconds
4. WHEN a kanji item is removed from the Memorized_Kanji_List, THE Progress_Display_UI SHALL remove the item from the display within 500 milliseconds
5. WHEN a kanji item is removed from the Memorized_Kanji_List, THE Progress_Tracker SHALL update the kanji statistics to reflect the change

### Requirement 5: Progress Display UI Integration

**User Story:** As a learner, I want to access the memorized items display from the main interface, so that I can easily view and manage my progress.

#### Acceptance Criteria

1. THE Progress_Display_UI SHALL be accessible from the home page or chapter list page
2. WHEN the Progress_Display_UI is opened, THE Progress_Display_UI SHALL load and display both vocabulary and kanji lists within 1000 milliseconds
3. THE Progress_Display_UI SHALL provide a way to distinguish between vocabulary items and kanji items
4. THE Progress_Display_UI SHALL display the current statistics (counts and percentages) alongside the item lists
5. WHEN the user navigates away from the Progress_Display_UI, THE system SHALL preserve all progress data in LocalStorage

### Requirement 6: Delete Confirmation and Feedback

**User Story:** As a learner, I want clear feedback when I delete items from my memorized list, so that I know the action was successful and can avoid accidental deletions.

#### Acceptance Criteria

1. WHEN the Delete_Button is clicked, THE Progress_Display_UI SHALL provide visual feedback indicating the deletion is in progress
2. WHEN an item is successfully deleted, THE Progress_Display_UI SHALL provide visual confirmation of the deletion
3. IF a deletion fails, THEN THE Progress_Display_UI SHALL display an error message and retain the item in the list
4. THE Delete_Button SHALL have a clear visual design that indicates its destructive action
5. WHEN multiple items are deleted in sequence, THE Progress_Display_UI SHALL handle each deletion independently without blocking user interaction

### Requirement 7: Data Consistency

**User Story:** As a learner, I want my progress data to remain consistent across all views, so that I can trust the accuracy of my learning progress.

#### Acceptance Criteria

1. WHEN a vocabulary item is deleted from the Memorized_Vocab_List, THE Progress_Tracker SHALL ensure the item can be marked as memorized again in flashcard mode
2. WHEN a kanji item is deleted from the Memorized_Kanji_List, THE Progress_Tracker SHALL ensure the kanji can be marked as memorized again in flashcard mode
3. THE Progress_Tracker SHALL maintain synchronization between the displayed lists and the underlying data structures
4. WHEN the Progress_Display_UI is refreshed, THE Progress_Display_UI SHALL display the current state of memorized items from LocalStorage
5. THE Progress_Tracker SHALL ensure that deleting a kanji item does not affect the vocabulary memorization status of items containing that kanji
