/**
 * Progressive Learning Analyzer
 * 
 * This script analyzes quiz questions in chapters 2-10 to verify that:
 * 1. Each chapter includes material from previous chapters
 * 2. At least one question per chapter references previous material
 * 3. Progressive learning is properly implemented
 * 
 * Requirements: 3.3, 3.4, 10.1-10.10
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load chapter data from JSON file
 * @param {number} chapterNum - Chapter number (1-10)
 * @returns {Object} Chapter data
 */
function loadChapterData(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading chapter ${chapterNum}:`, error.message);
    return null;
  }
}

/**
 * Extract vocabulary words from a chapter
 * @param {Object} chapterData - Chapter data object
 * @returns {Set} Set of vocabulary words (kanji and kana forms)
 */
function extractVocabulary(chapterData) {
  const vocab = new Set();
  
  if (!chapterData || !chapterData.vocabulary) {
    return vocab;
  }
  
  chapterData.vocabulary.forEach(entry => {
    // Add both kanji and kana forms
    if (entry.kanji) {
      vocab.add(entry.kanji.toLowerCase());
    }
    if (entry.kana) {
      vocab.add(entry.kana.toLowerCase());
    }
    if (entry.romaji) {
      vocab.add(entry.romaji.toLowerCase());
    }
  });
  
  return vocab;
}

/**
 * Check if a text contains vocabulary from a specific chapter
 * @param {string} text - Text to analyze
 * @param {Set} vocabSet - Set of vocabulary words
 * @returns {boolean} True if text contains vocabulary from the set
 */
function containsVocabulary(text, vocabSet) {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // Check if any vocabulary word appears in the text
  for (const word of vocabSet) {
    if (lowerText.includes(word)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Analyze which chapters are referenced in a quiz question
 * @param {Object} question - Quiz question object
 * @param {Array} vocabularySets - Array of vocabulary sets for each chapter
 * @param {number} currentChapter - Current chapter number
 * @returns {Array} Array of chapter numbers referenced
 */
function analyzeQuestionReferences(question, vocabularySets, currentChapter) {
  const referencedChapters = new Set();
  
  // Combine all text from the question
  const questionText = question.question || '';
  const choicesText = (question.choices || []).join(' ');
  const allText = questionText + ' ' + choicesText;
  
  // Check against each previous chapter's vocabulary
  for (let i = 1; i <= currentChapter; i++) {
    if (containsVocabulary(allText, vocabularySets[i - 1])) {
      referencedChapters.add(i);
    }
  }
  
  return Array.from(referencedChapters).sort((a, b) => a - b);
}

/**
 * Analyze progressive learning for a single chapter
 * @param {number} chapterNum - Chapter number (2-10)
 * @param {Array} vocabularySets - Array of vocabulary sets for each chapter
 * @returns {Object} Analysis results
 */
function analyzeChapter(chapterNum, vocabularySets) {
  const chapterData = loadChapterData(chapterNum);
  
  if (!chapterData || !chapterData.quiz) {
    return {
      chapter: chapterNum,
      error: 'Failed to load chapter data or quiz not found',
      totalQuestions: 0,
      referencedChapters: [],
      questionsByChapter: {},
      hasPreviousChapterReferences: false
    };
  }
  
  const quiz = chapterData.quiz;
  const questionsByChapter = {};
  const referencedChapters = new Set();
  
  // Initialize counters for each chapter
  for (let i = 1; i <= chapterNum; i++) {
    questionsByChapter[i] = 0;
  }
  
  // Analyze each quiz question
  quiz.forEach(question => {
    const refs = analyzeQuestionReferences(question, vocabularySets, chapterNum);
    
    refs.forEach(chapterRef => {
      referencedChapters.add(chapterRef);
      questionsByChapter[chapterRef]++;
    });
  });
  
  // Check if there are references to previous chapters
  const hasPreviousChapterReferences = Array.from(referencedChapters).some(ch => ch < chapterNum);
  
  return {
    chapter: chapterNum,
    totalQuestions: quiz.length,
    referencedChapters: Array.from(referencedChapters).sort((a, b) => a - b),
    questionsByChapter,
    hasPreviousChapterReferences,
    missingPreviousChapters: []
  };
}

/**
 * Generate progressive learning report for all chapters
 */
function generateProgressiveLearningReport() {
  console.log('='.repeat(80));
  console.log('PROGRESSIVE LEARNING ANALYSIS REPORT');
  console.log('Minna no Nihongo Chapter 1-10 Enhancement');
  console.log('='.repeat(80));
  console.log();
  
  // Load vocabulary for all chapters
  console.log('Loading vocabulary data for chapters 1-10...');
  const vocabularySets = [];
  
  for (let i = 1; i <= 10; i++) {
    const chapterData = loadChapterData(i);
    if (chapterData) {
      const vocab = extractVocabulary(chapterData);
      vocabularySets.push(vocab);
      console.log(`  Chapter ${i}: ${vocab.size} vocabulary entries`);
    } else {
      vocabularySets.push(new Set());
      console.log(`  Chapter ${i}: ERROR - Failed to load`);
    }
  }
  
  console.log();
  console.log('-'.repeat(80));
  console.log('CHAPTER-BY-CHAPTER ANALYSIS');
  console.log('-'.repeat(80));
  console.log();
  
  const results = [];
  let allChaptersPass = true;
  
  // Analyze chapters 2-10 (Chapter 1 doesn't need progressive learning)
  for (let chapterNum = 2; chapterNum <= 10; chapterNum++) {
    console.log(`\nChapter ${chapterNum} Analysis:`);
    console.log('-'.repeat(40));
    
    const analysis = analyzeChapter(chapterNum, vocabularySets);
    results.push(analysis);
    
    if (analysis.error) {
      console.log(`  ERROR: ${analysis.error}`);
      allChaptersPass = false;
      continue;
    }
    
    console.log(`  Total Questions: ${analysis.totalQuestions}`);
    console.log(`  Referenced Chapters: ${analysis.referencedChapters.join(', ')}`);
    console.log(`  Has Previous Chapter References: ${analysis.hasPreviousChapterReferences ? 'YES ✓' : 'NO ✗'}`);
    
    console.log('\n  Questions by Chapter:');
    for (let i = 1; i <= chapterNum; i++) {
      const count = analysis.questionsByChapter[i] || 0;
      const percentage = analysis.totalQuestions > 0 
        ? ((count / analysis.totalQuestions) * 100).toFixed(1) 
        : '0.0';
      console.log(`    Chapter ${i}: ${count} questions (${percentage}%)`);
    }
    
    // Check if at least one question references previous chapters
    if (!analysis.hasPreviousChapterReferences) {
      console.log('\n  ⚠️  WARNING: No questions reference previous chapters!');
      allChaptersPass = false;
    }
    
    // Check if all previous chapters are represented
    const missingChapters = [];
    for (let i = 1; i < chapterNum; i++) {
      if (!analysis.referencedChapters.includes(i)) {
        missingChapters.push(i);
      }
    }
    
    if (missingChapters.length > 0) {
      console.log(`\n  ⚠️  WARNING: Missing references to chapters: ${missingChapters.join(', ')}`);
      analysis.missingPreviousChapters = missingChapters;
    }
  }
  
  console.log();
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log();
  
  // Summary statistics
  const chaptersWithPreviousRefs = results.filter(r => r.hasPreviousChapterReferences).length;
  const totalChaptersAnalyzed = results.filter(r => !r.error).length;
  
  console.log(`Chapters Analyzed: ${totalChaptersAnalyzed}/9 (Chapters 2-10)`);
  console.log(`Chapters with Previous Chapter References: ${chaptersWithPreviousRefs}/${totalChaptersAnalyzed}`);
  console.log();
  
  if (allChaptersPass && chaptersWithPreviousRefs === totalChaptersAnalyzed) {
    console.log('✓ PASS: All chapters implement progressive learning correctly');
    console.log('✓ PASS: All chapters reference previous material');
  } else {
    console.log('✗ FAIL: Some chapters do not implement progressive learning correctly');
    console.log();
    console.log('Issues Found:');
    
    results.forEach(result => {
      if (result.error) {
        console.log(`  - Chapter ${result.chapter}: ${result.error}`);
      } else if (!result.hasPreviousChapterReferences) {
        console.log(`  - Chapter ${result.chapter}: No previous chapter references`);
      } else if (result.missingPreviousChapters.length > 0) {
        console.log(`  - Chapter ${result.chapter}: Missing references to chapters ${result.missingPreviousChapters.join(', ')}`);
      }
    });
  }
  
  console.log();
  console.log('='.repeat(80));
  console.log('REQUIREMENTS VALIDATION');
  console.log('='.repeat(80));
  console.log();
  
  // Validate specific requirements
  const requirements = [
    { id: '3.3', desc: 'Quiz questions for chapters 2-10 include material from previous chapters', pass: chaptersWithPreviousRefs === totalChaptersAnalyzed },
    { id: '3.4', desc: 'At least one question per chapter references previous material', pass: chaptersWithPreviousRefs === totalChaptersAnalyzed },
    { id: '10.1', desc: 'Chapter 2 includes material from chapters 1-2', pass: results[0] && results[0].referencedChapters.includes(1) && results[0].referencedChapters.includes(2) },
    { id: '10.2', desc: 'Chapter 3 includes material from chapters 1-3', pass: results[1] && results[1].referencedChapters.includes(1) && results[1].referencedChapters.includes(2) && results[1].referencedChapters.includes(3) },
    { id: '10.3', desc: 'Chapter 4 includes material from chapters 1-4', pass: results[2] && results[2].referencedChapters.includes(1) && results[2].referencedChapters.includes(4) },
    { id: '10.4', desc: 'Chapter 5 includes material from chapters 1-5', pass: results[3] && results[3].referencedChapters.includes(1) && results[3].referencedChapters.includes(5) },
    { id: '10.5', desc: 'Chapter 6 includes material from chapters 1-6', pass: results[4] && results[4].referencedChapters.includes(1) && results[4].referencedChapters.includes(6) },
    { id: '10.6', desc: 'Chapter 7 includes material from chapters 1-7', pass: results[5] && results[5].referencedChapters.includes(1) && results[5].referencedChapters.includes(7) },
    { id: '10.7', desc: 'Chapter 8 includes material from chapters 1-8', pass: results[6] && results[6].referencedChapters.includes(1) && results[6].referencedChapters.includes(8) },
    { id: '10.8', desc: 'Chapter 9 includes material from chapters 1-9', pass: results[7] && results[7].referencedChapters.includes(1) && results[7].referencedChapters.includes(9) },
    { id: '10.9', desc: 'Chapter 10 includes material from chapters 1-10', pass: results[8] && results[8].referencedChapters.includes(1) && results[8].referencedChapters.includes(10) }
  ];
  
  requirements.forEach(req => {
    const status = req.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`  ${status} - Requirement ${req.id}: ${req.desc}`);
  });
  
  const allRequirementsPassed = requirements.every(req => req.pass);
  
  console.log();
  console.log('='.repeat(80));
  
  if (allRequirementsPassed) {
    console.log('✓ ALL REQUIREMENTS PASSED');
  } else {
    console.log('✗ SOME REQUIREMENTS FAILED');
  }
  
  console.log('='.repeat(80));
  console.log();
  
  // Save detailed report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      chaptersAnalyzed: totalChaptersAnalyzed,
      chaptersWithPreviousRefs,
      allRequirementsPassed
    },
    chapterAnalysis: results,
    requirementsValidation: requirements
  };
  
  const reportPath = path.join(__dirname, 'PROGRESSIVE_LEARNING_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`Detailed report saved to: ${reportPath}`);
  console.log();
  
  return allRequirementsPassed;
}

// Run the analysis
try {
  const success = generateProgressiveLearningReport();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}

export {
  loadChapterData,
  extractVocabulary,
  containsVocabulary,
  analyzeQuestionReferences,
  analyzeChapter,
  generateProgressiveLearningReport
};
