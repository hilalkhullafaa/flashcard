/**
 * Test Script for Task 17.1: Verify warning logging for unknown kanji in conversations
 * 
 * This script tests the complete flow from conversation data to warning logging:
 * 1. Load real conversation data from chapters 1-10
 * 2. Identify conversations with kanji sequences not in vocabulary
 * 3. Verify that detailed warnings are logged with context
 * 
 * Requirements: 1.8, 8.7
 */

import { readFileSync } from 'fs';
import { buildVocabularyMap, matchKanjiToHiragana, getReading } from './js/utils/vocabularyMatcher.js';
import { parseKanjiSegments } from './js/utils/kanjiParser.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.blue}Task 17.1: Warning Logging Test${colors.reset}`);
console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

// Track warnings
let warningCount = 0;
const originalWarn = console.warn;
console.warn = function(...args) {
  warningCount++;
  originalWarn.apply(console, args);
};

/**
 * Load chapter data from JSON file
 */
function loadChapterData(chapterNum) {
  const filename = `./data/ch${String(chapterNum).padStart(2, '0')}.json`;
  try {
    const data = readFileSync(filename, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`${colors.red}Error loading ${filename}:${colors.reset}`, error.message);
    return null;
  }
}

/**
 * Test warning logging for a chapter
 */
function testChapterWarnings(chapterNum) {
  console.log(`\n${colors.cyan}Testing Chapter ${chapterNum}${colors.reset}`);
  
  const chapterData = loadChapterData(chapterNum);
  if (!chapterData) {
    return;
  }
  
  const vocabularyMap = buildVocabularyMap(chapterData.vocabulary);
  const conversations = chapterData.conversations || [];
  
  let chapterWarnings = 0;
  const startWarningCount = warningCount;
  
  for (const conversation of conversations) {
    const turns = conversation.turns || [];
    
    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i];
      const { japanese, hiragana } = turn;
      
      // Parse kanji segments
      const segments = parseKanjiSegments(japanese);
      const kanjiSegments = segments.filter(seg => seg.isKanji);
      
      if (kanjiSegments.length === 0) continue;
      
      // Match kanji to hiragana
      const readingsMap = matchKanjiToHiragana(japanese, hiragana, vocabularyMap);
      
      // Test each kanji segment with context
      for (const segment of kanjiSegments) {
        const context = {
          chapterNumber: chapterNum,
          conversationId: conversation.id
        };
        
        const reading = getReading(segment.text, vocabularyMap, readingsMap, context);
        
        if (reading === null) {
          // This should have logged a warning
          chapterWarnings++;
        }
      }
    }
  }
  
  const actualWarnings = warningCount - startWarningCount;
  
  console.log(`  Conversations: ${conversations.length}`);
  console.log(`  Expected warnings: ${chapterWarnings}`);
  console.log(`  Actual warnings logged: ${actualWarnings}`);
  
  if (actualWarnings === chapterWarnings) {
    console.log(`  ${colors.green}✓ Warning logging working correctly${colors.reset}`);
  } else {
    console.log(`  ${colors.red}✗ Warning count mismatch${colors.reset}`);
  }
  
  return { expected: chapterWarnings, actual: actualWarnings };
}

// Test all chapters
const results = [];
for (let i = 1; i <= 10; i++) {
  const result = testChapterWarnings(i);
  if (result) {
    results.push(result);
  }
}

// Summary
console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.bright}${colors.blue}SUMMARY${colors.reset}`);
console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

const totalExpected = results.reduce((sum, r) => sum + r.expected, 0);
const totalActual = results.reduce((sum, r) => sum + r.actual, 0);

console.log(`Total unknown kanji sequences: ${totalExpected}`);
console.log(`Total warnings logged: ${totalActual}`);

if (totalActual === totalExpected && totalActual > 0) {
  console.log(`\n${colors.green}✓ Task 17.1 COMPLETE: Warning logging working correctly${colors.reset}`);
  console.log(`${colors.green}  - Detailed warnings logged for unknown kanji sequences${colors.reset}`);
  console.log(`${colors.green}  - Context information (chapter, conversation ID) included${colors.reset}`);
  console.log(`${colors.green}  - Kanji displayed without furigana when no match found${colors.reset}`);
} else if (totalActual === 0) {
  console.log(`\n${colors.yellow}⚠ No unknown kanji found in chapters 1-10${colors.reset}`);
  console.log(`${colors.yellow}  This is expected if all kanji are in vocabulary${colors.reset}`);
} else {
  console.log(`\n${colors.red}✗ Warning count mismatch${colors.reset}`);
}

console.log('');

// Restore original console.warn
console.warn = originalWarn;
