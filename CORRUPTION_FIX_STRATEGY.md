# Comprehensive Corruption Fix Strategy
## Minna no Nihongo Chapters 1-10

### Current Status
✅ **Chapter Titles Fixed** (Chapters 5, 6, 8, 9, 10)
- All chapter titles now have proper UTF-8 encoding
- Backups created before modifications

### Corruption Summary
- **Total corrupted fields**: 264 across 9 chapters
- **Clean reference**: Chapter 7 (use as structural template)
- **Corrupted chapters**: 1, 2, 3, 4, 5, 6, 8, 9, 10

### Priority Fix Order

#### Priority 1: Conversations (CRITICAL - needed for furigana feature)
**Affected chapters**: 5, 6, 9, 10
**Corruption type**: UTF-8 encoding issues in japanese, hiragana, and speaker fields

**Fix approach**:
1. Use Chapter 7 conversations as structural reference
2. Rebuild each conversation using vocabulary from chapter's vocabulary dataset
3. Ensure:
   - `japanese` field uses kanji (from vocabulary.kanji)
   - `hiragana` field uses hiragana (from vocabulary.kana)
   - `speaker` field uses proper Japanese names
   - All 10 conversations per chapter

**Example structure** (from Chapter 7):
```json
{
  "id": "ch07_conv01",
  "chapterId": 7,
  "order": 1,
  "title": "Percakapan 1 — Title",
  "turns": [
    {
      "speaker": "やまだ",
      "japanese": "Japanese text with kanji",
      "romaji": "Romanized text",
      "indonesian": "Indonesian translation",
      "hiragana": "Full hiragana reading"
    }
  ]
}
```

#### Priority 2: Grammar & Patterns
**Affected chapters**: 3, 5, 6, 8, 9, 10
**Corruption type**: UTF-8 encoding in titles, explanations, and examples

**Fix approach**:
1. Use Chapter 7 grammar/patterns as reference
2. Rebuild using Minna no Nihongo 1 textbook content
3. Ensure all Japanese text uses proper UTF-8 encoding
4. Verify examples use vocabulary from chapter dataset

#### Priority 3: Quiz Questions
**Affected chapters**: 1, 2, 3, 4, 8
**Corruption type**: UTF-8 encoding in question text

**Fix approach**:
1. Rebuild quiz questions with proper encoding
2. Maintain 50 questions per chapter
3. Distribution: 15 vocabulary, 15 grammar, 10 reading, 10 conversation
4. Include ruby tags for kanji in questions

### Implementation Steps

#### Step 1: Fix Conversations (Chapters 5, 6, 9, 10)
```bash
# Create conversation fix script
node fix-conversations-priority1.cjs
```

#### Step 2: Fix Grammar & Patterns (Chapters 3, 5, 6, 8, 9, 10)
```bash
# Create grammar/pattern fix script
node fix-grammar-patterns-priority2.cjs
```

#### Step 3: Fix Quiz Questions (Chapters 1, 2, 3, 4, 8)
```bash
# Create quiz fix script
node fix-quiz-priority3.cjs
```

#### Step 4: Verify All Fixes
```bash
# Run corruption detection
node detect-all-corruption.cjs
```

### Key Principles

1. **NEVER modify vocabulary datasets** - vocabulary is read-only
2. **Use Chapter 7 as reference** - it's clean and properly structured
3. **Maintain data structure** - follow existing JSON schema exactly
4. **Create backups** - always backup before modifying
5. **UTF-8 encoding** - ensure all Japanese text uses proper UTF-8

### Verification Checklist

After each fix:
- [ ] Run `detect-all-corruption.cjs` to check remaining corruption
- [ ] Verify JSON structure is valid
- [ ] Check that vocabulary dataset is unchanged
- [ ] Test furigana toggle functionality (for conversations)
- [ ] Verify all required fields are present

### Expected Results

After complete fix:
- ✅ 0 corrupted fields
- ✅ All conversations display correctly with furigana toggle
- ✅ All grammar/patterns display properly
- ✅ All quiz questions render correctly
- ✅ Vocabulary datasets remain unchanged

### Manual Verification Points

1. **Conversations**: Open app, navigate to each chapter, toggle furigana on/off
2. **Grammar**: Check that all grammar explanations display properly
3. **Patterns**: Verify pattern examples show correct Japanese text
4. **Quiz**: Test quiz questions display with proper kanji and furigana

### Rollback Plan

If issues occur:
1. Restore from backup files (*.backup-[timestamp])
2. Review error logs
3. Fix issues in development
4. Re-run fix scripts

### Next Actions

1. **Immediate**: Fix conversations (Priority 1) - most critical for furigana feature
2. **Short-term**: Fix grammar & patterns (Priority 2)
3. **Final**: Fix quiz questions (Priority 3)

### Notes

- Chapter 7 is the gold standard - use it as reference for all fixes
- All fixes must preserve the exact data structure
- Vocabulary datasets are sacred - never modify them
- Always create backups before modifications
- Test thoroughly after each fix phase
