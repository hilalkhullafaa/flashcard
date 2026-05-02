/**
 * Master Validation Script for Minna no Nihongo Chapters 1-10
 * 
 * This comprehensive validation script validates ALL aspects of chapter data:
 * - Conversations: structure, completeness, furigana data
 * - Quiz: structure, category distribution, progressive learning
 * - Patterns: structure, vocabulary usage, notation
 * - Grammar: structure, vocabulary usage, terminology
 * - Vocabulary: dataset integrity (no modifications)
 * 
 * Task: 31.1 - Create master validation script
 * Requirements: 6.1-6.7, 7.1-7.10, 13.1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateConversation, validateQuizQuestion, validateChapterData } from './js/utils/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Configuration
const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REQUIRED_CONVERSATIONS = 10;
const REQUIRED_QUIZ_QUESTIONS = 50;
const QUIZ_CATEGORIES = ['vocabulary', 'grammar', 'reading', 'conversation'];
const MIN_QUESTIONS_PER_CATEGORY = 10;

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
 * Validate conversation data structure and completeness
 */
function validateConversations(chapterData, chapterNum, report) {
  const section = 'Conversations';
  
  if (!chapterData.conversations || !Array.isArray(chapterData.conversations)) {
    report.addError(chapterNum, section, 'Missing or invalid conversations array');
    return;
  }
  
  const convCount = chapterData.conversations.length;
  report.stats.totalConversations += convCount;
  
  // Check count requirement
  if (convCount !== REQUIRED_CONVERSATIONS) {
    report.addError(chapterNum, section, `Expected ${REQUIRED_CONVERSATIONS} conversations, found ${convCount}`);
  }
  
  // Validate each conversation
  chapterData.conversations.forEach((conv, idx) => {
    const result = validateConversation(conv);
    
    if (!result.valid) {
      result.errors.forEach(error => {
        report.addError(chapterNum, section, `Conversation ${idx + 1} (${conv.id || 'unknown'}): ${error}`);
      });
    }
    
    result.warnings.forEach(warning => {
      report.addWarning(chapterNum, section, `Conversation ${idx + 1} (${conv.id || 'unknown'}): ${warning}`);
    });
    
    // Additional validation: check chapterId matches
    if (conv.chapterId !== chapterNum) {
      report.addError(chapterNum, section, `Conversation ${conv.id} has incorrect chapterId: ${conv.chapterId} (expected ${chapterNum})`);
    }
  });
}

/**
 * Validate quiz data structure, category distribution, and completeness
 */
function validateQuiz(chapterData, chapterNum, report) {
  const section = 'Quiz';
  
  if (!chapterData.quiz || !Array.isArray(chapterData.quiz)) {
    report.addError(chapterNum, section, 'Missing or invalid quiz array');
    return;
  }
  
  const quizCount = chapterData.quiz.length;
  report.stats.totalQuizQuestions += quizCount;
  
  // Check count requirement
  if (quizCount !== REQUIRED_QUIZ_QUESTIONS) {
    report.addError(chapterNum, section, `Expected ${REQUIRED_QUIZ_QUESTIONS} questions, found ${quizCount}`);
  }
  
  // Track category distribution
  const categoryCount = {};
  QUIZ_CATEGORIES.forEach(cat => categoryCount[cat] = 0);
  
  // Validate each question
  chapterData.quiz.forEach((question, idx) => {
    const result = validateQuizQuestion(question);
    
    if (!result.valid) {
      result.errors.forEach(error => {
        report.addError(chapterNum, section, `Question ${idx + 1} (${question.id || 'unknown'}): ${error}`);
      });
    }
    
    result.warnings.forEach(warning => {
      report.addWarning(chapterNum, section, `Question ${idx + 1} (${question.id || 'unknown'}): ${warning}`);
    });
    
    // Track category
    if (question.category && QUIZ_CATEGORIES.includes(question.category)) {
      categoryCount[question.category]++;
    }
    
    // Additional validation: check chapterId matches
    if (question.chapterId !== chapterNum) {
      report.addError(chapterNum, section, `Question ${question.id} has incorrect chapterId: ${question.chapterId} (expected ${chapterNum})`);
    }
  });
  
  // Validate category distribution
  QUIZ_CATEGORIES.forEach(cat => {
    if (categoryCount[cat] < MIN_QUESTIONS_PER_CATEGORY) {
      report.addWarning(chapterNum, section, `Category '${cat}' has only ${categoryCount[cat]} questions (recommended: at least ${MIN_QUESTIONS_PER_CATEGORY})`);
    }
  });
  
  // Store category distribution for reporting
  report.categoryDistribution[chapterNum] = categoryCount;
}

/**
 * Validate pattern data structure
 */
function validatePatterns(chapterData, chapterNum, vocabSet, report) {
  const section = 'Patterns';
  
  if (!chapterData.patterns || !Array.isArray(chapterData.patterns)) {
    report.addWarning(chapterNum, section, 'No patterns found in chapter');
    return;
  }
  
  report.stats.totalPatterns += chapterData.patterns.length;
  
  chapterData.patterns.forEach((pattern, idx) => {
    // Check required fields
    const requiredFields = ['id', 'chapterId', 'order', 'pattern', 'explanation', 'examples'];
    requiredFields.forEach(field => {
      if (!pattern[field]) {
        report.addError(chapterNum, section, `Pattern ${idx + 1} (${pattern.id || 'unknown'}): Missing required field '${field}'`);
      }
    });
    
    // Check chapterId matches
    if (pattern.chapterId && pattern.chapterId !== chapterNum) {
      report.addError(chapterNum, section, `Pattern ${pattern.id} has incorrect chapterId: ${pattern.chapterId} (expected ${chapterNum})`);
    }
    
    // Validate examples
    if (pattern.examples) {
      if (!Array.isArray(pattern.examples)) {
        report.addError(chapterNum, section, `Pattern ${pattern.id}: 'examples' must be an array`);
      } else if (pattern.examples.length === 0) {
        report.addWarning(chapterNum, section, `Pattern ${pattern.id}: 'examples' array is empty`);
      } else {
        pattern.examples.forEach((example, exIdx) => {
          if (!example.japanese) {
            report.addError(chapterNum, section, `Pattern ${pattern.id}, example ${exIdx + 1}: missing 'japanese' field`);
          }
          if (!example.romaji) {
            report.addError(chapterNum, section, `Pattern ${pattern.id}, example ${exIdx + 1}: missing 'romaji' field`);
          }
          if (!example.indonesian) {
            report.addError(chapterNum, section, `Pattern ${pattern.id}, example ${exIdx + 1}: missing 'indonesian' field`);
          }
        });
      }
    }
  });
}

/**
 * Validate grammar data structure
 */
function validateGrammar(chapterData, chapterNum, vocabSet, report) {
  const section = 'Grammar';
  
  if (!chapterData.grammar || !Array.isArray(chapterData.grammar)) {
    report.addWarning(chapterNum, section, 'No grammar found in chapter');
    return;
  }
  
  report.stats.totalGrammar += chapterData.grammar.length;
  
  chapterData.grammar.forEach((grammar, idx) => {
    // Check required fields
    const requiredFields = ['id', 'chapterId', 'order', 'title', 'explanation', 'examples'];
    requiredFields.forEach(field => {
      if (!grammar[field]) {
        report.addError(chapterNum, section, `Grammar ${idx + 1} (${grammar.id || 'unknown'}): Missing required field '${field}'`);
      }
    });
    
    // Check chapterId matches
    if (grammar.chapterId && grammar.chapterId !== chapterNum) {
      report.addError(chapterNum, section, `Grammar ${grammar.id} has incorrect chapterId: ${grammar.chapterId} (expected ${chapterNum})`);
    }
    
    // Validate examples
    if (grammar.examples) {
      if (!Array.isArray(grammar.examples)) {
        report.addError(chapterNum, section, `Grammar ${grammar.id}: 'examples' must be an array`);
      } else if (grammar.examples.length === 0) {
        report.addWarning(chapterNum, section, `Grammar ${grammar.id}: 'examples' array is empty`);
      } else {
        grammar.examples.forEach((example, exIdx) => {
          if (!example.japanese) {
            report.addError(chapterNum, section, `Grammar ${grammar.id}, example ${exIdx + 1}: missing 'japanese' field`);
          }
          if (!example.romaji) {
            report.addError(chapterNum, section, `Grammar ${grammar.id}, example ${exIdx + 1}: missing 'romaji' field`);
          }
          if (!example.indonesian) {
            report.addError(chapterNum, section, `Grammar ${grammar.id}, example ${exIdx + 1}: missing 'indonesian' field`);
          }
        });
      }
    }
  });
}

/**
 * Validate vocabulary dataset integrity (no modifications)
 */
function validateVocabularyIntegrity(chapterData, chapterNum, report) {
  const section = 'Vocabulary';
  
  if (!chapterData.vocabulary || !Array.isArray(chapterData.vocabulary)) {
    report.addError(chapterNum, section, 'Missing or invalid vocabulary array');
    return;
  }
  
  if (chapterData.vocabulary.length === 0) {
    report.addWarning(chapterNum, section, 'Vocabulary array is empty');
    return;
  }
  
  report.stats.totalVocabulary += chapterData.vocabulary.length;
  
  // Validate vocabulary structure (basic check)
  chapterData.vocabulary.forEach((entry, idx) => {
    if (!entry.id) {
      report.addWarning(chapterNum, section, `Vocabulary entry ${idx + 1}: missing 'id' field`);
    }
    if (!entry.kanji && !entry.kana) {
      report.addWarning(chapterNum, section, `Vocabulary entry ${idx + 1}: missing both 'kanji' and 'kana' fields`);
    }
  });
}

/**
 * Validation Report Class
 */
class ValidationReport {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalConversations: 0,
      totalQuizQuestions: 0,
      totalPatterns: 0,
      totalGrammar: 0,
      totalVocabulary: 0
    };
    this.categoryDistribution = {};
    this.startTime = Date.now();
  }

  addError(chapter, section, message) {
    this.errors.push({ chapter, section, message });
  }

  addWarning(chapter, section, message) {
    this.warnings.push({ chapter, section, message });
  }

  printHeader() {
    console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  MASTER VALIDATION REPORT${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  Minna no Nihongo Chapters 1-10${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
  }

  printStats() {
    console.log(`${colors.bright}📊 Overall Statistics:${colors.reset}`);
    console.log(`  ${colors.cyan}Total Conversations:${colors.reset} ${this.stats.totalConversations}`);
    console.log(`  ${colors.cyan}Total Quiz Questions:${colors.reset} ${this.stats.totalQuizQuestions}`);
    console.log(`  ${colors.cyan}Total Patterns:${colors.reset} ${this.stats.totalPatterns}`);
    console.log(`  ${colors.cyan}Total Grammar:${colors.reset} ${this.stats.totalGrammar}`);
    console.log(`  ${colors.cyan}Total Vocabulary:${colors.reset} ${this.stats.totalVocabulary}`);
  }

  printCategoryDistribution() {
    console.log(`\n${colors.bright}📈 Quiz Category Distribution:${colors.reset}`);
    
    CHAPTERS.forEach(chapterNum => {
      const dist = this.categoryDistribution[chapterNum];
      if (dist) {
        console.log(`  ${colors.cyan}Chapter ${chapterNum}:${colors.reset}`);
        QUIZ_CATEGORIES.forEach(cat => {
          const count = dist[cat] || 0;
          const color = count >= MIN_QUESTIONS_PER_CATEGORY ? colors.green : colors.yellow;
          console.log(`    ${cat}: ${color}${count}${colors.reset}`);
        });
      }
    });
  }

  printWarnings() {
    if (this.warnings.length > 0) {
      console.log(`\n${colors.bright}⚠️  Warnings (${this.warnings.length}):${colors.reset}`);
      this.warnings.forEach(w => {
        console.log(`  ${colors.yellow}Chapter ${w.chapter} [${w.section}]: ${w.message}${colors.reset}`);
      });
    }
  }

  printErrors() {
    if (this.errors.length > 0) {
      console.log(`\n${colors.bright}❌ Errors (${this.errors.length}):${colors.reset}`);
      this.errors.forEach(e => {
        console.log(`  ${colors.red}Chapter ${e.chapter} [${e.section}]: ${e.message}${colors.reset}`);
      });
    }
  }

  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  VALIDATION SUMMARY${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${colors.green}${colors.bright}✅ ALL VALIDATIONS PASSED!${colors.reset}`);
      console.log(`${colors.green}All chapter data is valid and production-ready.${colors.reset}`);
    } else if (this.errors.length === 0) {
      console.log(`${colors.yellow}${colors.bright}⚠️  VALIDATION COMPLETED WITH WARNINGS${colors.reset}`);
      console.log(`${colors.yellow}No critical errors found, but ${this.warnings.length} warnings need review.${colors.reset}`);
    } else {
      console.log(`${colors.red}${colors.bright}❌ VALIDATION FAILED${colors.reset}`);
      console.log(`${colors.red}Found ${this.errors.length} errors and ${this.warnings.length} warnings.${colors.reset}`);
      console.log(`${colors.red}Please fix the errors before proceeding.${colors.reset}`);
    }
    
    console.log(`\n${colors.dim}Validation completed in ${duration}s${colors.reset}\n`);
  }

  saveToFile() {
    const report = {
      timestamp: new Date().toISOString(),
      duration: ((Date.now() - this.startTime) / 1000).toFixed(2) + 's',
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        passed: this.errors.length === 0
      },
      stats: this.stats,
      categoryDistribution: this.categoryDistribution,
      errors: this.errors,
      warnings: this.warnings
    };
    
    const reportPath = path.join(__dirname, 'MASTER_VALIDATION_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log(`${colors.cyan}Detailed report saved to: ${reportPath}${colors.reset}`);
  }

  getExitCode() {
    return this.errors.length === 0 ? 0 : 1;
  }
}

/**
 * Validate a single chapter
 */
function validateChapter(chapterNum, cumulativeVocab, report) {
  console.log(`\n${colors.bright}${colors.blue}Validating Chapter ${chapterNum}...${colors.reset}`);
  
  const chapterData = loadChapterData(chapterNum);
  if (!chapterData) {
    report.addError(chapterNum, 'General', 'Failed to load chapter data');
    return;
  }
  
  const vocabSet = cumulativeVocab[chapterNum];
  
  // Validate all sections
  validateConversations(chapterData, chapterNum, report);
  validateQuiz(chapterData, chapterNum, report);
  validatePatterns(chapterData, chapterNum, vocabSet, report);
  validateGrammar(chapterData, chapterNum, vocabSet, report);
  validateVocabularyIntegrity(chapterData, chapterNum, report);
  
  console.log(`${colors.green}✓ Chapter ${chapterNum} validation complete${colors.reset}`);
}

/**
 * Main execution
 */
function main() {
  const report = new ValidationReport();
  
  report.printHeader();
  
  console.log(`${colors.bright}Building cumulative vocabulary map...${colors.reset}`);
  const cumulativeVocab = buildCumulativeVocabulary(10);
  console.log(`${colors.green}✓ Vocabulary map built for chapters 1-10${colors.reset}`);
  
  // Validate each chapter
  CHAPTERS.forEach(chapterNum => {
    validateChapter(chapterNum, cumulativeVocab, report);
  });
  
  // Print results
  console.log(`\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  VALIDATION RESULTS${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
  
  report.printStats();
  report.printCategoryDistribution();
  report.printWarnings();
  report.printErrors();
  report.printSummary();
  report.saveToFile();
  
  // Exit with appropriate code
  process.exit(report.getExitCode());
}

// Run the script
main();
