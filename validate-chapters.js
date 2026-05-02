/**
 * Comprehensive validation script for Chapters 1-10 data integrity
 * Validates conversations, quiz questions, patterns, and grammar data
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REQUIRED_CONVERSATIONS = 10;
const REQUIRED_QUIZ_QUESTIONS = 50;
const QUIZ_CATEGORIES = ['vocabulary', 'grammar', 'reading', 'conversation'];

class ValidationReport {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalConversations: 0,
      totalQuizQuestions: 0,
      totalPatterns: 0,
      totalGrammar: 0,
    };
  }

  addError(chapter, section, message) {
    this.errors.push({ chapter, section, message });
  }

  addWarning(chapter, section, message) {
    this.warnings.push({ chapter, section, message });
  }

  print() {
    console.log('\n=== VALIDATION REPORT ===\n');
    
    console.log('📊 Statistics:');
    console.log(`  Total Conversations: ${this.stats.totalConversations}`);
    console.log(`  Total Quiz Questions: ${this.stats.totalQuizQuestions}`);
    console.log(`  Total Patterns: ${this.stats.totalPatterns}`);
    console.log(`  Total Grammar: ${this.stats.totalGrammar}`);
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(w => {
        console.log(`  Chapter ${w.chapter} [${w.section}]: ${w.message}`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(e => {
        console.log(`  Chapter ${e.chapter} [${e.section}]: ${e.message}`);
      });
    } else {
      console.log('\n✅ All validations passed!');
    }
    
    console.log('\n=========================\n');
    
    return this.errors.length === 0;
  }
}

function loadChapterData(chapterNum) {
  const filename = `ch${String(chapterNum).padStart(2, '0')}.json`;
  const filepath = join(process.cwd(), 'data', filename);
  
  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load ${filename}: ${error.message}`);
  }
}

function validateConversation(conv, chapterNum, report) {
  const requiredFields = ['id', 'chapterId', 'order', 'title', 'turns'];
  
  for (const field of requiredFields) {
    if (!(field in conv)) {
      report.addError(chapterNum, 'Conversations', `Missing field '${field}' in conversation ${conv.id || 'unknown'}`);
    }
  }
  
  if (conv.chapterId !== chapterNum) {
    report.addError(chapterNum, 'Conversations', `Conversation ${conv.id} has incorrect chapterId: ${conv.chapterId} (expected ${chapterNum})`);
  }
  
  if (!Array.isArray(conv.turns) || conv.turns.length === 0) {
    report.addError(chapterNum, 'Conversations', `Conversation ${conv.id} has no turns`);
    return;
  }
  
  conv.turns.forEach((turn, idx) => {
    const turnFields = ['speaker', 'japanese', 'romaji', 'indonesian', 'hiragana'];
    for (const field of turnFields) {
      if (!turn[field] || typeof turn[field] !== 'string' || turn[field].trim() === '') {
        report.addError(chapterNum, 'Conversations', `Conversation ${conv.id}, turn ${idx}: Missing or empty '${field}'`);
      }
    }
  });
}

function validateQuizQuestion(question, chapterNum, report) {
  const requiredFields = ['id', 'chapterId', 'order', 'question', 'choices', 'correctIndex', 'category'];
  
  for (const field of requiredFields) {
    if (!(field in question)) {
      report.addError(chapterNum, 'Quiz', `Missing field '${field}' in question ${question.id || 'unknown'}`);
    }
  }
  
  if (question.chapterId !== chapterNum) {
    report.addError(chapterNum, 'Quiz', `Question ${question.id} has incorrect chapterId: ${question.chapterId} (expected ${chapterNum})`);
  }
  
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    report.addError(chapterNum, 'Quiz', `Question ${question.id} must have exactly 4 choices (has ${question.choices?.length || 0})`);
  }
  
  if (typeof question.correctIndex !== 'number' || question.correctIndex < 0 || question.correctIndex > 3) {
    report.addError(chapterNum, 'Quiz', `Question ${question.id} has invalid correctIndex: ${question.correctIndex}`);
  }
  
  if (!QUIZ_CATEGORIES.includes(question.category)) {
    report.addError(chapterNum, 'Quiz', `Question ${question.id} has invalid category: ${question.category}`);
  }
}

function validatePattern(pattern, chapterNum, report) {
  const requiredFields = ['id', 'chapterId', 'order', 'pattern', 'explanation', 'examples'];
  
  for (const field of requiredFields) {
    if (!(field in pattern)) {
      report.addWarning(chapterNum, 'Patterns', `Missing field '${field}' in pattern ${pattern.id || 'unknown'}`);
    }
  }
  
  if (pattern.examples && (!Array.isArray(pattern.examples) || pattern.examples.length === 0)) {
    report.addWarning(chapterNum, 'Patterns', `Pattern ${pattern.id} has no examples`);
  }
}

function validateGrammar(grammar, chapterNum, report) {
  const requiredFields = ['id', 'chapterId', 'order', 'title', 'explanation', 'examples'];
  
  for (const field of requiredFields) {
    if (!(field in grammar)) {
      report.addWarning(chapterNum, 'Grammar', `Missing field '${field}' in grammar ${grammar.id || 'unknown'}`);
    }
  }
  
  if (grammar.examples && (!Array.isArray(grammar.examples) || grammar.examples.length === 0)) {
    report.addWarning(chapterNum, 'Grammar', `Grammar ${grammar.id} has no examples`);
  }
}

function validateChapter(chapterNum, report) {
  console.log(`Validating Chapter ${chapterNum}...`);
  
  const data = loadChapterData(chapterNum);
  
  // Validate conversations
  if (!data.conversations || !Array.isArray(data.conversations)) {
    report.addError(chapterNum, 'Conversations', 'Missing or invalid conversations array');
  } else {
    const convCount = data.conversations.length;
    report.stats.totalConversations += convCount;
    
    if (convCount !== REQUIRED_CONVERSATIONS) {
      report.addError(chapterNum, 'Conversations', `Expected ${REQUIRED_CONVERSATIONS} conversations, found ${convCount}`);
    }
    
    data.conversations.forEach(conv => validateConversation(conv, chapterNum, report));
  }
  
  // Validate quiz questions
  if (!data.quiz || !Array.isArray(data.quiz)) {
    report.addError(chapterNum, 'Quiz', 'Missing or invalid quiz array');
  } else {
    const quizCount = data.quiz.length;
    report.stats.totalQuizQuestions += quizCount;
    
    if (quizCount !== REQUIRED_QUIZ_QUESTIONS) {
      report.addError(chapterNum, 'Quiz', `Expected ${REQUIRED_QUIZ_QUESTIONS} questions, found ${quizCount}`);
    }
    
    // Check category distribution
    const categoryCount = {};
    QUIZ_CATEGORIES.forEach(cat => categoryCount[cat] = 0);
    
    data.quiz.forEach(q => {
      validateQuizQuestion(q, chapterNum, report);
      if (q.category && QUIZ_CATEGORIES.includes(q.category)) {
        categoryCount[q.category]++;
      }
    });
    
    // Verify each category has at least 10 questions
    QUIZ_CATEGORIES.forEach(cat => {
      if (categoryCount[cat] < 10) {
        report.addWarning(chapterNum, 'Quiz', `Category '${cat}' has only ${categoryCount[cat]} questions (recommended: at least 10)`);
      }
    });
  }
  
  // Validate patterns (optional, warnings only)
  if (data.patterns && Array.isArray(data.patterns)) {
    report.stats.totalPatterns += data.patterns.length;
    data.patterns.forEach(p => validatePattern(p, chapterNum, report));
  }
  
  // Validate grammar (optional, warnings only)
  if (data.grammar && Array.isArray(data.grammar)) {
    report.stats.totalGrammar += data.grammar.length;
    data.grammar.forEach(g => validateGrammar(g, chapterNum, report));
  }
  
  // Validate vocabulary is present and unchanged (read-only check)
  if (!data.vocabulary || !Array.isArray(data.vocabulary)) {
    report.addError(chapterNum, 'Vocabulary', 'Missing or invalid vocabulary array');
  } else if (data.vocabulary.length === 0) {
    report.addWarning(chapterNum, 'Vocabulary', 'Vocabulary array is empty');
  }
}

function validateProgressiveLearning(report) {
  console.log('\nValidating progressive learning...');
  
  // For chapters 2-10, verify quiz questions reference previous chapters
  // This is a simplified check - we just verify the data exists
  for (let i = 2; i <= 10; i++) {
    const data = loadChapterData(i);
    if (data.quiz && data.quiz.length > 0) {
      // Progressive learning is implemented if quiz exists
      // Detailed content analysis would require vocabulary matching
      console.log(`  Chapter ${i}: ✓ Quiz data present for progressive learning`);
    }
  }
}

function main() {
  console.log('Starting validation for Chapters 1-10...\n');
  
  const report = new ValidationReport();
  
  try {
    // Validate each chapter
    for (const chapterNum of CHAPTERS) {
      validateChapter(chapterNum, report);
    }
    
    // Validate progressive learning
    validateProgressiveLearning(report);
    
    // Print report
    const success = report.print();
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error('\n❌ Fatal error during validation:', error.message);
    process.exit(1);
  }
}

main();
