/**
 * Pattern Data Validation Script for Minna no Nihongo Chapters 1-10
 * 
 * This script validates pattern data to ensure:
 * 1. Patterns align with Minna no Nihongo 1 textbook
 * 2. Pattern examples use vocabulary from current or previous chapters
 * 3. All required fields are present and valid
 * 
 * Task: 27.1 - Review existing pattern data
 * Requirements: 5.2, 5.4, 6.5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Load chapter data from JSON file
 */
function loadChapterData(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`${colors.red}Error loading ${filePath}: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Extract all vocabulary words from a chapter
 */
function extractVocabulary(chapterData) {
  if (!chapterData || !chapterData.vocabulary) {
    return new Set();
  }
  
  const vocabSet = new Set();
  chapterData.vocabulary.forEach(entry => {
    if (entry.kanji) vocabSet.add(entry.kanji);
    if (entry.kana) vocabSet.add(entry.kana);
    if (entry.romaji) vocabSet.add(entry.romaji);
  });
  
  return vocabSet;
}

/**
 * Build cumulative vocabulary map for chapters 1 through N
 */
function buildCumulativeVocabulary(maxChapter) {
  const cumulativeVocab = {};
  
  for (let i = 1; i <= maxChapter; i++) {
    const chapterData = loadChapterData(i);
    if (!chapterData) continue;
    
    const vocabSet = new Set();
    
    // Add all previous chapters' vocabulary
    for (let j = 1; j <= i; j++) {
      const prevChapterData = loadChapterData(j);
      if (prevChapterData) {
        const prevVocab = extractVocabulary(prevChapterData);
        prevVocab.forEach(word => vocabSet.add(word));
      }
    }
    
    cumulativeVocab[i] = vocabSet;
  }
  
  return cumulativeVocab;
}

/**
 * Validate pattern data structure
 */
function validatePatternStructure(pattern, chapterNum) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  const requiredFields = ['id', 'chapterId', 'order', 'pattern', 'explanation', 'examples'];
  requiredFields.forEach(field => {
    if (!pattern[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate field types
  if (pattern.id && typeof pattern.id !== 'string') {
    errors.push(`Invalid type for 'id': expected string, got ${typeof pattern.id}`);
  }
  
  if (pattern.chapterId && typeof pattern.chapterId !== 'number') {
    errors.push(`Invalid type for 'chapterId': expected number, got ${typeof pattern.chapterId}`);
  }
  
  if (pattern.order && typeof pattern.order !== 'number') {
    errors.push(`Invalid type for 'order': expected number, got ${typeof pattern.order}`);
  }
  
  if (pattern.pattern && typeof pattern.pattern !== 'string') {
    errors.push(`Invalid type for 'pattern': expected string, got ${typeof pattern.pattern}`);
  }
  
  if (pattern.explanation && typeof pattern.explanation !== 'string') {
    errors.push(`Invalid type for 'explanation': expected string, got ${typeof pattern.explanation}`);
  }
  
  // Validate chapterId matches
  if (pattern.chapterId && pattern.chapterId !== chapterNum) {
    errors.push(`chapterId mismatch: expected ${chapterNum}, got ${pattern.chapterId}`);
  }
  
  // Validate examples array
  if (pattern.examples) {
    if (!Array.isArray(pattern.examples)) {
      errors.push(`'examples' must be an array`);
    } else if (pattern.examples.length === 0) {
      warnings.push(`'examples' array is empty`);
    } else {
      // Validate each example
      pattern.examples.forEach((example, idx) => {
        if (!example.japanese) {
          errors.push(`Example ${idx + 1}: missing 'japanese' field`);
        }
        if (!example.romaji) {
          errors.push(`Example ${idx + 1}: missing 'romaji' field`);
        }
        if (!example.indonesian) {
          errors.push(`Example ${idx + 1}: missing 'indonesian' field`);
        }
      });
    }
  }
  
  return { errors, warnings };
}

/**
 * Check if text contains words from vocabulary set
 */
function checkVocabularyUsage(text, vocabSet) {
  if (!text || !vocabSet) return { found: [], notFound: [] };
  
  const found = [];
  const notFound = [];
  
  // Extract potential words from text (simple tokenization)
  // This is a basic check - Japanese tokenization is complex
  const words = text.split(/[\s、。！？]/);
  
  words.forEach(word => {
    if (word.length === 0) return;
    
    // Check if word or any substring exists in vocabulary
    let foundInVocab = false;
    for (let i = word.length; i > 0; i--) {
      for (let j = 0; j <= word.length - i; j++) {
        const substring = word.substring(j, j + i);
        if (vocabSet.has(substring)) {
          found.push(substring);
          foundInVocab = true;
          break;
        }
      }
      if (foundInVocab) break;
    }
    
    if (!foundInVocab && word.length > 1) {
      // Only flag longer words as potentially not in vocabulary
      notFound.push(word);
    }
  });
  
  return { found: [...new Set(found)], notFound: [...new Set(notFound)] };
}

/**
 * Validate pattern examples use appropriate vocabulary
 */
function validatePatternVocabulary(pattern, vocabSet) {
  const issues = [];
  
  if (!pattern.examples || !Array.isArray(pattern.examples)) {
    return issues;
  }
  
  pattern.examples.forEach((example, idx) => {
    if (example.japanese) {
      const { notFound } = checkVocabularyUsage(example.japanese, vocabSet);
      if (notFound.length > 0) {
        issues.push({
          exampleIndex: idx + 1,
          japanese: example.japanese,
          potentialIssues: notFound,
          message: `Example may contain vocabulary not from current or previous chapters`
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check pattern notation consistency
 */
function validatePatternNotation(pattern) {
  const issues = [];
  
  if (!pattern.pattern) return issues;
  
  const patternText = pattern.pattern;
  
  // Common pattern notation elements in Minna no Nihongo
  const validNotations = [
    'N', 'V', 'A', 'い-adj', 'な-adj', 'Adv',
    'は', 'が', 'を', 'に', 'で', 'と', 'の', 'へ', 'から', 'まで', 'も', 'か',
    'です', 'ます', 'ません', 'ました', 'ませんでした',
    'て', 'た', 'ない', 'なかった'
  ];
  
  // Check if pattern uses standard notation
  const hasStandardNotation = validNotations.some(notation => 
    patternText.includes(notation)
  );
  
  if (!hasStandardNotation) {
    issues.push({
      pattern: patternText,
      message: 'Pattern may not use standard Minna no Nihongo notation'
    });
  }
  
  return issues;
}

/**
 * Validate all patterns for a chapter
 */
function validateChapterPatterns(chapterNum, cumulativeVocab) {
  console.log(`\n${colors.bright}${colors.blue}=== Chapter ${chapterNum} Pattern Validation ===${colors.reset}`);
  
  const chapterData = loadChapterData(chapterNum);
  if (!chapterData) {
    console.log(`${colors.red}✗ Failed to load chapter data${colors.reset}`);
    return null;
  }
  
  if (!chapterData.patterns || !Array.isArray(chapterData.patterns)) {
    console.log(`${colors.yellow}⚠ No patterns found in chapter${colors.reset}`);
    return {
      chapterNum,
      patternCount: 0,
      structureErrors: 0,
      vocabularyIssues: 0,
      notationIssues: 0,
      patterns: []
    };
  }
  
  const vocabSet = cumulativeVocab[chapterNum];
  const results = {
    chapterNum,
    patternCount: chapterData.patterns.length,
    structureErrors: 0,
    vocabularyIssues: 0,
    notationIssues: 0,
    patterns: []
  };
  
  console.log(`Found ${chapterData.patterns.length} patterns`);
  
  chapterData.patterns.forEach((pattern, idx) => {
    const patternResult = {
      id: pattern.id || `pattern_${idx + 1}`,
      order: pattern.order || idx + 1,
      pattern: pattern.pattern || 'N/A',
      structureValidation: null,
      vocabularyValidation: [],
      notationValidation: []
    };
    
    // Validate structure
    const structureValidation = validatePatternStructure(pattern, chapterNum);
    patternResult.structureValidation = structureValidation;
    
    if (structureValidation.errors.length > 0) {
      results.structureErrors += structureValidation.errors.length;
      console.log(`\n${colors.red}✗ Pattern ${pattern.id || idx + 1}:${colors.reset}`);
      structureValidation.errors.forEach(error => {
        console.log(`  ${colors.red}ERROR: ${error}${colors.reset}`);
      });
    }
    
    if (structureValidation.warnings.length > 0) {
      structureValidation.warnings.forEach(warning => {
        console.log(`  ${colors.yellow}WARNING: ${warning}${colors.reset}`);
      });
    }
    
    // Validate vocabulary usage
    const vocabValidation = validatePatternVocabulary(pattern, vocabSet);
    patternResult.vocabularyValidation = vocabValidation;
    
    if (vocabValidation.length > 0) {
      results.vocabularyIssues += vocabValidation.length;
      if (structureValidation.errors.length === 0) {
        console.log(`\n${colors.yellow}⚠ Pattern ${pattern.id || idx + 1}:${colors.reset} ${pattern.pattern}`);
      }
      vocabValidation.forEach(issue => {
        console.log(`  ${colors.yellow}VOCAB: Example ${issue.exampleIndex}: ${issue.message}${colors.reset}`);
        console.log(`    Japanese: ${issue.japanese}`);
        console.log(`    Potential issues: ${issue.potentialIssues.join(', ')}`);
      });
    }
    
    // Validate notation
    const notationValidation = validatePatternNotation(pattern);
    patternResult.notationValidation = notationValidation;
    
    if (notationValidation.length > 0) {
      results.notationIssues += notationValidation.length;
      if (structureValidation.errors.length === 0 && vocabValidation.length === 0) {
        console.log(`\n${colors.yellow}⚠ Pattern ${pattern.id || idx + 1}:${colors.reset}`);
      }
      notationValidation.forEach(issue => {
        console.log(`  ${colors.yellow}NOTATION: ${issue.message}${colors.reset}`);
        console.log(`    Pattern: ${issue.pattern}`);
      });
    }
    
    // Success message if no issues
    if (structureValidation.errors.length === 0 && 
        vocabValidation.length === 0 && 
        notationValidation.length === 0) {
      console.log(`${colors.green}✓ Pattern ${pattern.id || idx + 1}: ${pattern.pattern}${colors.reset}`);
    }
    
    results.patterns.push(patternResult);
  });
  
  // Chapter summary
  console.log(`\n${colors.cyan}Chapter ${chapterNum} Summary:${colors.reset}`);
  console.log(`  Total patterns: ${results.patternCount}`);
  console.log(`  Structure errors: ${results.structureErrors > 0 ? colors.red : colors.green}${results.structureErrors}${colors.reset}`);
  console.log(`  Vocabulary issues: ${results.vocabularyIssues > 0 ? colors.yellow : colors.green}${results.vocabularyIssues}${colors.reset}`);
  console.log(`  Notation issues: ${results.notationIssues > 0 ? colors.yellow : colors.green}${results.notationIssues}${colors.reset}`);
  
  return results;
}

/**
 * Generate comprehensive validation report
 */
function generateReport(allResults) {
  console.log(`\n\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  PATTERN DATA VALIDATION REPORT${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  Chapters 1-10${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
  
  const summary = {
    totalPatterns: 0,
    totalStructureErrors: 0,
    totalVocabularyIssues: 0,
    totalNotationIssues: 0,
    chaptersWithIssues: []
  };
  
  allResults.forEach(result => {
    if (!result) return;
    
    summary.totalPatterns += result.patternCount;
    summary.totalStructureErrors += result.structureErrors;
    summary.totalVocabularyIssues += result.vocabularyIssues;
    summary.totalNotationIssues += result.notationIssues;
    
    if (result.structureErrors > 0 || result.vocabularyIssues > 0 || result.notationIssues > 0) {
      summary.chaptersWithIssues.push(result.chapterNum);
    }
  });
  
  console.log(`${colors.bright}Overall Summary:${colors.reset}`);
  console.log(`  Total patterns validated: ${summary.totalPatterns}`);
  console.log(`  Structure errors: ${summary.totalStructureErrors > 0 ? colors.red : colors.green}${summary.totalStructureErrors}${colors.reset}`);
  console.log(`  Vocabulary issues: ${summary.totalVocabularyIssues > 0 ? colors.yellow : colors.green}${summary.totalVocabularyIssues}${colors.reset}`);
  console.log(`  Notation issues: ${summary.totalNotationIssues > 0 ? colors.yellow : colors.green}${summary.totalNotationIssues}${colors.reset}`);
  
  if (summary.chaptersWithIssues.length > 0) {
    console.log(`\n${colors.yellow}Chapters with issues: ${summary.chaptersWithIssues.join(', ')}${colors.reset}`);
  } else {
    console.log(`\n${colors.green}✓ All chapters passed validation!${colors.reset}`);
  }
  
  // Recommendations
  console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
  
  if (summary.totalStructureErrors > 0) {
    console.log(`  ${colors.red}• Fix structure errors immediately - these prevent proper data loading${colors.reset}`);
  }
  
  if (summary.totalVocabularyIssues > 0) {
    console.log(`  ${colors.yellow}• Review vocabulary issues - examples should use words from current or previous chapters${colors.reset}`);
  }
  
  if (summary.totalNotationIssues > 0) {
    console.log(`  ${colors.yellow}• Review notation issues - patterns should follow Minna no Nihongo standards${colors.reset}`);
  }
  
  if (summary.totalStructureErrors === 0 && 
      summary.totalVocabularyIssues === 0 && 
      summary.totalNotationIssues === 0) {
    console.log(`  ${colors.green}• Pattern data is well-structured and aligned with textbook standards${colors.reset}`);
    console.log(`  ${colors.green}• Ready for production use${colors.reset}`);
  }
  
  return summary;
}

/**
 * Save detailed report to JSON file
 */
function saveDetailedReport(allResults, summary) {
  const report = {
    timestamp: new Date().toISOString(),
    summary,
    chapters: allResults.filter(r => r !== null)
  };
  
  const reportPath = path.join(__dirname, 'TASK27.1_PATTERN_VALIDATION_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  console.log(`\n${colors.cyan}Detailed report saved to: ${reportPath}${colors.reset}`);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bright}${colors.cyan}Pattern Data Validation Script${colors.reset}`);
  console.log(`${colors.cyan}Task 27.1: Review existing pattern data${colors.reset}`);
  console.log(`${colors.cyan}Requirements: 5.2, 5.4, 6.5${colors.reset}\n`);
  
  // Build cumulative vocabulary for all chapters
  console.log(`${colors.bright}Building cumulative vocabulary map...${colors.reset}`);
  const cumulativeVocab = buildCumulativeVocabulary(10);
  console.log(`${colors.green}✓ Vocabulary map built for chapters 1-10${colors.reset}`);
  
  // Validate each chapter
  const allResults = [];
  for (let i = 1; i <= 10; i++) {
    const result = validateChapterPatterns(i, cumulativeVocab);
    allResults.push(result);
  }
  
  // Generate and display report
  const summary = generateReport(allResults);
  
  // Save detailed report
  saveDetailedReport(allResults, summary);
  
  // Exit with appropriate code
  if (summary.totalStructureErrors > 0) {
    console.log(`\n${colors.red}Validation failed with errors${colors.reset}`);
    process.exit(1);
  } else if (summary.totalVocabularyIssues > 0 || summary.totalNotationIssues > 0) {
    console.log(`\n${colors.yellow}Validation completed with warnings${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}Validation passed successfully${colors.reset}`);
    process.exit(0);
  }
}

// Run the script
main();
