/**
 * Quiz Category Distribution Analyzer
 * 
 * This script analyzes quiz questions across chapters 1-10 to verify:
 * 1. Each chapter has at least 10 questions per category
 * 2. Total question count per chapter is exactly 50
 * 3. Category distribution meets requirements (vocabulary, grammar, reading, conversation)
 * 
 * Requirements: 9.1-9.4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Expected categories
const EXPECTED_CATEGORIES = ['vocabulary', 'grammar', 'reading', 'conversation'];
const MIN_QUESTIONS_PER_CATEGORY = 10;
const TOTAL_QUESTIONS_PER_CHAPTER = 50;
const CHAPTERS_TO_ANALYZE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Load chapter data from JSON file
 * @param {number} chapterNum - Chapter number (1-10)
 * @returns {Object|null} Chapter data or null if error
 */
function loadChapterData(chapterNum) {
  const filename = `ch${String(chapterNum).padStart(2, '0')}.json`;
  const filepath = path.join(__dirname, 'data', filename);
  
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return null;
  }
}

/**
 * Count questions by category for a chapter
 * @param {Array} quizQuestions - Array of quiz questions
 * @returns {Object} Category counts
 */
function countQuestionsByCategory(quizQuestions) {
  const counts = {
    vocabulary: 0,
    grammar: 0,
    reading: 0,
    conversation: 0,
    unknown: 0
  };
  
  if (!Array.isArray(quizQuestions)) {
    return counts;
  }
  
  quizQuestions.forEach(question => {
    const category = question.category;
    if (EXPECTED_CATEGORIES.includes(category)) {
      counts[category]++;
    } else {
      counts.unknown++;
      console.warn(`  Warning: Unknown category "${category}" in question ${question.id}`);
    }
  });
  
  return counts;
}

/**
 * Analyze a single chapter's quiz distribution
 * @param {number} chapterNum - Chapter number
 * @returns {Object} Analysis results
 */
function analyzeChapter(chapterNum) {
  const chapterData = loadChapterData(chapterNum);
  
  if (!chapterData) {
    return {
      chapter: chapterNum,
      error: 'Failed to load chapter data',
      valid: false
    };
  }
  
  const quizQuestions = chapterData.quiz || [];
  const totalQuestions = quizQuestions.length;
  const categoryCounts = countQuestionsByCategory(quizQuestions);
  
  // Check if each category meets minimum requirement
  const categoryIssues = [];
  EXPECTED_CATEGORIES.forEach(category => {
    if (categoryCounts[category] < MIN_QUESTIONS_PER_CATEGORY) {
      categoryIssues.push({
        category,
        count: categoryCounts[category],
        required: MIN_QUESTIONS_PER_CATEGORY,
        deficit: MIN_QUESTIONS_PER_CATEGORY - categoryCounts[category]
      });
    }
  });
  
  // Check total question count
  const totalIssue = totalQuestions !== TOTAL_QUESTIONS_PER_CHAPTER ? {
    actual: totalQuestions,
    expected: TOTAL_QUESTIONS_PER_CHAPTER,
    difference: totalQuestions - TOTAL_QUESTIONS_PER_CHAPTER
  } : null;
  
  const valid = categoryIssues.length === 0 && !totalIssue && categoryCounts.unknown === 0;
  
  return {
    chapter: chapterNum,
    totalQuestions,
    categoryCounts,
    categoryIssues,
    totalIssue,
    valid
  };
}

/**
 * Generate a formatted report of the analysis
 * @param {Array} results - Array of chapter analysis results
 * @returns {string} Formatted report
 */
function generateReport(results) {
  let report = '';
  
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '  QUIZ CATEGORY DISTRIBUTION ANALYSIS - CHAPTERS 1-10\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  
  report += 'Requirements:\n';
  report += `  • Each chapter must have exactly ${TOTAL_QUESTIONS_PER_CHAPTER} quiz questions\n`;
  report += `  • Each category must have at least ${MIN_QUESTIONS_PER_CATEGORY} questions\n`;
  report += `  • Categories: ${EXPECTED_CATEGORIES.join(', ')}\n\n`;
  
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'CHAPTER-BY-CHAPTER ANALYSIS\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  
  let allValid = true;
  
  results.forEach(result => {
    if (result.error) {
      report += `Chapter ${result.chapter}: ERROR - ${result.error}\n\n`;
      allValid = false;
      return;
    }
    
    const status = result.valid ? '✓ PASS' : '✗ FAIL';
    report += `Chapter ${result.chapter}: ${status}\n`;
    report += `  Total Questions: ${result.totalQuestions}`;
    
    if (result.totalIssue) {
      report += ` (Expected: ${result.totalIssue.expected}, Difference: ${result.totalIssue.difference > 0 ? '+' : ''}${result.totalIssue.difference})`;
    }
    report += '\n';
    
    report += '  Category Distribution:\n';
    EXPECTED_CATEGORIES.forEach(category => {
      const count = result.categoryCounts[category];
      const meetsRequirement = count >= MIN_QUESTIONS_PER_CATEGORY;
      const marker = meetsRequirement ? '✓' : '✗';
      report += `    ${marker} ${category.padEnd(12)}: ${String(count).padStart(2)} questions`;
      
      if (!meetsRequirement) {
        const deficit = MIN_QUESTIONS_PER_CATEGORY - count;
        report += ` (Need ${deficit} more)`;
      }
      report += '\n';
    });
    
    if (result.categoryCounts.unknown > 0) {
      report += `    ✗ unknown       : ${result.categoryCounts.unknown} questions (INVALID CATEGORY)\n`;
    }
    
    if (result.categoryIssues.length > 0 || result.totalIssue || result.categoryCounts.unknown > 0) {
      report += '\n  Issues:\n';
      
      if (result.totalIssue) {
        report += `    • Total question count is ${result.totalIssue.actual}, expected ${result.totalIssue.expected}\n`;
      }
      
      result.categoryIssues.forEach(issue => {
        report += `    • Category "${issue.category}" has only ${issue.count} questions, needs ${issue.deficit} more\n`;
      });
      
      if (result.categoryCounts.unknown > 0) {
        report += `    • Found ${result.categoryCounts.unknown} questions with unknown/invalid categories\n`;
      }
      
      allValid = false;
    }
    
    report += '\n';
  });
  
  report += '───────────────────────────────────────────────────────────────\n';
  report += 'SUMMARY\n';
  report += '───────────────────────────────────────────────────────────────\n\n';
  
  const validChapters = results.filter(r => r.valid).length;
  const totalChapters = results.length;
  
  report += `Chapters Analyzed: ${totalChapters}\n`;
  report += `Chapters Passing: ${validChapters}\n`;
  report += `Chapters Failing: ${totalChapters - validChapters}\n\n`;
  
  if (allValid) {
    report += '✓ ALL CHAPTERS MEET REQUIREMENTS\n';
    report += '\nAll chapters have:\n';
    report += `  • Exactly ${TOTAL_QUESTIONS_PER_CHAPTER} quiz questions\n`;
    report += `  • At least ${MIN_QUESTIONS_PER_CATEGORY} questions in each category\n`;
    report += '  • Valid category assignments\n';
  } else {
    report += '✗ SOME CHAPTERS DO NOT MEET REQUIREMENTS\n';
    report += '\nPlease review the issues above and update the affected chapters.\n';
  }
  
  report += '\n═══════════════════════════════════════════════════════════════\n';
  
  return report;
}

/**
 * Generate a detailed CSV report for further analysis
 * @param {Array} results - Array of chapter analysis results
 * @returns {string} CSV formatted data
 */
function generateCSVReport(results) {
  let csv = 'Chapter,Total Questions,Vocabulary,Grammar,Reading,Conversation,Unknown,Valid\n';
  
  results.forEach(result => {
    if (result.error) {
      csv += `${result.chapter},ERROR,,,,,false\n`;
    } else {
      csv += `${result.chapter},${result.totalQuestions},`;
      csv += `${result.categoryCounts.vocabulary},`;
      csv += `${result.categoryCounts.grammar},`;
      csv += `${result.categoryCounts.reading},`;
      csv += `${result.categoryCounts.conversation},`;
      csv += `${result.categoryCounts.unknown},`;
      csv += `${result.valid}\n`;
    }
  });
  
  return csv;
}

/**
 * Main execution function
 */
function main() {
  console.log('Starting quiz category distribution analysis...\n');
  
  // Analyze all chapters
  const results = CHAPTERS_TO_ANALYZE.map(chapterNum => {
    console.log(`Analyzing Chapter ${chapterNum}...`);
    return analyzeChapter(chapterNum);
  });
  
  console.log('\nAnalysis complete. Generating report...\n');
  
  // Generate and display report
  const report = generateReport(results);
  console.log(report);
  
  // Save report to file
  const reportPath = path.join(__dirname, 'QUIZ_CATEGORY_DISTRIBUTION_REPORT.md');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  // Generate and save CSV report
  const csvReport = generateCSVReport(results);
  const csvPath = path.join(__dirname, 'quiz_category_distribution.csv');
  fs.writeFileSync(csvPath, csvReport, 'utf8');
  console.log(`CSV report saved to: ${csvPath}`);
  
  // Exit with appropriate code
  const allValid = results.every(r => r.valid);
  process.exit(allValid ? 0 : 1);
}

// Run the analyzer
main();

export {
  loadChapterData,
  countQuestionsByCategory,
  analyzeChapter,
  generateReport,
  generateCSVReport
};
