# Data Structures Documentation

This document provides comprehensive documentation for all data structures used in the Minna no Nihongo Flashcard application, with a focus on the enhancements for chapters 1-10.

## Table of Contents
1. [Chapter Data Structure](#chapter-data-structure)
2. [Conversation Data Structure](#conversation-data-structure)
3. [Quiz Data Structure](#quiz-data-structure)
4. [Pattern Data Structure](#pattern-data-structure)
5. [Grammar Data Structure](#grammar-data-structure)
6. [Vocabulary Data Structure](#vocabulary-data-structure)
7. [Validation Rules](#validation-rules)

---

## Chapter Data Structure

Each chapter is stored in a separate JSON file (`ch01.json` through `ch10.json`) with the following top-level structure:

```json
{
  "chapter": { ... },
  "vocabulary": [ ... ],
  "conversations": [ ... ],
  "quiz": [ ... ],
  "patterns": [ ... ],
  "grammar": [ ... ]
}
```

### Chapter Metadata

```typescript
interface ChapterMetadata {
  id: number;              // Chapter number (1-10)
  title: string;           // Chapter title in Japanese
  titleRomaji: string;     // Chapter title in romaji
  titleId: string;         // Chapter title in Indonesian
}
```

**Example:**
```json
{
  "chapter": {
    "id": 1,
    "title": "わたしは マイク・ミラーです",
    "titleRomaji": "Watashi wa Maiku Miraa desu",
    "titleId": "Saya adalah Mike Miller"
  }
}
```

---

## Conversation Data Structure

### Overview
Each chapter contains **exactly 10 conversations** aligned with Minna no Nihongo 1 textbook dialogues. Conversations support furigana toggle functionality.

### TypeScript Interface

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

### Complete Example

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
    },
    {
      "speaker": "サントス",
      "japanese": "はじめまして。わたしは マリア・サントスです。",
      "romaji": "Hajimemashite. Watashi wa Maria Santosu desu.",
      "indonesian": "Salam perkenalan. Saya Maria Santos.",
      "hiragana": "はじめまして。わたしは マリア・サントスです。"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier following pattern `ch{XX}_conv{YY}` |
| `chapterId` | number | ✅ | Must match the chapter number (1-10) |
| `order` | number | ✅ | Display order within chapter (1-10) |
| `title` | string | ✅ | Conversation title in Indonesian |
| `turns` | array | ✅ | Array of conversation turns (minimum 1) |
| `turns[].speaker` | string | ✅ | Speaker name in Japanese |
| `turns[].japanese` | string | ✅ | Japanese text with kanji |
| `turns[].romaji` | string | ✅ | Romanized text |
| `turns[].indonesian` | string | ✅ | Indonesian translation |
| `turns[].hiragana` | string | ✅ | Full hiragana reading (must match japanese field exactly for furigana) |

### Important Notes

1. **Hiragana Field**: The `hiragana` field must match the `japanese` field exactly in terms of character positions. This is critical for accurate furigana generation.

2. **Vocabulary Consistency**: All kanji used in conversations must exist in the chapter's vocabulary dataset to ensure accurate furigana matching.

3. **Speaker Names**: Use Japanese names as they appear in the textbook (e.g., "ミラー", "サントス", "たなか").

---

## Quiz Data Structure

### Overview
Each chapter contains **exactly 50 quiz questions** distributed across 4 categories with progressive learning support.

### TypeScript Interface

```typescript
type QuizCategory = 
  | "vocabulary"   // Vocabulary memorization (15 questions, 30%)
  | "grammar"      // Particle and sentence pattern practice (15 questions, 30%)
  | "reading"      // Conversation practice (10 questions, 20%)
  | "conversation" // JLPT-standard questions (10 questions, 20%)

interface QuizQuestion {
  id: string;                // Unique ID (e.g., "ch01_q01")
  chapterId: number;         // Chapter number (1-10)
  order: number;             // Display order (1-50)
  question: string;          // Question text (may contain HTML ruby tags for furigana)
  choices: string[];         // Array of exactly 4 choices
  correctIndex: number;      // Index of correct answer (0-3)
  category: QuizCategory;    // Question category
}
```

### Complete Example

```json
{
  "id": "ch01_q01",
  "chapterId": 1,
  "order": 1,
  "question": "Bagaimana cara membaca kanji '<ruby>私<rt>わたし</rt></ruby>'?",
  "choices": [
    "あなた",
    "わたし",
    "せんせい",
    "がくせい"
  ],
  "correctIndex": 1,
  "category": "vocabulary"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier following pattern `ch{XX}_q{YY}` |
| `chapterId` | number | ✅ | Must match the chapter number (1-10) |
| `order` | number | ✅ | Display order within chapter (1-50) |
| `question` | string | ✅ | Question text (may contain HTML ruby tags) |
| `choices` | array | ✅ | Array of exactly 4 answer choices |
| `correctIndex` | number | ✅ | Index of correct answer (0-3) |
| `category` | string | ✅ | One of: vocabulary, grammar, reading, conversation |

### Category Distribution

Each chapter must have the following distribution:

| Category | Count | Percentage | Description |
|----------|-------|------------|-------------|
| vocabulary | 15 | 30% | Kanji reading, meaning recognition, word usage |
| grammar | 15 | 30% | Particle selection, sentence patterns, grammar application |
| reading | 10 | 20% | Conversation comprehension, context-based questions |
| conversation | 10 | 20% | JLPT-standard format, mixed questions |

### Progressive Learning

Questions in chapters 2-10 must include material from previous chapters:

| Chapter | Distribution |
|---------|--------------|
| Chapter 1 | 100% Chapter 1 material |
| Chapter 2 | 70% Chapter 2 + 30% Chapter 1 |
| Chapter 3 | 60% Chapter 3 + 30% Chapter 2 + 10% Chapter 1 |
| Chapter 4-10 | Similar distribution with emphasis on current chapter |

### Furigana in Quiz Questions

For vocabulary and conversation categories, use HTML ruby tags to display furigana:

```html
<ruby>私<rt>わたし</rt></ruby>は<ruby>学生<rt>がくせい</rt></ruby>です。
```

---

## Pattern Data Structure

### TypeScript Interface

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
  explanation: string;       // Pattern explanation in Indonesian
  examples: PatternExample[]; // Array of examples (minimum 1)
}
```

### Complete Example

```json
{
  "id": "ch01_p01",
  "chapterId": 1,
  "order": 1,
  "pattern": "N は N です",
  "explanation": "Pola ini digunakan untuk menyatakan identitas atau profesi seseorang.",
  "examples": [
    {
      "japanese": "わたしは がくせいです。",
      "romaji": "Watashi wa gakusei desu.",
      "indonesian": "Saya adalah pelajar."
    },
    {
      "japanese": "ミラーさんは せんせいです。",
      "romaji": "Miraa-san wa sensei desu.",
      "indonesian": "Pak Miller adalah guru."
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier following pattern `ch{XX}_p{YY}` |
| `chapterId` | number | ✅ | Must match the chapter number (1-10) |
| `order` | number | ✅ | Display order within chapter |
| `pattern` | string | ✅ | Pattern template using textbook notation |
| `explanation` | string | ✅ | Pattern explanation in Indonesian |
| `examples` | array | ✅ | Array of example sentences (minimum 1) |
| `examples[].japanese` | string | ✅ | Example sentence in Japanese |
| `examples[].romaji` | string | ✅ | Romanized example |
| `examples[].indonesian` | string | ✅ | Indonesian translation |

---

## Grammar Data Structure

### TypeScript Interface

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
  explanation: string;       // Detailed explanation in Indonesian
  examples: GrammarExample[]; // Array of examples (minimum 1)
}
```

### Complete Example

```json
{
  "id": "ch01_g01",
  "chapterId": 1,
  "order": 1,
  "title": "Partikel は (wa)",
  "explanation": "Partikel は menandai topik kalimat. Topik adalah hal yang sedang dibicarakan.",
  "examples": [
    {
      "japanese": "わたしは がくせいです。",
      "romaji": "Watashi wa gakusei desu.",
      "indonesian": "Saya adalah pelajar."
    },
    {
      "japanese": "これは ほんです。",
      "romaji": "Kore wa hon desu.",
      "indonesian": "Ini adalah buku."
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier following pattern `ch{XX}_g{YY}` |
| `chapterId` | number | ✅ | Must match the chapter number (1-10) |
| `order` | number | ✅ | Display order within chapter |
| `title` | string | ✅ | Grammar point title |
| `explanation` | string | ✅ | Detailed explanation in Indonesian |
| `examples` | array | ✅ | Array of example sentences (minimum 1) |
| `examples[].japanese` | string | ✅ | Example sentence in Japanese |
| `examples[].romaji` | string | ✅ | Romanized example |
| `examples[].indonesian` | string | ✅ | Indonesian translation |

---

## Vocabulary Data Structure

### Overview
**⚠️ CRITICAL: Vocabulary datasets are READ-ONLY and must NEVER be modified.**

### TypeScript Interface

```typescript
interface Vocabulary {
  id: string;                // Unique ID (e.g., "ch01_001")
  chapterId: number;         // Chapter number
  order: number;             // Display order
  kanji: string;             // Kanji form
  kana: string;              // Hiragana/katakana reading
  romaji: string;            // Romanized form
  wordClass: string;         // Word class (nomina, verba, adjektiva, etc.)
  meaning: string;           // Indonesian meaning
}
```

### Complete Example

```json
{
  "id": "ch01_001",
  "chapterId": 1,
  "order": 1,
  "kanji": "私",
  "kana": "わたし",
  "romaji": "watashi",
  "wordClass": "nomina",
  "meaning": "saya"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier following pattern `ch{XX}_{NNN}` |
| `chapterId` | number | ✅ | Chapter number |
| `order` | number | ✅ | Display order within chapter |
| `kanji` | string | ✅ | Kanji form (may be hiragana/katakana for words without kanji) |
| `kana` | string | ✅ | Hiragana or katakana reading |
| `romaji` | string | ✅ | Romanized form |
| `wordClass` | string | ✅ | Word class in Indonesian |
| `meaning` | string | ✅ | Indonesian meaning |

### Important Constraints

1. **READ-ONLY**: Vocabulary entries must NEVER be modified, added, or deleted
2. **Reference Only**: All other data structures must reference existing vocabulary
3. **Order Preservation**: The order of vocabulary entries must remain unchanged
4. **Integrity**: Vocabulary dataset integrity must be validated before and after any operations

---

## Validation Rules

### Conversation Validation

```javascript
function validateConversation(conversation) {
  // Required fields
  if (!conversation.id || typeof conversation.id !== 'string') return false;
  if (!conversation.chapterId || typeof conversation.chapterId !== 'number') return false;
  if (!conversation.order || typeof conversation.order !== 'number') return false;
  if (!conversation.title || typeof conversation.title !== 'string') return false;
  
  // Turns array
  if (!Array.isArray(conversation.turns) || conversation.turns.length === 0) return false;
  
  // Validate each turn
  for (const turn of conversation.turns) {
    if (!turn.speaker || typeof turn.speaker !== 'string') return false;
    if (!turn.japanese || typeof turn.japanese !== 'string') return false;
    if (!turn.romaji || typeof turn.romaji !== 'string') return false;
    if (!turn.indonesian || typeof turn.indonesian !== 'string') return false;
    if (!turn.hiragana || typeof turn.hiragana !== 'string') return false;
  }
  
  return true;
}
```

### Quiz Validation

```javascript
function validateQuizQuestion(question) {
  // Required fields
  if (!question.id || typeof question.id !== 'string') return false;
  if (!question.chapterId || typeof question.chapterId !== 'number') return false;
  if (!question.order || typeof question.order !== 'number') return false;
  if (!question.question || typeof question.question !== 'string') return false;
  
  // Choices array
  if (!Array.isArray(question.choices) || question.choices.length !== 4) return false;
  
  // Correct index
  if (typeof question.correctIndex !== 'number') return false;
  if (question.correctIndex < 0 || question.correctIndex > 3) return false;
  
  // Category
  const validCategories = ['vocabulary', 'grammar', 'reading', 'conversation'];
  if (!validCategories.includes(question.category)) return false;
  
  return true;
}
```

### Pattern Validation

```javascript
function validatePattern(pattern) {
  // Required fields
  if (!pattern.id || typeof pattern.id !== 'string') return false;
  if (!pattern.chapterId || typeof pattern.chapterId !== 'number') return false;
  if (!pattern.order || typeof pattern.order !== 'number') return false;
  if (!pattern.pattern || typeof pattern.pattern !== 'string') return false;
  if (!pattern.explanation || typeof pattern.explanation !== 'string') return false;
  
  // Examples array
  if (!Array.isArray(pattern.examples) || pattern.examples.length === 0) return false;
  
  // Validate each example
  for (const example of pattern.examples) {
    if (!example.japanese || typeof example.japanese !== 'string') return false;
    if (!example.romaji || typeof example.romaji !== 'string') return false;
    if (!example.indonesian || typeof example.indonesian !== 'string') return false;
  }
  
  return true;
}
```

### Grammar Validation

```javascript
function validateGrammar(grammar) {
  // Required fields
  if (!grammar.id || typeof grammar.id !== 'string') return false;
  if (!grammar.chapterId || typeof grammar.chapterId !== 'number') return false;
  if (!grammar.order || typeof grammar.order !== 'number') return false;
  if (!grammar.title || typeof grammar.title !== 'string') return false;
  if (!grammar.explanation || typeof grammar.explanation !== 'string') return false;
  
  // Examples array
  if (!Array.isArray(grammar.examples) || grammar.examples.length === 0) return false;
  
  // Validate each example
  for (const example of grammar.examples) {
    if (!example.japanese || typeof example.japanese !== 'string') return false;
    if (!example.romaji || typeof example.romaji !== 'string') return false;
    if (!example.indonesian || typeof example.indonesian !== 'string') return false;
  }
  
  return true;
}
```

---

## Error Handling

### Invalid Data Handling

When invalid data is encountered:

1. **Log Detailed Error**: Include field name, expected type, actual type, and location
2. **Skip Invalid Entry**: Continue processing valid entries
3. **User-Friendly Message**: Display helpful error message in Indonesian
4. **Graceful Degradation**: Application continues to function with valid data

### Example Error Messages

**Developer-Facing (Console):**
```
[Modul Percakapan] Field 'speaker' tidak ada atau tidak valid. 
ID Percakapan: ch01_conv01, Giliran ke-2, 
Tipe yang diharapkan: string, Tipe yang diterima: undefined
```

**User-Facing (UI):**
```
⚠️ Gagal memuat data percakapan
Data bab tidak valid. Silakan coba muat ulang halaman.
```

---

## Best Practices

### When Creating New Data:

1. **Follow Naming Conventions**: Use consistent ID patterns (`ch{XX}_conv{YY}`, `ch{XX}_q{YY}`, etc.)
2. **Validate Before Saving**: Run validation scripts before committing data
3. **Use Existing Vocabulary**: Only use kanji/words from the chapter's vocabulary dataset
4. **Align with Textbook**: Ensure content matches Minna no Nihongo 1 standards
5. **Test Furigana**: Verify furigana displays correctly for all conversations
6. **Check Progressive Learning**: Ensure quiz questions include material from previous chapters

### When Modifying Data:

1. **Never Modify Vocabulary**: Vocabulary datasets are READ-ONLY
2. **Preserve Structure**: Maintain the exact JSON structure
3. **Validate After Changes**: Run validation to ensure data integrity
4. **Test in Browser**: Verify changes display correctly in the application
5. **Check Performance**: Ensure changes don't impact rendering performance

---

## Tools and Utilities

### Validation Script
```bash
node js/utils/validation.js
```

### Master Validation
```bash
node analyze-progressive-learning.js
```

### Quiz Category Distribution Analysis
```bash
node analyze-quiz-categories.js
```

---

## References

- **Requirements Document**: `.kiro/specs/minna-no-nihongo-chapter-1-10-enhancement/requirements.md`
- **Design Document**: `.kiro/specs/minna-no-nihongo-chapter-1-10-enhancement/design.md`
- **Developer Guide**: `DEVELOPER_GUIDE.md`
- **Minna no Nihongo 1 Textbook**: Official textbook by 3A Corporation

---

**Last Updated**: 2024
**Version**: 1.0.0
