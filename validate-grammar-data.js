/**
 * Grammar Data Validation Script for Minna no Nihongo Chapters 1-10
 * 
 * This script validates grammar data to ensure:
 * 1. Grammar explanations align with Minna no Nihongo 1 textbook
 * 2. Grammar examples use vocabulary from current or previous chapters
 * 3. All required fields are present and valid
 * 4. Terminology is consistent with vocabulary dataset
 * 
 * Task: 28.1 - Review existing grammar data
 * Requirements: 5.1, 5.3, 5.4, 6.6
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
 * Validate grammar data structure
 */
function validateGrammarStructure(grammar, chapterNum) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  const requiredFields = ['id', 'chapterId', 'order', 'title', 'explanation', 'examples'];
  requiredFields.forEach(field => {
    if (!grammar[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate field types
  if (grammar.id && typeof grammar.id !== 'string') {
    errors.push(`Invalid type for 'id': expected string, got ${typeof grammar.id}`);
  }
  
  if (grammar.chapterId && typeof grammar.chapterId !== 'number') {
    errors.push(`Invalid type for 'chapterId': expected number, got ${typeof grammar.chapterId}`);
  }
  
  if (grammar.order && typeof grammar.order !== 'number') {
    errors.push(`Invalid type for 'order': expected number, got ${typeof grammar.order}`);
  }
  
  if (grammar.title && typeof grammar.title !== 'string') {
    errors.push(`Invalid type for 'title': expected string, got ${typeof grammar.title}`);
  }
  
  if (grammar.explanation && typeof grammar.explanation !== 'string') {
    errors.push(`Invalid type for 'explanation': expected string, got ${typeof grammar.explanation}`);
  }
  
  // Validate chapterId matches
  if (grammar.chapterId && grammar.chapterId !== chapterNum) {
    errors.push(`chapterId mismatch: expected ${chapterNum}, got ${grammar.chapterId}`);
  }
  
  // Validate examples array
  if (grammar.examples) {
    if (!Array.isArray(grammar.examples)) {
      errors.push(`'examples' must be an array`);
    } else if (grammar.examples.length === 0) {
      warnings.push(`'examples' array is empty`);
    } else {
      // Validate each example
      grammar.examples.forEach((example, idx) => {
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
 * Validate grammar examples use appropriate vocabulary
 */
function validateGrammarVocabulary(grammar, vocabSet) {
  const issues = [];
  
  if (!grammar.examples || !Array.isArray(grammar.examples)) {
    return issues;
  }
  
  grammar.examples.forEach((example, idx) => {
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
 * Check grammar terminology consistency with Minna no Nihongo
 */
function validateGrammarTerminology(grammar) {
  const issues = [];
  
  if (!grammar.title && !grammar.explanation) return issues;
  
  const text = `${grammar.title || ''} ${grammar.explanation || ''}`;
  
  // Common Minna no Nihongo grammar terminology
  const standardTerms = {
    particles: ['partikel', 'は', 'が', 'を', 'に', 'で', 'と', 'の', 'へ', 'から', 'まで', 'も', 'か'],
    verbForms: ['ます', 'ません', 'ました', 'ませんでした', 'て形', 'た形', 'ない形', 'dictionary form'],
    adjectives: ['い-adjektiva', 'な-adjektiva', 'い形容詞', 'な形容詞'],
    copula: ['です', 'だ', 'である', 'では ありません', 'じゃ ありません'],
    sentence: ['kalimat', 'pola', 'struktur', 'subjek', 'predikat', 'objek']
  };
  
  // Check if grammar uses standard terminology
  let hasStandardTerms = false;
  Object.values(standardTerms).forEach(termList => {
    termList.forEach(term => {
      if (text.includes(term)) {
        hasStandardTerms = true;
      }
    });
  });
  
  if (!hasStandardTerms) {
    issues.push({
      title: grammar.title,
      message: 'Grammar may not use standard Minna no Nihongo terminology'
    });
  }
  
  return issues;
}

/**
 * Validate all grammar entries for a chapter
 */
function validateChapterGrammar(chapterNum, cumulativeVocab) {
  console.log(`\n${colors.bright}${colors.blue}=== Chapter ${chapterNum} Grammar Validation ===${colors.reset}`);
  
  const chapterData = loadChapterData(chapterNum);
  if (!chapterData) {
    console.log(`${colors.red}✗ Failed to load chapter data${colors.reset}`);
    return null;
  }
  
  if (!chapterData.grammar || !Array.isArray(chapterData.grammar)) {
    console.log(`${colors.yellow}⚠ No grammar found in chapter${colors.reset}`);
    return {
      chapterNum,
      grammarCount: 0,
      structureErrors: 0,
      vocabularyIssues: 0,
      terminologyIssues: 0,
      grammar: []
    };
  }
  
  const vocabSet = cumulativeVocab[chapterNum];
  const results = {
    chapterNum,
    grammarCount: chapterData.grammar.length,
    structureErrors: 0,
    vocabularyIssues: 0,
    terminologyIssues: 0,
    grammar: []
  };
  
  console.log(`Found ${chapterData.grammar.length} grammar entries`);
  
  chapterData.grammar.forEach((grammar, idx) => {
    const grammarResult = {
      id: grammar.id || `grammar_${idx + 1}`,
      order: grammar.order || idx + 1,
      title: grammar.title || 'N/A',
      structureValidation: null,
      vocabularyValidation: [],
      terminologyValidation: []
    };
    
    // Validate structure
    const structureValidation = validateGrammarStructure(grammar, chapterNum);
    grammarResult.structureValidation = structureValidation;
    
    if (structureValidation.errors.length > 0) {
      results.structureErrors += structureValidation.errors.length;
      console.log(`\n${colors.red}✗ Grammar ${grammar.id || idx + 1}:${colors.reset}`);
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
    const vocabValidation = validateGrammarVocabulary(grammar, vocabSet);
    grammarResult.vocabularyValidation = vocabValidation;
    
    if (vocabValidation.length > 0) {
      results.vocabularyIssues += vocabValidation.length;
      if (structureValidation.errors.length === 0) {
        console.log(`\n${colors.yellow}⚠ Grammar ${grammar.id || idx + 1}:${colors.reset} ${grammar.title}`);
      }
      vocabValidation.forEach(issue => {
        console.log(`  ${colors.yellow}VOCAB: Example ${issue.exampleIndex}: ${issue.message}${colors.reset}`);
        console.log(`    Japanese: ${issue.japanese}`);
        console.log(`    Potential issues: ${issue.potentialIssues.join(', ')}`);
      });
    }
    
    // Validate terminology
    const terminologyValidation = validateGrammarTerminology(grammar);
    grammarResult.terminologyValidation = terminologyValidation;
    
    if (terminologyValidation.length > 0) {
      results.terminologyIssues += terminologyValidation.length;
      if (structureValidation.errors.length === 0 && vocabValidation.length === 0) {
        console.log(`\n${colors.yellow}⚠ Grammar ${grammar.id || idx + 1}:${colors.reset}`);
      }
      terminologyValidation.forEach(issue => {
        console.log(`  ${colors.yellow}TERMINOLOGY: ${issue.message}${colors.reset}`);
        console.log(`    Title: ${issue.title}`);
      });
    }
    
    // Success message if no issues
    if (structureValidation.errors.length === 0 && 
        vocabValidation.length === 0 && 
        terminologyValidation.length === 0) {
      console.log(`${colors.green}✓ Grammar ${grammar.id || idx + 1}: ${grammar.title}${colors.reset}`);
    }
    
    results.grammar.push(grammarResult);
  });
  
  // Chapter summary
  console.log(`\n${colors.cyan}Chapter ${chapterNum} Summary:${colors.reset}`);
  console.log(`  Total grammar entries: ${results.grammarCount}`);
  console.log(`  Structure errors: ${results.structureErrors > 0 ? colors.red : colors.green}${results.structureErrors}${colors.reset}`);
  console.log(`  Vocabulary issues: ${results.vocabularyIssues > 0 ? colors.yellow : colors.green}${results.vocabularyIssues}${colors.reset}`);
  console.log(`  Terminology issues: ${results.terminologyIssues > 0 ? colors.yellow : colors.green}${results.terminologyIssues}${colors.reset}`);
  
  return results;
}

/**
 * Generate comprehensive validation report
 */
function generateReport(allResults) {
  console.log(`\n\n${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  GRAMMAR DATA VALIDATION REPORT${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  Chapters 1-10${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}\n`);
  
  const summary = {
    totalGrammar: 0,
    totalStructureErrors: 0,
    totalVocabularyIssues: 0,
    totalTerminologyIssues: 0,
    chaptersWithIssues: []
  };
  
  allResults.forEach(result => {
    if (!result) return;
    
    summary.totalGrammar += result.grammarCount;
    summary.totalStructureErrors += result.structureErrors;
    summary.totalVocabularyIssues += result.vocabularyIssues;
    summary.totalTerminologyIssues += result.terminologyIssues;
    
    if (result.structureErrors > 0 || result.vocabularyIssues > 0 || result.terminologyIssues > 0) {
      summary.chaptersWithIssues.push(result.chapterNum);
    }
  });
  
  console.log(`${colors.bright}Overall Summary:${colors.reset}`);
  console.log(`  Total grammar entries validated: ${summary.totalGrammar}`);
  console.log(`  Structure errors: ${summary.totalStructureErrors > 0 ? colors.red : colors.green}${summary.totalStructureErrors}${colors.reset}`);
  console.log(`  Vocabulary issues: ${summary.totalVocabularyIssues > 0 ? colors.yellow : colors.green}${summary.totalVocabularyIssues}${colors.reset}`);
  console.log(`  Terminology issues: ${summary.totalTerminologyIssues > 0 ? colors.yellow : colors.green}${summary.totalTerminologyIssues}${colors.reset}`);
  
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
  
  if (summary.totalTerminologyIssues > 0) {
    console.log(`  ${colors.yellow}• Review terminology issues - grammar should follow Minna no Nihongo standards${colors.reset}`);
  }
  
  if (summary.totalStructureErrors === 0 && 
      summary.totalVocabularyIssues === 0 && 
      summary.totalTerminologyIssues === 0) {
    console.log(`  ${colors.green}• Grammar data is well-structured and aligned with textbook standards${colors.reset}`);
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
  
  const reportPath = path.join(__dirname, 'TASK28.1_GRAMMAR_VALIDATION_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  console.log(`\n${colors.cyan}Detailed report saved to: ${reportPath}${colors.reset}`);
}

/**
 * Save summary report to markdown file
 */
function saveSummaryReport(allResults, summary) {
  let markdown = `# Grammar Data Validation Report\n\n`;
  markdown += `**Task:** 28.1 - Review existing grammar data\n`;
  markdown += `**Requirements:** 5.1, 5.3, 5.4, 6.6\n`;
  markdown += `**Date:** ${new Date().toISOString()}\n\n`;
  
  markdown += `## Overall Summary\n\n`;
  markdown += `- **Total grammar entries validated:** ${summary.totalGrammar}\n`;
  markdown += `- **Structure errors:** ${summary.totalStructureErrors}\n`;
  markdown += `- **Vocabulary issues:** ${summary.totalVocabularyIssues}\n`;
  markdown += `- **Terminology issues:** ${summary.totalTerminologyIssues}\n\n`;
  
  if (summary.chaptersWithIssues.length > 0) {
    markdown += `**Chapters with issues:** ${summary.chaptersWithIssues.join(', ')}\n\n`;
  } else {
    markdown += `✅ **All chapters passed validation!**\n\n`;
  }
  
  markdown += `## Chapter Details\n\n`;
  
  allResults.forEach(result => {
    if (!result) return;
    
    markdown += `### Chapter ${result.chapterNum}\n\n`;
    markdown += `- Grammar entries: ${result.grammarCount}\n`;
    markdown += `- Structure errors: ${result.structureErrors}\n`;
    markdown += `- Vocabulary issues: ${result.vocabularyIssues}\n`;
    markdown += `- Terminology issues: ${result.terminologyIssues}\n\n`;
    
    if (result.structureErrors > 0 || result.vocabularyIssues > 0 || result.terminologyIssues > 0) {
      markdown += `#### Issues Found\n\n`;
      
      result.grammar.forEach(grammar => {
        const hasIssues = 
          (grammar.structureValidation && grammar.structureValidation.errors.length > 0) ||
          grammar.vocabularyValidation.length > 0 ||
          grammar.terminologyValidation.length > 0;
        
        if (hasIssues) {
          markdown += `**${grammar.id}:** ${grammar.title}\n\n`;
          
          if (grammar.structureValidation && grammar.structureValidation.errors.length > 0) {
            markdown += `- Structure errors:\n`;
            grammar.structureValidation.errors.forEach(error => {
              markdown += `  - ${error}\n`;
            });
          }
          
          if (grammar.vocabularyValidation.length > 0) {
            markdown += `- Vocabulary issues:\n`;
            grammar.vocabularyValidation.forEach(issue => {
              markdown += `  - Example ${issue.exampleIndex}: ${issue.message}\n`;
              markdown += `    - Japanese: ${issue.japanese}\n`;
              markdown += `    - Potential issues: ${issue.potentialIssues.join(', ')}\n`;
            });
          }
          
          if (grammar.terminologyValidation.length > 0) {
            markdown += `- Terminology issues:\n`;
            grammar.terminologyValidation.forEach(issue => {
              markdown += `  - ${issue.message}\n`;
            });
          }
          
          markdown += `\n`;
        }
      });
    }
  });
  
  markdown += `## Recommendations\n\n`;
  
  if (summary.totalStructureErrors > 0) {
    markdown += `- ❌ **Fix structure errors immediately** - these prevent proper data loading\n`;
  }
  
  if (summary.totalVocabularyIssues > 0) {
    markdown += `- ⚠️ **Review vocabulary issues** - examples should use words from current or previous chapters\n`;
  }
  
  if (summary.totalTerminologyIssues > 0) {
    markdown += `- ⚠️ **Review terminology issues** - grammar should follow Minna no Nihongo standards\n`;
  }
  
  if (summary.totalStructureErrors === 0 && 
      summary.totalVocabularyIssues === 0 && 
      summary.totalTerminologyIssues === 0) {
    markdown += `- ✅ Grammar data is well-structured and aligned with textbook standards\n`;
    markdown += `- ✅ Ready for production use\n`;
  }
  
  const reportPath = path.join(__dirname, 'TASK28.1_GRAMMAR_VALIDATION_SUMMARY.md');
  fs.writeFileSync(reportPath, markdown, 'utf8');
  
  console.log(`${colors.cyan}Summary report saved to: ${reportPath}${colors.reset}`);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bright}${colors.cyan}Grammar Data Validation Script${colors.reset}`);
  console.log(`${colors.cyan}Task 28.1: Review existing grammar data${colors.reset}`);
  console.log(`${colors.cyan}Requirements: 5.1, 5.3, 5.4, 6.6${colors.reset}\n`);
  
  // Build cumulative vocabulary for all chapters
  console.log(`${colors.bright}Building cumulative vocabulary map...${colors.reset}`);
  const cumulativeVocab = buildCumulativeVocabulary(10);
  console.log(`${colors.green}✓ Vocabulary map built for chapters 1-10${colors.reset}`);
  
  // Validate each chapter
  const allResults = [];
  for (let i = 1; i <= 10; i++) {
    const result = validateChapterGrammar(i, cumulativeVocab);
    allResults.push(result);
  }
  
  // Generate and display report
  const summary = generateReport(allResults);
  
  // Save detailed report
  saveDetailedReport(allResults, summary);
  
  // Save summary report
  saveSummaryReport(allResults, summary);
  
  // Exit with appropriate code
  if (summary.totalStructureErrors > 0) {
    console.log(`\n${colors.red}Validation failed with errors${colors.reset}`);
    process.exit(1);
  } else if (summary.totalVocabularyIssues > 0 || summary.totalTerminologyIssues > 0) {
    console.log(`\n${colors.yellow}Validation completed with warnings${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}Validation passed successfully${colors.reset}`);
    process.exit(0);
  }
}

// Run the script
main();
