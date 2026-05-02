/**
 * Validation script for quiz data in chapters 1-10
 * Tests the validateQuizQuestion utility against actual chapter data
 */

import { readFileSync } from 'fs';
import { validateQuizQuestion, validateChapterData } from './js/utils/validation.js';

// Validate quiz data for chapters 1-10
async function validateAllQuizData() {
  console.log('Validating quiz data for chapters 1-10...\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalQuestions = 0;
  
  for (let chapterId = 1; chapterId <= 10; chapterId++) {
    const chapterFile = `data/ch${String(chapterId).padStart(2, '0')}.json`;
    
    try {
      const chapterData = JSON.parse(readFileSync(chapterFile, 'utf-8'));
      const quiz = chapterData.quiz || [];
      
      console.log(`\n=== Chapter ${chapterId} ===`);
      console.log(`Total questions: ${quiz.length}`);
      
      // Validate each question
      let chapterErrors = 0;
      let chapterWarnings = 0;
      
      quiz.forEach((question, index) => {
        const result = validateQuizQuestion(question);
        
        if (!result.valid) {
          chapterErrors++;
          console.log(`\n  Question ${index + 1} (${question.id || 'unknown'}):`);
          result.errors.forEach(error => {
            console.log(`    ❌ ${error}`);
          });
        }
        
        if (result.warnings.length > 0) {
          chapterWarnings++;
          result.warnings.forEach(warning => {
            console.log(`    ⚠️  ${warning}`);
          });
        }
      });
      
      totalQuestions += quiz.length;
      totalErrors += chapterErrors;
      totalWarnings += chapterWarnings;
      
      if (chapterErrors === 0 && chapterWarnings === 0) {
        console.log('  ✅ All questions valid!');
      } else {
        console.log(`\n  Summary: ${chapterErrors} errors, ${chapterWarnings} warnings`);
      }
      
      // Also validate chapter data structure
      const chapterResult = validateChapterData(chapterData, chapterId);
      if (!chapterResult.valid) {
        console.log('\n  Chapter-level validation errors:');
        chapterResult.errors.forEach(error => {
          console.log(`    ❌ ${error}`);
        });
      }
      
    } catch (error) {
      console.error(`  ❌ Error reading ${chapterFile}: ${error.message}`);
      totalErrors++;
    }
  }
  
  // Summary
  console.log('\n\n=== VALIDATION SUMMARY ===');
  console.log(`Total questions validated: ${totalQuestions}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  
  if (totalErrors === 0) {
    console.log('\n✅ All quiz data is valid!');
  } else {
    console.log('\n❌ Validation failed. Please fix the errors above.');
    process.exit(1);
  }
}

// Run validation
validateAllQuizData().catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});
