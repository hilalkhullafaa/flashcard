# Design Document: Minna no Nihongo Chapter 1-10 Enhancement

## Overview

This design document specifies the technical implementation for enhancing the Minna no Nihongo flashcard application for chapters 1-10. The enhancement focuses on three main areas:

1. **Conversations Enhancement**: Adding 10 conversations per chapter with furigana toggle functionality
2. **Quiz Enhancement**: Creating 50 comprehensive quiz questions per chapter with progressive learning
3. **Material Enhancement**: Aligning grammar and patterns with Minna no Nihongo 1 textbook standards

### Design Principles

- **Data Integrity**: NEVER modify existing vocabulary datasets
- **Consistency**: All content must align with existing vocabulary data
- **Reusability**: Leverage existing utilities (kanjiParser, vocabularyMatcher, displayMode)
- **Automation**: Full automation without manual intervention
- **Textbook Alignment**: All content must match Minna no Nihongo 1 standards

### Scope

- **In Scope**: Chapters 1-10 only
- **Out of Scope**: Chapters 11-25, flashcard module, progress tracking, authentication

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Conversation │  │     Quiz     │  │   Pattern/   │      │
│  │    Module    │  │    Module    │  │   Grammar    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Utility Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Kanji Parser │  │  Vocabulary  │  │Display Mode  │      │
│  │              │  │   Matcher    │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Chapter JSON Files (ch01.json - ch10.json)   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────┐ │   │
│  │  │Vocabulary│  │Conversa- │  │   Quiz   │  │Patt-│ │   │
│  │  │(READ-ONLY│  │  tions   │  │          │  │erns │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Interactions

1. **Conversation Module** → Uses **Kanji Parser** + **Vocabulary Matcher** + **Display Mode Manager**
2. **Quiz Module** → Reads quiz data from JSON, renders questions
3. **Pattern/Grammar Modules** → Read and display material data
4. **All Modules** → Read from **Chapter JSON** (vocabulary is READ-ONLY)

## Components and Interfaces

### 1. Conversation Data Structure

```typescript
interface ConversationTurn {
  speaker: string;           // Speaker name (e.g., "ミラー", "サントス")
  japanese: string;          // Japanese text with kanji
  romaji: string;            // Romanized text
  indonesian: string;        // Indonesian translation
  hiragana: string;          // Full hiragana reading for furigana matching
}

interface Conversation {
  id: string;                // Unique ID (e.g., "ch01_conv01")
  chapterId: number;         // Chapter number (1-10)
  order: number;             // Display order (1-10)
  title: string;             // Conversation title
  turns: ConversationTurn[]; // Array of conversation turns
}
```

### 2. Quiz Data Structure

```typescript
interface QuizQuestion {
  id: string;                // Unique ID (e.g., "ch01_q01")
  chapterId: number;         // Chapter number (1-10)
  order: number;             // Display order (1-50)
  question: string;          // Question text
  choices: string[];         // Array of 4 choices
  correctIndex: number;      // Index of correct answer (0-3)
  category: QuizCategory;    // Question category
}

type QuizCategory = 
  | "vocabulary"   // Vocabulary memorization
  | "grammar"      // Particle and sentence pattern practice
  | "reading"      // Conversation practice
  | "conversation" // JLPT-standard questions
```

### 3. Pattern Data Structure

```typescript
interface PatternExample {
  japanese: string;          // Example sentence in Japanese
  romaji: string;            // Romanized example
  indonesian: string;        // Indonesian translation
}

interface Pattern {
  id: string;                // Unique ID (e.g., "ch01_p01")
  chapterId: number;         // Chapter number (1-10)
  order: number;             // Display order
  pattern: string;           // Pattern template (e.g., "N は N です")
  explanation: string;       // Pattern explanation
  examples: PatternExample[]; // Array of examples
}
```

### 4. Grammar Data Structure

```typescript
interface GrammarExample {
  japanese: string;          // Example sentence in Japanese
  romaji: string;            // Romanized example
  indonesian: string;        // Indonesian translation
}

interface Grammar {
  id: string;                // Unique ID (e.g., "ch01_g01")
  chapterId: number;         // Chapter number (1-10)
  order: number;             // Display order
  title: string;             // Grammar point title
  explanation: string;       // Detailed explanation
  examples: GrammarExample[]; // Array of examples
}
```

### 5. Vocabulary Data Structure (READ-ONLY)

```typescript
interface Vocabulary {
  id: string;                // Unique ID (e.g., "ch01_001")
  chapterId: number;         // Chapter number
  order: number;             // Display order
  kanji: string;             // Kanji form
  kana: string;              // Hiragana/katakana reading
  romaji: string;            // Romanized form
  wordClass: string;         // Word class (nomina, verba, etc.)
  meaning: string;           // Indonesian meaning
}
```

## Data Models

### Furigana Display System

The furigana display system uses a three-layer approach:

1. **Parsing Layer**: `kanjiParser.js` identifies kanji sequences
2. **Matching Layer**: `vocabularyMatcher.js` maps kanji to readings
3. **Rendering Layer**: `conversation.js` generates ruby HTML tags

#### Furigana Generation Flow

```
Input: japanese="私は学生です", hiragana="わたしはがくせいです"
                    │
                    ▼
         ┌──────────────────────┐
         │   parseKanjiSegments │
         └──────────────────────┘
                    │
                    ▼
    [{ text: "私", isKanji: true },
     { text: "は", isKanji: false },
     { text: "学生", isKanji: true },
     { text: "です", isKanji: false }]
                    │
                    ▼
         ┌──────────────────────┐
         │ matchKanjiToHiragana │
         └──────────────────────┘
                    │
                    ▼
    Map { "私" => "わたし", "学生" => "がくせい" }
                    │
                    ▼
         ┌──────────────────────┐
         │   generateRubyText   │
         └──────────────────────┘
                    │
                    ▼
Output: <ruby>私<rt>わたし</rt></ruby>は<ruby>学生<rt>がくせい</rt></ruby>です
```

### Quiz Generation System

#### Quiz Distribution Strategy

For each chapter, generate 50 questions distributed as follows:

- **Vocabulary Memorization**: 15 questions (30%)
  - Kanji reading questions
  - Meaning recognition questions
  - Word usage questions

- **Grammar/Particle Practice**: 15 questions (30%)
  - Particle selection questions
  - Sentence pattern questions
  - Grammar point application

- **Reading/Conversation**: 10 questions (20%)
  - Conversation comprehension
  - Context-based questions
  - Dialogue completion

- **JLPT-Standard**: 10 questions (20%)
  - Mixed format questions
  - Application questions
  - Comprehensive understanding

#### Progressive Learning Implementation

```
Chapter 1: Material from Chapter 1 only
Chapter 2: Material from Chapters 1-2 (70% Ch2, 30% Ch1)
Chapter 3: Material from Chapters 1-3 (60% Ch3, 30% Ch2, 10% Ch1)
...
Chapter 10: Material from Chapters 1-10 (distributed evenly with emphasis on recent chapters)
```

**Distribution Formula**:
- Current chapter: 50-60% of questions
- Previous 2 chapters: 30-40% of questions
- Earlier chapters: 10-20% of questions (review)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Properties 1.6, 1.7, 3.8 all test vocabulary consistency → Combine into Property 1
- Properties 1.9, 2.7, 3.10, 7.1-7.10 all test vocabulary immutability → Combine into Property 2
- Properties 2.4, 2.5 both test conversation field validation → Combine into Property 4
- Properties 3.3, 3.4, 10.1-10.10 all test progressive learning → Combine into Property 7

### Property 1: Vocabulary Consistency in Furigana

*For any* conversation text containing kanji that exists in the chapter's vocabulary dataset, the generated furigana reading SHALL match the kana field from the vocabulary entry exactly.

**Validates: Requirements 1.6, 1.7, 3.8**

### Property 2: Vocabulary Dataset Immutability

*For any* operation (furigana generation, conversation validation, quiz generation), the vocabulary dataset SHALL remain completely unchanged before and after the operation.

**Validates: Requirements 1.9, 2.7, 3.10, 7.1-7.10**

### Property 3: Non-Kanji Text Has No Furigana

*For any* Japanese text composed entirely of hiragana, katakana, or punctuation (no kanji characters), the generated output SHALL NOT contain any ruby tags, regardless of display mode.

**Validates: Requirements 1.3, 1.5**

### Property 4: Conversation Data Completeness

*For any* conversation turn in chapters 1-10, all required fields (speaker, japanese, romaji, indonesian, hiragana) SHALL be present and non-empty strings.

**Validates: Requirements 2.4, 2.5**

### Property 5: Kanji Display Mode Behavior

*For any* conversation text containing kanji, when display mode is 'kanji', the rendered output SHALL contain the kanji characters without ruby tags.

**Validates: Requirements 1.2**

### Property 6: Furigana Display Mode Behavior

*For any* conversation text containing kanji, when display mode is 'hiragana', the rendered output SHALL contain ruby tags with kanji as base text and hiragana readings in rt elements.

**Validates: Requirements 1.4**

### Property 7: Progressive Learning Coverage

*For any* chapter N where N > 1, the quiz questions SHALL include vocabulary from all chapters 1 through N, with at least one question referencing material from each previous chapter.

**Validates: Requirements 3.3, 3.4, 10.1-10.10**

### Property 8: Chapter Data Completeness

*For all* chapters 1 through 10, each chapter SHALL have exactly 10 conversations and exactly 50 quiz questions.

**Validates: Requirements 2.1, 3.1**

### Property 9: Quiz Question Structure Validity

*For any* quiz question, it SHALL have exactly 4 choices, a correctIndex between 0-3, and a valid category (vocabulary, grammar, reading, or conversation).

**Validates: Requirements 3.9**

### Property 10: Quiz Category Distribution

*For any* chapter's quiz questions, all four categories (vocabulary, grammar, reading, conversation) SHALL be represented, with at least 10 questions in each category.

**Validates: Requirements 3.5, 9.1-9.10**

### Property 11: Unknown Kanji Handling

*For any* kanji sequence that does not exist in the vocabulary dataset, the system SHALL display the kanji without furigana and log a warning message.

**Validates: Requirements 1.8**

### Property 12: Invalid Data Error Handling

*For any* conversation or quiz entry with missing required fields, the system SHALL skip that entry and log an error message.

**Validates: Requirements 2.6**

### Property 13: JSON Schema Consistency

*For all* chapters 1-10, the JSON structure SHALL conform to the defined schema with correct field names and types for conversations, quiz, patterns, and grammar sections.

**Validates: Requirements 6.1, 6.2-6.6**

## Error Handling

### Error Categories

1. **Data Validation Errors**
   - Missing required fields
   - Invalid field types
   - Out-of-range values
   - **Action**: Log error, skip invalid entry, continue processing

2. **Furigana Matching Errors**
   - Kanji not found in vocabulary
   - Ambiguous kanji sequences
   - **Action**: Log warning, display kanji without furigana

3. **Performance Errors**
   - Display mode toggle exceeds 200ms
   - Furigana generation exceeds 100ms per turn
   - **Action**: Log performance warning, continue operation

4. **System Errors**
   - JSON parse failures
   - Module loading failures
   - **Action**: Display user-friendly error message, halt operation

### Error Handling Strategy

```javascript
// Example error handling pattern
function validateConversation(conversation) {
  try {
    if (!conversation || typeof conversation !== 'object') {
      throw new ValidationError('Invalid conversation: not an object');
    }
    
    if (!conversation.id || typeof conversation.id !== 'string') {
      throw new ValidationError('Invalid conversation: missing or invalid id');
    }
    
    // ... more validation
    
    return true;
  } catch (error) {
    console.error('Conversation validation failed:', error.message, conversation);
    return false;
  }
}
```

### Error Messages

- **User-Facing**: Simple, actionable messages in Indonesian
  - "Gagal memuat data percakapan" (Failed to load conversation data)
  - "Data percakapan tidak valid" (Invalid conversation data)
  
- **Developer-Facing**: Detailed error logs with context
  - "Invalid conversation: missing required field 'speaker' in conversation ch01_conv01"
  - "Kanji sequence '漢字' not found in chapter 1 vocabulary dataset"

## Testing Strategy

### Testing Approach

This feature uses a **dual testing approach**:

1. **Unit Tests**: Verify specific examples, edge cases, and error conditions
2. **Property-Based Tests**: Verify universal properties across all inputs

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: `Feature: minna-no-nihongo-chapter-1-10-enhancement, Property {number}: {property_text}`

**Example Property Test**:

```javascript
import fc from 'fast-check';

// Feature: minna-no-nihongo-chapter-1-10-enhancement, Property 3: Non-Kanji Text Has No Furigana
test('Property 3: Non-kanji text has no furigana', () => {
  fc.assert(
    fc.property(
      fc.string().filter(s => !containsKanji(s)), // Generate non-kanji strings
      (text) => {
        const result = generateRubyText(text, text);
        expect(result).not.toContain('<ruby>');
        expect(result).not.toContain('<rt>');
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Focus Areas**:
- Specific examples demonstrating correct behavior
- Edge cases (empty strings, special characters, mixed scripts)
- Error conditions (invalid data, missing fields)
- Integration points between components

**Example Unit Test**:

```javascript
// Unit test for specific example
test('Default display mode is kanji', () => {
  const manager = new DisplayModeManager();
  expect(manager.getMode()).toBe('kanji');
});

// Unit test for edge case
test('Empty string generates no furigana', () => {
  const result = generateRubyText('', '');
  expect(result).toBe('');
});
```

### Test Coverage Requirements

- **Unit Tests**: 80% code coverage for new enhancement code
- **Property Tests**: All 13 correctness properties implemented
- **Integration Tests**: End-to-end tests for each module
- **Performance Tests**: Verify rendering speed requirements

### Test Organization

```
tests/
├── unit/
│   ├── kanjiParser.test.js
│   ├── vocabularyMatcher.test.js
│   ├── displayMode.test.js
│   └── conversation.test.js
├── property/
│   ├── furigana.property.test.js
│   ├── vocabulary.property.test.js
│   └── quiz.property.test.js
├── integration/
│   ├── conversation-module.test.js
│   └── quiz-module.test.js
└── performance/
    └── rendering.perf.test.js
```

## Implementation Phases

### Phase 1: Data Preparation (Chapters 1-10)

**Objective**: Create conversation, quiz, pattern, and grammar data for chapters 1-10

**Tasks**:
1. Research Minna no Nihongo 1 textbook content for chapters 1-10
2. Create 10 conversations per chapter aligned with textbook dialogues
3. Create 50 quiz questions per chapter with proper distribution
4. Align patterns and grammar with textbook content
5. Validate all data against existing vocabulary datasets

**Deliverables**:
- Updated ch01.json through ch10.json with complete data
- Data validation report confirming vocabulary consistency

**Success Criteria**:
- All chapters have exactly 10 conversations
- All chapters have exactly 50 quiz questions
- All conversations use only vocabulary from chapter dataset
- All quiz questions properly categorized
- Zero modifications to vocabulary datasets

### Phase 2: Furigana System Enhancement

**Objective**: Ensure furigana toggle works correctly with new conversation data

**Tasks**:
1. Test existing furigana utilities with new conversation data
2. Fix any edge cases in kanji parsing or vocabulary matching
3. Optimize performance for larger conversation datasets
4. Add error handling for unknown kanji sequences

**Deliverables**:
- Enhanced kanjiParser.js (if needed)
- Enhanced vocabularyMatcher.js (if needed)
- Performance optimization report

**Success Criteria**:
- Furigana accuracy ≥ 95%
- Display mode toggle ≤ 200ms
- Furigana generation ≤ 100ms per turn
- Proper error handling for unknown kanji

### Phase 3: Quiz System Enhancement

**Objective**: Implement progressive learning and category distribution

**Tasks**:
1. Validate quiz data structure for all chapters
2. Verify category distribution meets requirements
3. Test progressive learning (chapters 2-10 include previous material)
4. Add furigana to vocabulary and conversation category questions

**Deliverables**:
- Quiz validation report
- Category distribution analysis
- Progressive learning verification

**Success Criteria**:
- All chapters have 50 questions
- All 4 categories represented in each chapter
- Chapters 2-10 include material from previous chapters
- Vocabulary/conversation questions display furigana

### Phase 4: Testing and Validation

**Objective**: Comprehensive testing of all enhancements

**Tasks**:
1. Write and run unit tests for all utilities
2. Write and run property-based tests for all properties
3. Perform integration testing for all modules
4. Conduct performance testing
5. Manual review of content quality and textbook alignment

**Deliverables**:
- Complete test suite with ≥80% coverage
- Test execution report
- Performance benchmark report
- Content quality review report

**Success Criteria**:
- All unit tests pass
- All property tests pass (100 iterations each)
- Performance requirements met
- No critical bugs identified

### Phase 5: Documentation and Deployment

**Objective**: Document changes and deploy to production

**Tasks**:
1. Update README with new features
2. Document data structure changes
3. Create user guide for furigana toggle
4. Create developer guide for adding new chapters
5. Deploy to production environment

**Deliverables**:
- Updated documentation
- User guide
- Developer guide
- Production deployment

**Success Criteria**:
- All documentation complete and accurate
- Successful production deployment
- Zero critical issues in first 24 hours

## Technical Specifications

### File Structure

```
data/
├── ch01.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch02.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch03.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch04.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch05.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch06.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch07.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch08.json  (Enhanced with 10 conversations, 50 quiz questions)
├── ch09.json  (Enhanced with 10 conversations, 50 quiz questions)
└── ch10.json  (Enhanced with 10 conversations, 50 quiz questions)

js/
├── modules/
│   ├── conversation.js  (Already implements furigana toggle)
│   ├── quiz.js          (Already implements quiz rendering)
│   ├── pattern.js       (Already implements pattern display)
│   └── grammar.js       (Already implements grammar display)
├── utils/
│   ├── kanjiParser.js       (Already implements kanji parsing)
│   ├── vocabularyMatcher.js (Already implements vocabulary matching)
│   ├── displayMode.js       (Already implements mode management)
│   └── furiganaUtils.js     (Already loads utilities globally)
└── app.js

tests/
├── unit/
│   ├── kanjiParser.test.js
│   ├── vocabularyMatcher.test.js
│   ├── displayMode.test.js
│   └── conversation.test.js
├── property/
│   ├── furigana.property.test.js
│   ├── vocabulary.property.test.js
│   └── quiz.property.test.js
└── integration/
    ├── conversation-module.test.js
    └── quiz-module.test.js
```

### Performance Requirements

| Operation | Requirement | Measurement Method |
|-----------|-------------|-------------------|
| Conversation initial load | ≤ 500ms | Time from data fetch to first render |
| Display mode toggle | ≤ 200ms | Time from button click to UI update |
| Furigana generation per turn | ≤ 100ms | Time to process one conversation turn |
| Quiz question load | ≤ 300ms | Time to render first question |
| Quiz navigation | ≤ 100ms | Time to render next question |

### Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Ruby Tag Support**: All modern browsers support `<ruby>` and `<rt>` tags
- **LocalStorage**: Required for display mode persistence

### Accessibility Requirements

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: ARIA labels for furigana toggle button
- **Focus Indicators**: Visible focus states for all interactive elements
- **Color Contrast**: WCAG 2.1 Level AA compliance
- **Text Scaling**: Support up to 200% text scaling

### Data Validation Rules

1. **Conversation Validation**
   - Required fields: id, chapterId, order, title, turns
   - turns must be non-empty array
   - Each turn must have: speaker, japanese, romaji, indonesian, hiragana
   - chapterId must match chapter number
   - order must be 1-10

2. **Quiz Validation**
   - Required fields: id, chapterId, order, question, choices, correctIndex, category
   - choices must have exactly 4 elements
   - correctIndex must be 0-3
   - category must be: vocabulary, grammar, reading, or conversation
   - chapterId must match chapter number
   - order must be 1-50

3. **Pattern Validation**
   - Required fields: id, chapterId, order, pattern, explanation, examples
   - examples must be non-empty array
   - Each example must have: japanese, romaji, indonesian

4. **Grammar Validation**
   - Required fields: id, chapterId, order, title, explanation, examples
   - examples must be non-empty array
   - Each example must have: japanese, romaji, indonesian

5. **Vocabulary Integrity**
   - Vocabulary entries MUST NOT be modified
   - All vocabulary references must use existing entries
   - Vocabulary order must remain unchanged

## Content Creation Guidelines

### Conversation Creation

**Source**: Minna no Nihongo 1 textbook conversation sections

**Guidelines**:
1. Use authentic dialogue patterns from the textbook
2. Ensure all vocabulary exists in chapter vocabulary dataset
3. Include natural conversation flow with appropriate speakers
4. Provide accurate romaji and Indonesian translations
5. Ensure hiragana field matches japanese field exactly (for furigana matching)

**Example**:
```json
{
  "id": "ch01_conv01",
  "chapterId": 1,
  "order": 1,
  "title": "Percakapan 1 — Perkenalan Diri",
  "turns": [
    {
      "speaker": "ミラー",
      "japanese": "はじめまして。わたしは マイク・ミラーです。",
      "romaji": "Hajimemashite. Watashi wa Maiku Miraa desu.",
      "indonesian": "Salam perkenalan. Saya Mike Miller.",
      "hiragana": "はじめまして。わたしは マイク・ミラーです。"
    }
  ]
}
```

### Quiz Question Creation

**Distribution per Chapter**:
- Vocabulary: 15 questions (30%)
- Grammar: 15 questions (30%)
- Reading: 10 questions (20%)
- Conversation: 10 questions (20%)

**Question Types**:

1. **Vocabulary Questions**
   - Kanji reading: "Bagaimana cara membaca kanji '私'?"
   - Meaning: "Apa arti kata 'わたし'?"
   - Usage: "Pilih kata yang tepat: わたしは ___です。"

2. **Grammar Questions**
   - Particle selection: "Pilih partikel yang tepat: わたし___ がくせいです。"
   - Pattern application: "Pola grammar apa yang digunakan dalam 'わたしは マイクです'?"
   - Sentence completion: "Lengkapi kalimat: わたしは せんせい___ ありません。"

3. **Reading Questions**
   - Comprehension: Provide short text, ask comprehension question
   - Context: "わたしは マイク・ミラーです。アメリカじんです。\n\nミラーさんは なにじんですか。"

4. **Conversation Questions**
   - Dialogue completion
   - Appropriate response selection
   - Context-based understanding

**Progressive Learning**:
- Chapter 1: 100% Chapter 1 material
- Chapter 2: 70% Chapter 2, 30% Chapter 1
- Chapter 3: 60% Chapter 3, 30% Chapter 2, 10% Chapter 1
- Continue pattern for chapters 4-10

### Pattern and Grammar Creation

**Source**: Minna no Nihongo 1 textbook grammar sections

**Guidelines**:
1. Use exact pattern notation from textbook (e.g., "N は N です")
2. Provide clear explanations in Indonesian
3. Include 2-3 examples per pattern/grammar point
4. Ensure examples use vocabulary from current or previous chapters
5. Maintain consistency with textbook terminology

## Deployment Strategy

### Pre-Deployment Checklist

- [ ] All chapter JSON files validated
- [ ] All unit tests passing
- [ ] All property tests passing (100 iterations each)
- [ ] Performance benchmarks met
- [ ] Accessibility requirements verified
- [ ] Documentation complete
- [ ] Code review completed

### Deployment Steps

1. **Backup Current Data**
   - Create backup of all ch01.json - ch10.json files
   - Store backup with timestamp

2. **Deploy Enhanced Data**
   - Replace ch01.json - ch10.json with enhanced versions
   - Verify file integrity

3. **Verify Deployment**
   - Test conversation module with furigana toggle
   - Test quiz module with all categories
   - Test pattern and grammar modules
   - Verify performance requirements

4. **Monitor**
   - Monitor error logs for 24 hours
   - Track user feedback
   - Monitor performance metrics

### Rollback Plan

If critical issues are discovered:
1. Restore backup JSON files
2. Clear browser caches
3. Notify users of temporary rollback
4. Fix issues in development environment
5. Re-deploy after verification

## Success Metrics

### Quantitative Metrics

1. **Data Completeness**
   - 100% of chapters 1-10 have exactly 10 conversations
   - 100% of chapters 1-10 have exactly 50 quiz questions
   - 0 modifications to vocabulary datasets

2. **Furigana Accuracy**
   - ≥ 95% correct kanji-hiragana matching
   - ≤ 5% unknown kanji warnings

3. **Performance**
   - Conversation rendering ≤ 500ms
   - Display mode toggle ≤ 200ms
   - Furigana generation ≤ 100ms per turn
   - Quiz rendering ≤ 300ms

4. **Quality**
   - Code coverage ≥ 80%
   - 0 critical bugs in production
   - WCAG 2.1 Level AA compliance

### Qualitative Metrics

1. **Content Quality**
   - All conversations align with Minna no Nihongo 1 textbook
   - All quiz questions follow JLPT standards
   - All grammar/patterns match textbook content

2. **User Experience**
   - Furigana toggle is intuitive and responsive
   - Quiz questions are clear and well-formatted
   - Error messages are helpful and actionable

3. **Developer Experience**
   - Code is well-documented
   - Data structure is consistent and maintainable
   - Adding new chapters is straightforward

## Maintenance and Future Enhancements

### Maintenance Tasks

1. **Regular Data Validation**
   - Monthly validation of all chapter data
   - Verify vocabulary consistency
   - Check for data corruption

2. **Performance Monitoring**
   - Track rendering performance metrics
   - Identify and optimize slow operations
   - Monitor memory usage

3. **Content Updates**
   - Review and update conversations based on user feedback
   - Refine quiz questions for clarity
   - Improve grammar explanations

### Future Enhancement Opportunities

1. **Chapters 11-25**
   - Extend enhancement to remaining chapters
   - Follow same methodology and standards

2. **Advanced Furigana Features**
   - User preference for furigana display (always, hover, toggle)
   - Selective furigana (only for difficult kanji)
   - Furigana in quiz questions

3. **Quiz Enhancements**
   - Adaptive difficulty based on user performance
   - Spaced repetition algorithm
   - Custom quiz generation

4. **Analytics**
   - Track user progress through chapters
   - Identify difficult vocabulary/grammar points
   - Personalized learning recommendations

## Conclusion

This design document provides a comprehensive technical specification for enhancing the Minna no Nihongo flashcard application for chapters 1-10. The enhancement focuses on three main areas: conversations with furigana toggle, comprehensive quiz system, and material alignment with the textbook.

Key design principles include:
- **Data Integrity**: Never modify vocabulary datasets
- **Consistency**: All content aligns with existing vocabulary
- **Reusability**: Leverage existing utilities and modules
- **Automation**: Full automation without manual intervention
- **Quality**: Textbook-aligned content with comprehensive testing

The implementation follows a phased approach with clear success criteria and validation at each stage. The design ensures maintainability, scalability, and adherence to web standards and accessibility guidelines.