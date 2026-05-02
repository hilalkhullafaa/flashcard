# Master Validation Script - Quick Reference Guide

## Overview

The master validation script (`validate-master.js`) provides comprehensive validation of all chapter data for Minna no Nihongo chapters 1-10 in a single execution.

## Quick Start

```bash
# Run validation
node validate-master.js

# Check exit code
echo $?  # Linux/Mac
echo %ERRORLEVEL%  # Windows
```

## What It Validates

### 1. Conversations (Requirements 2.1-2.7, 6.2)
- ✅ Exactly 10 conversations per chapter
- ✅ All required fields present (id, chapterId, order, title, turns)
- ✅ Each turn has: speaker, japanese, romaji, indonesian, hiragana
- ✅ chapterId matches chapter number

### 2. Quiz (Requirements 3.1-3.10, 6.4, 9.1-9.10)
- ✅ Exactly 50 questions per chapter
- ✅ All required fields present (id, chapterId, order, question, choices, correctIndex, category)
- ✅ Exactly 4 choices per question
- ✅ correctIndex in range [0-3]
- ✅ Valid category (vocabulary, grammar, reading, conversation)
- ✅ Minimum 10 questions per category
- ✅ chapterId matches chapter number

### 3. Patterns (Requirements 5.2, 5.4, 6.5)
- ✅ All required fields present (id, chapterId, order, pattern, explanation, examples)
- ✅ Examples array is non-empty
- ✅ Each example has: japanese, romaji, indonesian
- ✅ chapterId matches chapter number

### 4. Grammar (Requirements 5.1, 5.3, 6.6)
- ✅ All required fields present (id, chapterId, order, title, explanation, examples)
- ✅ Examples array is non-empty
- ✅ Each example has: japanese, romaji, indonesian
- ✅ chapterId matches chapter number

### 5. Vocabulary (Requirements 7.1-7.10)
- ✅ Vocabulary array is present
- ✅ Basic structure validation
- ✅ No modifications detected

## Output

### Console Output

```
========================================
  MASTER VALIDATION REPORT
  Minna no Nihongo Chapters 1-10
========================================

Building cumulative vocabulary map...
✓ Vocabulary map built for chapters 1-10

Validating Chapter 1...
✓ Chapter 1 validation complete

[... chapters 2-10 ...]

========================================
  VALIDATION RESULTS
========================================

📊 Overall Statistics:
  Total Conversations: 100
  Total Quiz Questions: 500
  Total Patterns: 35
  Total Grammar: 30
  Total Vocabulary: 595

📈 Quiz Category Distribution:
  Chapter 1:
    vocabulary: 15
    grammar: 15
    reading: 10
    conversation: 10
  [... chapters 2-10 ...]

⚠️  Warnings (if any):
  [List of warnings]

❌ Errors (if any):
  [List of errors]

========================================
  VALIDATION SUMMARY
========================================

✅ ALL VALIDATIONS PASSED!
All chapter data is valid and production-ready.

Validation completed in 0.12s

Detailed report saved to: MASTER_VALIDATION_REPORT.json
```

### JSON Report

File: `MASTER_VALIDATION_REPORT.json`

```json
{
  "timestamp": "2024-...",
  "duration": "0.12s",
  "summary": {
    "totalErrors": 0,
    "totalWarnings": 105,
    "passed": true
  },
  "stats": {
    "totalConversations": 100,
    "totalQuizQuestions": 500,
    "totalPatterns": 35,
    "totalGrammar": 30,
    "totalVocabulary": 595
  },
  "categoryDistribution": {
    "1": { "vocabulary": 15, "grammar": 15, ... },
    ...
  },
  "errors": [],
  "warnings": [...]
}
```

## Exit Codes

- **0**: Validation passed (no errors, warnings are acceptable)
- **1**: Validation failed (errors found, must be fixed)

## Common Use Cases

### 1. Before Deployment

```bash
# Validate all data
node validate-master.js

# Check result
if [ $? -eq 0 ]; then
  echo "✅ Ready to deploy"
else
  echo "❌ Fix errors before deploying"
  exit 1
fi
```

### 2. CI/CD Integration

```yaml
# GitHub Actions example
- name: Validate Chapter Data
  run: node validate-master.js
```

### 3. Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run validation if data files changed
if git diff --cached --name-only | grep -q "^data/ch.*\.json$"; then
  echo "Validating chapter data..."
  node validate-master.js
  if [ $? -ne 0 ]; then
    echo "❌ Validation failed. Commit aborted."
    exit 1
  fi
fi
```

### 4. After Data Modifications

```bash
# After editing chapter data
node validate-master.js

# Review warnings and errors
cat MASTER_VALIDATION_REPORT.json | jq '.errors'
```

## Understanding Results

### ✅ Success (No Errors)

```
✅ ALL VALIDATIONS PASSED!
All chapter data is valid and production-ready.
```

**Action:** Safe to deploy or commit changes.

### ⚠️ Warnings Only

```
⚠️  VALIDATION COMPLETED WITH WARNINGS
No critical errors found, but 105 warnings need review.
```

**Action:** Review warnings, but data is still valid. Common warnings:
- Hiragana field contains katakana (expected for names)
- Empty examples arrays (optional data)

### ❌ Errors Found

```
❌ VALIDATION FAILED
Found 5 errors and 10 warnings.
Please fix the errors before proceeding.
```

**Action:** Fix all errors before deploying. Check:
- Missing required fields
- Incorrect data types
- Invalid values (e.g., correctIndex out of range)
- ChapterId mismatches

## Troubleshooting

### Error: "Failed to load chapter data"

**Cause:** Chapter JSON file is missing or corrupted.

**Solution:**
1. Check if file exists: `data/ch0X.json`
2. Validate JSON syntax: `node -e "JSON.parse(require('fs').readFileSync('data/ch01.json'))"`
3. Restore from backup if needed

### Error: "Missing required field"

**Cause:** Data structure is incomplete.

**Solution:**
1. Check the error message for field name and location
2. Add the missing field to the JSON file
3. Refer to requirements.md for field specifications

### Warning: "Hiragana contains invalid characters"

**Cause:** Hiragana field contains katakana characters (e.g., names).

**Solution:** This is expected and acceptable. Katakana is used for foreign names and loanwords.

## Performance

- **Execution Time:** < 1 second
- **Memory Usage:** < 50MB
- **Chapters Validated:** 10 (ch01.json - ch10.json)
- **Total Validations:** ~1000+ individual checks

## Comparison with Other Scripts

| Feature | validate-chapters.js | validate-master.js |
|---------|---------------------|-------------------|
| Conversations | ✅ | ✅ |
| Quiz | ✅ | ✅ |
| Patterns | ✅ | ✅ |
| Grammar | ✅ | ✅ |
| Vocabulary | ❌ | ✅ |
| Category Distribution | ❌ | ✅ |
| JSON Report | ❌ | ✅ |
| Color Output | ✅ | ✅ |
| Exit Codes | ✅ | ✅ |

**Recommendation:** Use `validate-master.js` for comprehensive validation.

## Best Practices

1. **Run Before Every Commit**
   - Validate data changes before committing
   - Use pre-commit hooks for automation

2. **Include in CI/CD Pipeline**
   - Automated validation on pull requests
   - Block merges if validation fails

3. **Regular Validation**
   - Weekly validation of all data
   - Monthly comprehensive reviews

4. **Review Warnings**
   - Don't ignore warnings
   - Investigate unexpected warnings
   - Document expected warnings

5. **Keep Reports**
   - Archive validation reports
   - Track validation history
   - Monitor data quality trends

## Support

For issues or questions:
1. Check this guide first
2. Review the error messages carefully
3. Consult requirements.md for specifications
4. Check TASK31.1_MASTER_VALIDATION_REPORT.md for details

## Version History

- **v1.0** (2024): Initial release
  - Comprehensive validation for chapters 1-10
  - JSON report generation
  - Color-coded console output
  - Exit code support
