# Developer Guide - Minna no Nihongo Flashcard

This guide provides comprehensive instructions for developers who want to extend the application, add new chapters (11-25), or contribute to the project.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Adding New Chapters (11-25)](#adding-new-chapters-11-25)
4. [Creating Conversations](#creating-conversations)
5. [Creating Quiz Questions](#creating-quiz-questions)
6. [Testing Your Changes](#testing-your-changes)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Code Style Guidelines](#code-style-guidelines)

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Basic knowledge of JavaScript ES6 modules
- Familiarity with JSON data structures
- Access to Minna no Nihongo 1 textbook (for content alignment)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd minna-no-nihongo-flashcard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Open in browser:**
   - Open `index.html` in your browser
   - Or use a local server: `npx serve .`

### Project Structure

```
minna-no-nihongo-flashcard/
├── data/                      # Chapter JSON files
│   ├── ch01.json             # Chapter 1 data
│   ├── ch02.json             # Chapter 2 data
│   └── ...
├── js/
│   ├── app.js                # Main application entry
│   ├── data.js               # Data loading utilities
│   ├── modules/              # Feature modules
│   │   ├── conversation.js   # Conversation module
│   │   ├── quiz.js           # Quiz module
│   │   ├── flashcard.js      # Flashcard module
│   │   ├── pattern.js        # Pattern module
│   │   └── grammar.js        # Grammar module
│   ├── utils/                # Utility functions
│   │   ├── kanjiParser.js    # Kanji parsing
│   │   ├── vocabularyMatcher.js # Vocabulary matching
│   │   ├── displayMode.js    # Display mode management
│   │   ├── furiganaUtils.js  # Furigana utilities loader
│   │   └── validation.js     # Data validation
│   └── pages/                # Page components
│       ├── chapterList.js    # Chapter list page
│       └── chapterDetail.js  # Chapter detail page
├── index.html                # Main HTML file
├── package.json              # NPM dependencies
└── README.md                 # User documentation
```

---

## Project Architecture

### Module System

The application uses **ES6 modules** for code organization:

```javascript
// Importing a module
import { renderConversation } from './modules/conversation.js';

// Exporting from a module
export { renderConversation };
```

### Data Flow

```
JSON Files (data/chXX.json)
    ↓
Data Loading (data.js)
    ↓
Module Rendering (modules/*.js)
    ↓
DOM Updates (index.html)
```

### Key Utilities

1. **kanjiParser.js**: Identifies kanji sequences in Japanese text
2. **vocabularyMatcher.js**: Matches kanji with hiragana readings
3. **displayMode.js**: Manages kanji/hiragana display mode
4. **validation.js**: Validates data structure integrity

---

## Adding New Chapters (11-25)

### Step 1: Create Chapter JSON File

Create a new file `data/chXX.json` (replace XX with chapter number):

```json
{
  "chapter": {
    "id": 11,
    "title": "Chapter Title in Japanese",
    "titleRomaji": "Chapter Title in Romaji",
    "titleId": "Chapter Title in Indonesian"
  },
  "vocabulary": [],
  "conversations": [],
  "quiz": [],
  "patterns": [],
  "grammar": []
}
```

### Step 2: Add Vocabulary Data

**⚠️ CRITICAL: Follow the exact structure from existing chapters.**

```json
{
  "id": "ch11_001",
  "chapterId": 11,
  "order": 1,
  "kanji": "食べる",
  "kana": "たべる",
  "romaji": "taberu",
  "wordClass": "verba",
  "meaning": "makan"
}
```

**Important:**
- Use sequential IDs: `ch11_001`, `ch11_002`, etc.
- `chapterId` must match the chapter number
- `order` must be sequential starting from 1
- All fields are required

### Step 3: Add Conversations (10 per chapter)

See [Creating Conversations](#creating-conversations) section below.

### Step 4: Add Quiz Questions (50 per chapter)

See [Creating Quiz Questions](#creating-quiz-questions) section below.

### Step 5: Add Patterns and Grammar

Follow the structure from existing chapters:

**Pattern Example:**
```json
{
  "id": "ch11_p01",
  "chapterId": 11,
  "order": 1,
  "pattern": "V-ます",
  "explanation": "Bentuk sopan dari verba",
  "examples": [
    {
      "japanese": "わたしは ごはんを たべます。",
      "romaji": "Watashi wa gohan wo tabemasu.",
      "indonesian": "Saya makan nasi."
    }
  ]
}
```

### Step 6: Update chapters.json

Add the new chapter to `data/chapters.json`:

```json
{
  "chapters": [
    { "id": 1, "title": "..." },
    ...
    { "id": 11, "title": "New Chapter Title" }
  ]
}
```

### Step 7: Validate Your Data

Run validation scripts:

```bash
# Validate data structure
node js/utils/validation.js

# Check progressive learning
node analyze-progressive-learning.js

# Check quiz category distribution
node analyze-quiz-categories.js
```

### Step 8: Test in Browser

1. Open `index.html` in browser
2. Navigate to the new chapter
3. Test all modules:
   - Kotoba (vocabulary list)
   - Percakapan (conversations with furigana toggle)
   - Pola Kalimat (patterns)
   - Materi (grammar)
   - Flashcard
   - Kuis (quiz)

---

## Creating Conversations

### Guidelines

1. **Source Material**: Use dialogues from Minna no Nihongo 1 textbook
2. **Vocabulary Constraint**: Only use vocabulary from the chapter's vocabulary dataset
3. **Quantity**: Create exactly 10 conversations per chapter
4. **Alignment**: Ensure `hiragana` field matches `japanese` field exactly

### Step-by-Step Process

#### 1. Research Textbook Content

Open Minna no Nihongo 1 textbook to the target chapter and identify:
- Main dialogue sections
- Key vocabulary used
- Grammar patterns demonstrated

#### 2. Create Conversation Structure

```json
{
  "id": "ch11_conv01",
  "chapterId": 11,
  "order": 1,
  "title": "Percakapan 1 — [Topic in Indonesian]",
  "turns": []
}
```

#### 3. Add Conversation Turns

For each line of dialogue:

```json
{
  "speaker": "ミラー",
  "japanese": "わたしは ごはんを たべます。",
  "romaji": "Watashi wa gohan wo tabemasu.",
  "indonesian": "Saya makan nasi.",
  "hiragana": "わたしは ごはんを たべます。"
}
```

**Critical: Hiragana Field**

The `hiragana` field must match the `japanese` field exactly for furigana to work:

```javascript
// CORRECT ✅
japanese:  "私は学生です。"
hiragana:  "わたしはがくせいです。"

// WRONG ❌ (spaces don't match)
japanese:  "私は学生です。"
hiragana:  "わたし は がくせい です。"

// WRONG ❌ (missing particles)
japanese:  "私は学生です。"
hiragana:  "わたしがくせいです。"
```

#### 4. Verify Vocabulary Usage

Check that all kanji used exist in the chapter's vocabulary:

```bash
# Extract kanji from conversation
grep -o '[\u4e00-\u9faf]' data/ch11.json

# Compare with vocabulary kanji field
```

#### 5. Test Furigana Display

1. Open the chapter in browser
2. Toggle furigana mode
3. Verify all kanji have correct hiragana readings
4. Check for any warnings in browser console

### Common Mistakes to Avoid

❌ **Using vocabulary from future chapters**
```json
// Chapter 11 conversation using Chapter 15 vocabulary
"japanese": "映画を見ました。"  // 映画 is from Chapter 15
```

❌ **Mismatched hiragana field**
```json
"japanese": "私は学生です。",
"hiragana": "わたし は がくせい です。"  // Extra spaces!
```

❌ **Missing required fields**
```json
{
  "speaker": "ミラー",
  "japanese": "こんにちは。"
  // Missing: romaji, indonesian, hiragana
}
```

### Conversation Quality Checklist

- [ ] Exactly 10 conversations per chapter
- [ ] All conversations have unique IDs (`ch11_conv01` through `ch11_conv10`)
- [ ] All required fields present in each turn
- [ ] `hiragana` field matches `japanese` field exactly
- [ ] All kanji exist in chapter vocabulary
- [ ] Romaji is accurate
- [ ] Indonesian translation is natural and accurate
- [ ] Content aligns with textbook dialogues
- [ ] Furigana displays correctly in browser

---

## Creating Quiz Questions

### Distribution Requirements

Each chapter must have **exactly 50 questions** distributed as follows:

| Category | Count | Percentage |
|----------|-------|------------|
| vocabulary | 15 | 30% |
| grammar | 15 | 30% |
| reading | 10 | 20% |
| conversation | 10 | 20% |

### Progressive Learning

For chapters 2+, include material from previous chapters:

| Chapter | Current Chapter | Previous Chapters |
|---------|----------------|-------------------|
| 2 | 70% (35 questions) | 30% (15 questions) |
| 3 | 60% (30 questions) | 40% (20 questions) |
| 4-10 | 50-60% | 40-50% |
| 11+ | 50-60% | 40-50% |

### Question Types

#### 1. Vocabulary Questions (15 questions)

**Type A: Kanji Reading**
```json
{
  "id": "ch11_q01",
  "chapterId": 11,
  "order": 1,
  "question": "Bagaimana cara membaca kanji '<ruby>食<rt>た</rt></ruby>べる'?",
  "choices": ["のむ", "たべる", "かう", "よむ"],
  "correctIndex": 1,
  "category": "vocabulary"
}
```

**Type B: Meaning Recognition**
```json
{
  "id": "ch11_q02",
  "chapterId": 11,
  "order": 2,
  "question": "Apa arti kata 'たべる'?",
  "choices": ["minum", "makan", "membeli", "membaca"],
  "correctIndex": 1,
  "category": "vocabulary"
}
```

**Type C: Word Usage**
```json
{
  "id": "ch11_q03",
  "chapterId": 11,
  "order": 3,
  "question": "Pilih kata yang tepat: わたしは ごはんを ___。",
  "choices": ["たべます", "のみます", "かいます", "よみます"],
  "correctIndex": 0,
  "category": "vocabulary"
}
```

#### 2. Grammar Questions (15 questions)

**Type A: Particle Selection**
```json
{
  "id": "ch11_q16",
  "chapterId": 11,
  "order": 16,
  "question": "Pilih partikel yang tepat: わたしは ごはん___ たべます。",
  "choices": ["が", "を", "は", "に"],
  "correctIndex": 1,
  "category": "grammar"
}
```

**Type B: Pattern Application**
```json
{
  "id": "ch11_q17",
  "chapterId": 11,
  "order": 17,
  "question": "Pola grammar apa yang digunakan dalam 'わたしは ごはんを たべます'?",
  "choices": ["N は N です", "N を V-ます", "N が あります", "N に います"],
  "correctIndex": 1,
  "category": "grammar"
}
```

**Type C: Sentence Completion**
```json
{
  "id": "ch11_q18",
  "chapterId": 11,
  "order": 18,
  "question": "Lengkapi kalimat: わたしは まいにち ごはん___ たべます。",
  "choices": ["が", "を", "は", "で"],
  "correctIndex": 1,
  "category": "grammar"
}
```

#### 3. Reading Questions (10 questions)

Provide short text and ask comprehension questions:

```json
{
  "id": "ch11_q31",
  "chapterId": 11,
  "order": 31,
  "question": "わたしは まいにち ごはんを たべます。あさごはんは パンを たべます。\n\nあさごはんに なにを たべますか。",
  "choices": ["ごはん", "パン", "ラーメン", "すし"],
  "correctIndex": 1,
  "category": "reading"
}
```

#### 4. Conversation Questions (10 questions)

JLPT-standard format questions:

```json
{
  "id": "ch11_q41",
  "chapterId": 11,
  "order": 41,
  "question": "A: なにを たべますか。\nB: ___\n\nBの こたえは？",
  "choices": [
    "はい、たべます。",
    "ごはんを たべます。",
    "いいえ、たべません。",
    "たべました。"
  ],
  "correctIndex": 1,
  "category": "conversation"
}
```

### Adding Furigana to Questions

For vocabulary and conversation categories, use HTML ruby tags:

```html
<ruby>食<rt>た</rt></ruby>べる
<ruby>私<rt>わたし</rt></ruby>は<ruby>学生<rt>がくせい</rt></ruby>です。
```

### Quiz Creation Workflow

1. **Plan Distribution**: Decide which 15 questions will be from previous chapters
2. **Create Vocabulary Questions**: 15 questions (12 current + 3 review)
3. **Create Grammar Questions**: 15 questions (12 current + 3 review)
4. **Create Reading Questions**: 10 questions (7 current + 3 review)
5. **Create Conversation Questions**: 10 questions (7 current + 3 review)
6. **Add Furigana**: Add ruby tags to vocabulary/conversation questions
7. **Validate**: Run validation scripts
8. **Test**: Test all questions in browser

### Quiz Quality Checklist

- [ ] Exactly 50 questions per chapter
- [ ] Correct category distribution (15/15/10/10)
- [ ] Progressive learning implemented (review questions from previous chapters)
- [ ] All questions have unique IDs (`ch11_q01` through `ch11_q50`)
- [ ] All questions have exactly 4 choices
- [ ] `correctIndex` is valid (0-3)
- [ ] Furigana added to vocabulary/conversation questions
- [ ] Questions test understanding, not just memorization
- [ ] Indonesian translations are clear and natural
- [ ] All questions tested in browser

---

## Testing Your Changes

### Manual Testing

1. **Visual Inspection**
   - Open chapter in browser
   - Check all modules render correctly
   - Test furigana toggle
   - Complete quiz questions

2. **Console Checks**
   - Open browser DevTools (F12)
   - Check for errors in Console tab
   - Look for validation warnings

3. **Performance Testing**
   - Measure page load time (should be < 500ms)
   - Test furigana toggle speed (should be < 200ms)
   - Check quiz navigation (should be < 100ms)

### Automated Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx vitest run js/modules/conversation.test.js
```

### Validation Scripts

```bash
# Validate all chapter data
node js/utils/validation.js

# Check progressive learning
node analyze-progressive-learning.js

# Check quiz category distribution
node analyze-quiz-categories.js
```

### Expected Output

**Validation Success:**
```
✓ Chapter 11 validation passed
✓ 10 conversations found
✓ 50 quiz questions found
✓ All required fields present
✓ Progressive learning implemented
✓ Category distribution correct
```

**Validation Failure:**
```
✗ Chapter 11 validation failed
✗ Conversation ch11_conv03 missing 'hiragana' field
✗ Quiz question ch11_q15 has invalid correctIndex: 4
✗ Only 45 quiz questions found (expected 50)
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Furigana Not Displaying

**Symptoms:**
- Kanji appears without furigana in hiragana mode
- Console shows "Unknown kanji sequence" warnings

**Causes:**
1. Kanji not in vocabulary dataset
2. Hiragana field doesn't match japanese field
3. Vocabulary matcher can't find reading

**Solutions:**

1. **Check vocabulary dataset:**
   ```bash
   # Search for kanji in vocabulary
   grep "食べる" data/ch11.json
   ```

2. **Verify hiragana field:**
   ```json
   // Make sure these match exactly
   "japanese": "私は学生です。",
   "hiragana": "わたしはがくせいです。"
   ```

3. **Check console for specific errors:**
   ```
   [Vocabulary Matcher] Unknown kanji sequence: "食" (Chapter 11, Conversation ch11_conv01)
   ```

#### Issue 2: Quiz Questions Not Loading

**Symptoms:**
- Quiz module shows "Kuis untuk bab ini belum tersedia"
- Console shows validation errors

**Causes:**
1. Invalid quiz data structure
2. Missing required fields
3. Incorrect correctIndex value

**Solutions:**

1. **Validate quiz structure:**
   ```javascript
   // Check each question has:
   - id (string)
   - chapterId (number)
   - order (number)
   - question (string)
   - choices (array of 4 strings)
   - correctIndex (number 0-3)
   - category (valid category string)
   ```

2. **Check console for specific errors:**
   ```
   [Modul Kuis] Melewati soal ke-15 karena data tidak valid
   ```

3. **Run validation script:**
   ```bash
   node js/utils/validation.js
   ```

#### Issue 3: Progressive Learning Not Working

**Symptoms:**
- All quiz questions are from current chapter only
- No review questions from previous chapters

**Causes:**
1. All questions have same chapterId
2. Distribution not implemented correctly

**Solutions:**

1. **Check question distribution:**
   ```bash
   node analyze-progressive-learning.js
   ```

2. **Verify question chapterIds:**
   ```json
   // Chapter 11 should have questions from chapters 1-11
   { "id": "ch11_q01", "chapterId": 11, ... },  // Current chapter
   { "id": "ch11_q16", "chapterId": 10, ... },  // Review from Ch 10
   { "id": "ch11_q31", "chapterId": 9, ... }    // Review from Ch 9
   ```

#### Issue 4: Performance Issues

**Symptoms:**
- Slow page load
- Laggy furigana toggle
- Slow quiz navigation

**Causes:**
1. Too much data processing
2. Inefficient DOM updates
3. Missing caching

**Solutions:**

1. **Check performance metrics:**
   ```javascript
   // Add to browser console
   performance.mark('start');
   // ... operation ...
   performance.mark('end');
   performance.measure('operation', 'start', 'end');
   console.log(performance.getEntriesByName('operation')[0].duration);
   ```

2. **Enable caching:**
   - Vocabulary cache is automatic
   - Furigana cache is automatic
   - Check console for cache hits

3. **Optimize data:**
   - Remove unnecessary fields
   - Minimize JSON file size
   - Use lazy loading for large datasets

#### Issue 5: Data Validation Errors

**Symptoms:**
- Validation script reports errors
- Data doesn't load in browser

**Common Validation Errors:**

1. **Missing Required Field:**
   ```
   Error: Conversation ch11_conv01 missing required field 'hiragana'
   ```
   **Fix:** Add the missing field to the conversation turn

2. **Invalid Field Type:**
   ```
   Error: Quiz question ch11_q01 has invalid correctIndex type: string (expected number)
   ```
   **Fix:** Change `"correctIndex": "1"` to `"correctIndex": 1`

3. **Out of Range Value:**
   ```
   Error: Quiz question ch11_q01 has correctIndex out of range: 4 (expected 0-3)
   ```
   **Fix:** Change correctIndex to a value between 0-3

4. **Invalid Category:**
   ```
   Error: Quiz question ch11_q01 has invalid category: 'vocab' (expected: vocabulary, grammar, reading, conversation)
   ```
   **Fix:** Use one of the valid category values

#### Issue 6: Textbook Alignment Issues

**Symptoms:**
- Content doesn't match Minna no Nihongo 1
- Vocabulary usage is inconsistent

**Solutions:**

1. **Cross-reference with textbook:**
   - Check dialogue sections
   - Verify vocabulary lists
   - Confirm grammar patterns

2. **Use consistent terminology:**
   - Match particle names (は, を, が, etc.)
   - Use textbook pattern notation (N は N です)
   - Follow textbook example formats

3. **Verify vocabulary scope:**
   - Only use vocabulary from current and previous chapters
   - Don't introduce vocabulary from future chapters
   - Check vocabulary order matches textbook

---

## Code Style Guidelines

### JavaScript Style

```javascript
// Use ES6 modules
import { renderConversation } from './modules/conversation.js';

// Use const/let, not var
const mode = displayModeManager.getMode();
let currentIndex = 0;

// Use arrow functions for callbacks
button.addEventListener('click', () => {
  displayModeManager.toggle();
});

// Use template literals
const message = `Chapter ${chapterId} loaded successfully`;

// Use destructuring
const { correctCount, totalQuestions } = calculateQuizResult(questions, answers);

// Add JSDoc comments for public functions
/**
 * Generate ruby text for furigana display
 * 
 * @param {string} kanjiText - Text with kanji
 * @param {string} hiraganaText - Full hiragana reading
 * @returns {string} HTML string with ruby tags
 */
function generateRubyText(kanjiText, hiraganaText) {
  // ...
}
```

### JSON Style

```json
{
  "id": "ch11_conv01",
  "chapterId": 11,
  "order": 1,
  "title": "Percakapan 1 — Topic",
  "turns": [
    {
      "speaker": "ミラー",
      "japanese": "こんにちは。",
      "romaji": "Konnichiwa.",
      "indonesian": "Halo.",
      "hiragana": "こんにちは。"
    }
  ]
}
```

**JSON Guidelines:**
- Use 2-space indentation
- Use double quotes for strings
- No trailing commas
- Validate JSON before committing

### Naming Conventions

- **Files**: camelCase (`conversation.js`, `kanjiParser.js`)
- **Functions**: camelCase (`renderConversation`, `validateQuizQuestion`)
- **Classes**: PascalCase (`DisplayModeManager`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_MODE`, `STORAGE_KEY`)
- **IDs**: snake_case with prefix (`ch11_conv01`, `ch11_q01`)

### Error Handling

```javascript
// Log detailed errors for developers
console.error('[Module Name] Detailed error message', { context });

// Show user-friendly messages in Indonesian
container.innerHTML = `
  <div class="text-center py-12">
    <p class="text-slate-400 text-sm mb-2">⚠️ Gagal memuat data</p>
    <p class="text-slate-500 text-xs">Silakan coba muat ulang halaman.</p>
  </div>
`;
```

### Comments

```javascript
// Use comments to explain WHY, not WHAT
// Good: Explains reasoning
// Cache vocabulary map to avoid repeated parsing (Requirements: 12.6)
const vocabularyMap = getCachedVocabularyMap(chapterNumber, vocabulary);

// Bad: States the obvious
// Set mode to kanji
const mode = 'kanji';

// Use JSDoc for public APIs
/**
 * Validate conversation data structure
 * 
 * @param {Object} conversation - Conversation object to validate
 * @returns {boolean} True if valid, false otherwise
 * 
 * Requirements: 2.6, 13.4, 13.5
 */
function validateConversation(conversation) {
  // ...
}
```

---

## Contributing

### Pull Request Process

1. **Create a branch:**
   ```bash
   git checkout -b feature/add-chapter-11
   ```

2. **Make your changes:**
   - Add/modify data files
   - Update documentation
   - Add tests if needed

3. **Validate your changes:**
   ```bash
   npm test
   node js/utils/validation.js
   ```

4. **Commit with clear message:**
   ```bash
   git commit -m "Add Chapter 11 data with 10 conversations and 50 quiz questions"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/add-chapter-11
   ```

### Commit Message Guidelines

```
Add Chapter 11 data

- Added 10 conversations aligned with textbook
- Added 50 quiz questions with progressive learning
- Added patterns and grammar explanations
- All validation tests passing
```

---

## Resources

### Documentation
- [README.md](README.md) - User documentation
- [DATA_STRUCTURES.md](DATA_STRUCTURES.md) - Data structure reference
- [Requirements Document](.kiro/specs/minna-no-nihongo-chapter-1-10-enhancement/requirements.md)
- [Design Document](.kiro/specs/minna-no-nihongo-chapter-1-10-enhancement/design.md)

### Tools
- [Vitest](https://vitest.dev/) - Testing framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference

### Textbook
- **Minna no Nihongo 1** by 3A Corporation
- ISBN: 978-4-88319-603-6

---

## Getting Help

### Common Questions

**Q: How do I know which vocabulary to use?**
A: Only use vocabulary from the chapter's vocabulary dataset. Check `data/chXX.json` vocabulary array.

**Q: How do I test furigana accuracy?**
A: Open the chapter in browser, toggle furigana mode, and check console for warnings.

**Q: How many review questions should I include?**
A: For chapters 2+, include 30-40% review questions from previous chapters.

**Q: What if validation fails?**
A: Check the error message, fix the issue, and run validation again. See [Troubleshooting Guide](#troubleshooting-guide).

### Contact

For questions or issues:
1. Check this guide first
2. Search existing issues in the repository
3. Create a new issue with detailed description

---

**Happy Coding! がんばってください！** 🚀
