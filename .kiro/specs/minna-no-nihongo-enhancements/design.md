# Design Document: Minna no Nihongo Enhancements

## Overview

This design enhances the Minna no Nihongo learning application with four key improvements: splitting flashcards by kanji presence, consolidating learning materials, adding conversation examples, and implementing comprehensive progress tracking. The enhancements maintain the existing vanilla JavaScript modular architecture while introducing new features that improve the learning experience.

The application currently uses a hash-based router with modular components for vocabulary (kotoba), patterns, grammar, flashcards, and quizzes. Data is stored in JSON files (ch01.json - ch25.json) with a consistent schema. This design extends that foundation with minimal disruption to existing functionality.

## Architecture

### Component Structure

The application follows a modular architecture with clear separation of concerns:

```
js/
├── app.js                    # Router and initialization
├── data.js                   # Data fetching utilities
├── utils.js                  # Shared utility functions
├── pages/
│   ├── chapterList.js        # Chapter selection page
│   └── chapterDetail.js      # Chapter detail with tabs
└── modules/
    ├── flashcard.js          # Flashcard component (ENHANCED)
    ├── kotoba.js             # Vocabulary list
    ├── pattern.js            # Pattern display
    ├── grammar.js            # Grammar display
    ├── quiz.js               # Quiz component
    ├── materi.js             # NEW: Consolidated materials
    ├── conversation.js       # NEW: Conversation display
    └── progress.js           # NEW: Progress tracking
```

### Data Flow

1. **Router** (`app.js`) parses URL hash and delegates to page components
2. **Page components** fetch data via `data.js` and render module components
3. **Module components** receive chapter data and render UI
4. **Progress tracking** persists to localStorage and updates in real-time

### State Management

- **Flashcard state**: Local component state (current index, flip status, remembered items)
- **Progress state**: Persisted in localStorage with keys:
  - `mnn_vocab_progress`: Set of memorized vocabulary IDs
  - `mnn_kanji_progress`: Set of memorized kanji vocabulary IDs
- **Navigation state**: URL hash (e.g., `#/chapter/1/flashcard`)

## Components and Interfaces

### 1. Enhanced Flashcard Module

**File**: `js/modules/flashcard.js`

**Interface**:
```javascript
function renderFlashcard(container, chapterData, options = {})
```

**Parameters**:
- `container`: DOM element to render into
- `chapterData`: Chapter data object with vocabulary array
- `options.mode`: `'all'` (default) or `'kanji'` - flashcard mode

**Behavior**:
- Filters vocabulary based on mode:
  - `'all'`: All vocabulary items
  - `'kanji'`: Only items where `kanji` field is non-empty
- Front side display:
  - `'all'` mode: Shows kanji (if present) and kana
  - `'kanji'` mode: Shows only kanji character
- Back side display: Shows romaji, meaning, word class (both modes)
- Maintains separate remembered sets for each mode
- Persists progress to localStorage

**UI Elements**:
- Mode selector toggle (All Vocabulary / Kanji Only)
- Progress bar showing memorized count
- Flashcard with flip interaction
- Remember/Forget buttons
- Navigation buttons (Previous, Next, Shuffle)

### 2. Consolidated Materi Module

**File**: `js/modules/materi.js`

**Interface**:
```javascript
function renderMateri(container, chapterData)
```

**Parameters**:
- `container`: DOM element to render into
- `chapterData`: Chapter data object with patterns and grammar arrays

**Behavior**:
- Merges `patterns` and `grammar` arrays from chapter data
- Sorts merged array by `order` property
- Renders unified list with consistent styling
- Distinguishes entry types with visual indicators

**Entry Types**:
- **Pattern entries**: Display pattern, explanation, examples
- **Grammar entries**: Display title, explanation, examples

**UI Structure**:
```
[Pattern/Grammar Badge] Title/Pattern
Explanation text
Examples:
  - Japanese (romaji) → Indonesian
  - Japanese (romaji) → Indonesian
```

### 3. Conversation Module

**File**: `js/modules/conversation.js`

**Interface**:
```javascript
function renderConversation(container, chapterData)
```

**Parameters**:
- `container`: DOM element to render into
- `chapterData`: Chapter data object with conversations array

**Behavior**:
- Displays conversation examples from textbook
- Renders multi-turn conversations with speaker identification
- Shows Japanese text, romaji, and Indonesian translation
- Handles missing conversation data gracefully

**UI Structure**:
```
Conversation 1: [Title if available]
┌─────────────────────────────────────┐
│ Speaker A:                          │
│ 日本語テキスト                        │
│ (romaji)                            │
│ Terjemahan Indonesia                │
├─────────────────────────────────────┤
│ Speaker B:                          │
│ 日本語テキスト                        │
│ (romaji)                            │
│ Terjemahan Indonesia                │
└─────────────────────────────────────┘
```

### 4. Progress Tracking Module

**File**: `js/modules/progress.js`

**Interface**:
```javascript
class ProgressTracker {
  constructor()
  
  // Mark vocabulary as memorized
  markVocabMemorized(vocabId)
  
  // Mark vocabulary as forgotten
  markVocabForgotten(vocabId)
  
  // Mark kanji vocabulary as memorized
  markKanjiMemorized(vocabId)
  
  // Mark kanji vocabulary as forgotten
  markKanjiForgotten(vocabId)
  
  // Check if vocabulary is memorized
  isVocabMemorized(vocabId): boolean
  
  // Check if kanji is memorized
  isKanjiMemorized(vocabId): boolean
  
  // Get overall statistics
  getStats(allChaptersData): {
    vocab: { memorized: number, total: number, percentage: number },
    kanji: { memorized: number, total: number, percentage: number }
  }
  
  // Load state from localStorage
  load()
  
  // Save state to localStorage
  save()
}

// Singleton instance
export const progressTracker = new ProgressTracker()
```

**Storage Format**:
```javascript
// localStorage keys
{
  "mnn_vocab_progress": ["ch01_001", "ch01_002", ...],
  "mnn_kanji_progress": ["ch01_001", "ch02_005", ...]
}
```

**Integration Points**:
- Flashcard module calls `markVocabMemorized`/`markKanjiMemorized` when user clicks "Sudah Ingat"
- Navigation component displays overall progress statistics
- Progress updates trigger UI refresh

### 5. Updated Chapter Detail Page

**File**: `js/pages/chapterDetail.js`

**Changes**:
- Add "Percakapan" tab to TABS array
- Update "Materi" tab to use new consolidated materi module
- Pass mode option to flashcard module based on user selection

**Updated TABS Array**:
```javascript
const TABS = [
  { key: 'kotoba',      label: 'Kotoba',       render: renderKotoba      },
  { key: 'materi',      label: 'Materi',       render: renderMateri      },
  { key: 'percakapan',  label: 'Percakapan',   render: renderConversation },
  { key: 'flashcard',   label: 'Flashcard',    render: renderFlashcard   },
  { key: 'kuis',        label: 'Kuis',         render: renderQuiz        },
];
```

### 6. Navigation Enhancement

**File**: `js/pages/chapterList.js`

**Changes**:
- Add progress statistics display at the top of chapter list
- Show overall vocabulary and kanji progress
- Update in real-time when returning from chapter detail

**UI Addition**:
```
┌─────────────────────────────────────┐
│ Progress Keseluruhan                │
│                                     │
│ Kosakata: 150/500 (30%)            │
│ [████████░░░░░░░░░░░░░░░░░░░░]     │
│                                     │
│ Kanji: 80/300 (27%)                │
│ [███████░░░░░░░░░░░░░░░░░░░░░]     │
└─────────────────────────────────────┘
```

## Data Models

### Existing Chapter Data Schema

```typescript
interface ChapterData {
  chapter: {
    id: number
    title: string
    titleRomaji: string
    titleId: string
  }
  vocabulary: VocabEntry[]
  patterns: PatternEntry[]
  grammar: GrammarEntry[]
  quiz: QuizQuestion[]
}

interface VocabEntry {
  id: string              // e.g., "ch01_001"
  chapterId: number
  order: number
  kanji: string           // Empty string if no kanji
  kana: string
  romaji: string
  wordClass: string
  meaning: string
}

interface PatternEntry {
  id: string
  chapterId: number
  order: number
  pattern: string
  explanation: string
  examples: Example[]
}

interface GrammarEntry {
  id: string
  chapterId: number
  order: number
  title: string
  explanation: string
  examples: Example[]
}

interface Example {
  japanese: string
  romaji: string
  indonesian: string
}
```

### New Conversation Schema

```typescript
interface ChapterData {
  // ... existing fields ...
  conversations?: ConversationEntry[]  // NEW: Optional field
}

interface ConversationEntry {
  id: string              // e.g., "ch01_conv01"
  chapterId: number
  order: number
  title?: string          // Optional conversation title
  turns: ConversationTurn[]
}

interface ConversationTurn {
  speaker: string         // e.g., "ミラー", "たなか"
  japanese: string
  romaji: string
  indonesian: string
}
```

### Progress Data Model

```typescript
interface ProgressData {
  vocabMemorized: Set<string>    // Set of vocabulary IDs
  kanjiMemorized: Set<string>    // Set of kanji vocabulary IDs
}

interface ProgressStats {
  vocab: {
    memorized: number
    total: number
    percentage: number
  }
  kanji: {
    memorized: number
    total: number
    percentage: number
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This feature involves UI rendering, localStorage persistence, and data filtering—areas where property-based testing provides limited value. The correctness of this feature is better validated through:

1. **Unit tests**: Verify specific filtering logic, data merging, and state management
2. **Integration tests**: Verify localStorage persistence and UI state synchronry
3. **Manual testing**: Verify UI interactions and visual consistency

Property-based testing is not applicable here because:
- UI rendering behavior is deterministic and visual (not a pure function)
- localStorage operations are side-effects (not testable as properties)
- Data filtering is simple predicate logic (better tested with examples)
- Progress tracking involves state mutations (not pure transformations)

## Error Handling

### Data Loading Errors

**Scenario**: Chapter data fails to load or is malformed

**Handling**:
- Display error message with retry button
- Gracefully degrade to empty state
- Log error to console for debugging

**Implementation**:
```javascript
if (!chapterData) {
  container.innerHTML = `
    <div class="error-state">
      <p>Gagal memuat data bab.</p>
      <button onclick="retry()">Coba Lagi</button>
    </div>
  `;
  return;
}
```

### Missing Data Fields

**Scenario**: Chapter data missing optional fields (conversations, patterns, grammar)

**Handling**:
- Check for field existence before rendering
- Display "not available" message for missing sections
- Continue rendering other available sections

**Implementation**:
```javascript
if (!chapterData.conversations || chapterData.conversations.length === 0) {
  container.innerHTML = `
    <p class="text-slate-500 text-center py-12 text-sm">
      Percakapan untuk bab ini belum tersedia.
    </p>
  `;
  return;
}
```

### localStorage Errors

**Scenario**: localStorage is unavailable or quota exceeded

**Handling**:
- Catch localStorage exceptions
- Fall back to in-memory state (session-only)
- Display warning to user about unsaved progress

**Implementation**:
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  console.warn('localStorage unavailable, progress will not persist');
  // Continue with in-memory state
}
```

### Empty Flashcard Sets

**Scenario**: "Kanji Only" mode selected but chapter has no kanji vocabulary

**Handling**:
- Display message indicating no kanji vocabulary available
- Provide button to switch to "All Vocabulary" mode
- Prevent navigation errors

**Implementation**:
```javascript
const kanjiVocab = vocabulary.filter(v => v.kanji && v.kanji !== '');
if (mode === 'kanji' && kanjiVocab.length === 0) {
  container.innerHTML = `
    <div class="empty-state">
      <p>Tidak ada kosakata kanji di bab ini.</p>
      <button onclick="switchToAllMode()">Lihat Semua Kosakata</button>
    </div>
  `;
  return;
}
```

### Invalid Progress Data

**Scenario**: localStorage contains corrupted or invalid progress data

**Handling**:
- Validate data structure on load
- Reset to empty state if invalid
- Log warning for debugging

**Implementation**:
```javascript
load() {
  try {
    const data = JSON.parse(localStorage.getItem('mnn_vocab_progress') || '[]');
    if (!Array.isArray(data)) throw new Error('Invalid format');
    this.vocabMemorized = new Set(data);
  } catch (e) {
    console.warn('Invalid progress data, resetting');
    this.vocabMemorized = new Set();
  }
}
```

## Testing Strategy

### Unit Tests

**Focus**: Core logic and data transformations

**Test Cases**:

1. **Vocabulary Filtering**:
   - Filter vocabulary by kanji presence
   - Handle empty kanji field correctly
   - Preserve order after filtering

2. **Data Merging**:
   - Merge patterns and grammar arrays
   - Sort by order property
   - Handle missing arrays gracefully

3. **Progress Calculations**:
   - Calculate total vocabulary count across chapters
   - Calculate memorized percentage
   - Handle empty chapter data

4. **localStorage Operations**:
   - Save and load progress data
   - Handle corrupted data
   - Handle quota exceeded

**Example Test**:
```javascript
describe('Vocabulary Filtering', () => {
  it('should filter kanji vocabulary correctly', () => {
    const vocab = [
      { id: 'v1', kanji: '私', kana: 'わたし' },
      { id: 'v2', kanji: '', kana: 'あなた' },
      { id: 'v3', kanji: '先生', kana: 'せんせい' }
    ];
    const result = filterKanjiVocab(vocab);
    expect(result).toHaveLength(2);
    expect(result.map(v => v.id)).toEqual(['v1', 'v3']);
  });
});
```

### Integration Tests

**Focus**: Component interactions and state management

**Test Cases**:

1. **Flashcard Mode Switching**:
   - Switch between "All" and "Kanji Only" modes
   - Verify correct vocabulary displayed
   - Verify progress tracked separately

2. **Progress Persistence**:
   - Mark vocabulary as memorized
   - Reload page
   - Verify progress restored

3. **Tab Navigation**:
   - Navigate between tabs
   - Verify correct module rendered
   - Verify state preserved

4. **Overall Progress Display**:
   - Mark items in flashcard
   - Return to chapter list
   - Verify progress statistics updated

### Manual Testing Checklist

**UI/UX Verification**:

- [ ] Flashcard mode toggle works smoothly
- [ ] Progress bars animate correctly
- [ ] Conversation layout is readable
- [ ] Materi section displays both patterns and grammar
- [ ] Empty states display appropriate messages
- [ ] Mobile responsive design works correctly
- [ ] Keyboard navigation works in flashcards
- [ ] Visual consistency with existing design

**Data Verification**:

- [ ] All 25 chapters load correctly
- [ ] Vocabulary filtering is accurate
- [ ] Progress persists across sessions
- [ ] Conversation data displays correctly
- [ ] Merged materi maintains correct order

**Error Scenarios**:

- [ ] Handle missing conversation data
- [ ] Handle chapters with no kanji vocabulary
- [ ] Handle localStorage unavailable
- [ ] Handle network errors gracefully

### Test Data

**Sample Conversation Data** (for ch01.json):
```json
{
  "conversations": [
    {
      "id": "ch01_conv01",
      "chapterId": 1,
      "order": 1,
      "title": "はじめまして",
      "turns": [
        {
          "speaker": "ミラー",
          "japanese": "はじめまして。マイク・ミラーです。",
          "romaji": "Hajimemashite. Maiku Miraa desu.",
          "indonesian": "Salam kenal. Saya Mike Miller."
        },
        {
          "speaker": "たなか",
          "japanese": "たなかです。どうぞ よろしく。",
          "romaji": "Tanaka desu. Douzo yoroshiku.",
          "indonesian": "Saya Tanaka. Senang berkenalan dengan Anda."
        }
      ]
    }
  ]
}
```

## Implementation Notes

### Flashcard Mode Persistence

Consider persisting the selected flashcard mode (All/Kanji) per chapter in localStorage:
```javascript
localStorage.setItem(`mnn_flashcard_mode_ch${chapterId}`, mode);
```

This improves UX by remembering user preference when returning to a chapter.

### Performance Considerations

- **Progress calculation**: Cache total counts to avoid recalculating on every render
- **Data merging**: Merge patterns and grammar once per chapter load, not on every render
- **localStorage**: Batch updates to minimize write operations

### Accessibility

- Add ARIA labels to flashcard mode toggle
- Ensure keyboard navigation works for all interactive elements
- Provide screen reader announcements for progress updates
- Maintain sufficient color contrast for all text

### Future Enhancements

- Export/import progress data for backup
- Spaced repetition algorithm for flashcard review
- Audio pronunciation for vocabulary
- Search functionality across all conversations
- Statistics dashboard with learning analytics
