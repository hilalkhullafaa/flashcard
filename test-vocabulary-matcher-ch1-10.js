/**
 * Test Script for Task 16.1: Test vocabulary matching for all chapters
 * 
 * This script tests the vocabularyMatcher.js utility with all conversation data
 * from chapters 1-10 to verify:
 * 1. Correct kanji-to-hiragana matching accuracy
 * 2. Identification of vocabulary mismatches or missing entries
 * 3. Matching performance (should complete within 100ms per turn)
 * 
 * Requirements: 1.7, 8.4, 8.5, 8.9
 */

import { readFileSync } from 'fs';
import { buildVocabularyMap, matchKanjiToHiragana, findLongestMatch } from './js/utils/vocabularyMatcher.js';
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

// Test results storage
const results = {
  totalChapters: 0,
  totalConversations: 0,
  totalTurns: 0,
  totalKanjiSequences: 0,
  matchedSequences: 0,
  unmatchedSequences: 0,
  performanceIssues: 0,
  mismatches: [],
  unmatchedKanji: [],
  performanceData: [],
  chapterSummaries: [],
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
 * Test vocabulary matching for a single conversation turn
 */
function testConversationTurn(turn, vocabularyMap, chapterId, conversationId, turnIndex) {
  const startTime = performance.now();
  
  const { japanese, hiragana } = turn;
  
  // Skip if no kanji in the text
  const segments = parseKanjiSegments(japanese);
  const kanjiSegments = segments.filter(seg => seg.isKanji);
  
  if (kanjiSegments.length === 0) {
    const endTime = performance.now();
    return {
      hasKanji: false,
      duration: endTime - startTime,
      matches: [],
      unmatched: [],
    };
  }
  
  // Perform vocabulary matching
  const matches = matchKanjiToHiragana(japanese, hiragana, vocabularyMap);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Analyze results
  const matchedKanji = [];
  const unmatchedKanji = [];
  
  for (const segment of kanjiSegments) {
    const kanji = segment.text;
    
    if (matches.has(kanji)) {
      const reading = matches.get(kanji);
      
      // Verify the match is in vocabulary
      if (vocabularyMap.has(kanji)) {
        const vocabReading = vocabularyMap.get(kanji);
        
        if (reading === vocabReading) {
          matchedKanji.push({ kanji, reading, source: 'vocabulary' });
        } else {
          // Mismatch between matched reading and vocabulary reading
          matchedKanji.push({ kanji, reading, source: 'inferred', vocabReading });
          results.mismatches.push({
            chapterId,
            conversationId,
            turnIndex,
            kanji,
            matchedReading: reading,
            vocabReading,
            japanese,
            hiragana,
          });
        }
      } else {
        // Matched but not in vocabulary (inferred from hiragana)
        matchedKanji.push({ kanji, reading, source: 'inferred' });
      }
    } else {
      // No match found
      unmatchedKanji.push({ kanji });
      results.unmatchedKanji.push({
        chapterId,
        conversationId,
        turnIndex,
        kanji,
        japanese,
        hiragana,
      });
    }
  }
  
  return {
    hasKanji: true,
    duration,
    matches: matchedKanji,
    unmatched: unmatchedKanji,
    totalKanji: kanjiSegments.length,
  };
}

/**
 * Test vocabulary matching for a single chapter
 */
function testChapter(chapterNum) {
  console.log(`\n${colors.bright}${colors.blue}Testing Chapter ${chapterNum}${colors.reset}`);
  console.log('='.repeat(60));
  
  const chapterData = loadChapterData(chapterNum);
  if (!chapterData) {
    return null;
  }
  
  // Build vocabulary map
  const vocabularyMap = buildVocabularyMap(chapterData.vocabulary);
  console.log(`Vocabulary entries: ${vocabularyMap.size}`);
  
  const conversations = chapterData.conversations || [];
  console.log(`Conversations: ${conversations.length}`);
  
  const chapterResults = {
    chapterId: chapterNum,
    conversationCount: conversations.length,
    turnCount: 0,
    kanjiSequenceCount: 0,
    matchedCount: 0,
    unmatchedCount: 0,
    inferredCount: 0,
    mismatchCount: 0,
    avgDuration: 0,
    maxDuration: 0,
    performanceIssues: 0,
  };
  
  let totalDuration = 0;
  let turnsWithKanji = 0;
  
  // Test each conversation
  for (const conversation of conversations) {
    const turns = conversation.turns || [];
    
    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i];
      chapterResults.turnCount++;
      
      const result = testConversationTurn(
        turn,
        vocabularyMap,
        chapterNum,
        conversation.id,
        i
      );
      
      if (result.hasKanji) {
        turnsWithKanji++;
        totalDuration += result.duration;
        
        chapterResults.kanjiSequenceCount += result.totalKanji;
        chapterResults.matchedCount += result.matches.length;
        chapterResults.unmatchedCount += result.unmatched.length;
        
        // Count inferred matches
        const inferredMatches = result.matches.filter(m => m.source === 'inferred');
        chapterResults.inferredCount += inferredMatches.length;
        
        // Count mismatches
        const mismatches = result.matches.filter(m => m.vocabReading && m.reading !== m.vocabReading);
        chapterResults.mismatchCount += mismatches.length;
        
        // Track max duration
        if (result.duration > chapterResults.maxDuration) {
          chapterResults.maxDuration = result.duration;
        }
        
        // Check performance requirement (100ms per turn)
        if (result.duration > 100) {
          chapterResults.performanceIssues++;
          results.performanceData.push({
            chapterId: chapterNum,
            conversationId: conversation.id,
            turnIndex: i,
            duration: result.duration,
            japanese: turn.japanese,
          });
        }
      }
    }
  }
  
  // Calculate average duration
  if (turnsWithKanji > 0) {
    chapterResults.avgDuration = totalDuration / turnsWithKanji;
  }
  
  // Update global results
  results.totalChapters++;
  results.totalConversations += chapterResults.conversationCount;
  results.totalTurns += chapterResults.turnCount;
  results.totalKanjiSequences += chapterResults.kanjiSequenceCount;
  results.matchedSequences += chapterResults.matchedCount;
  results.unmatchedSequences += chapterResults.unmatchedCount;
  results.performanceIssues += chapterResults.performanceIssues;
  
  // Print chapter summary
  console.log(`\n${colors.cyan}Chapter ${chapterNum} Summary:${colors.reset}`);
  console.log(`  Turns tested: ${chapterResults.turnCount}`);
  console.log(`  Kanji sequences: ${chapterResults.kanjiSequenceCount}`);
  console.log(`  Matched: ${colors.green}${chapterResults.matchedCount}${colors.reset}`);
  console.log(`  Unmatched: ${colors.yellow}${chapterResults.unmatchedCount}${colors.reset}`);
  console.log(`  Inferred (not in vocab): ${chapterResults.inferredCount}`);
  console.log(`  Mismatches: ${colors.red}${chapterResults.mismatchCount}${colors.reset}`);
  console.log(`  Avg duration: ${chapterResults.avgDuration.toFixed(2)}ms`);
  console.log(`  Max duration: ${chapterResults.maxDuration.toFixed(2)}ms`);
  console.log(`  Performance issues (>100ms): ${chapterResults.performanceIssues}`);
  
  results.chapterSummaries.push(chapterResults);
  return chapterResults;
}

/**
 * Print detailed mismatch report
 */
function printMismatchReport() {
  if (results.mismatches.length === 0) {
    console.log(`\n${colors.green}✓ No vocabulary mismatches found!${colors.reset}`);
    return;
  }
  
  console.log(`\n${colors.bright}${colors.red}Vocabulary Mismatches (${results.mismatches.length})${colors.reset}`);
  console.log('='.repeat(60));
  
  for (const mismatch of results.mismatches) {
    console.log(`\n${colors.yellow}Chapter ${mismatch.chapterId}, ${mismatch.conversationId}, Turn ${mismatch.turnIndex}${colors.reset}`);
    console.log(`  Kanji: ${mismatch.kanji}`);
    console.log(`  Matched reading: ${colors.red}${mismatch.matchedReading}${colors.reset}`);
    console.log(`  Vocab reading: ${colors.green}${mismatch.vocabReading}${colors.reset}`);
    console.log(`  Japanese: ${mismatch.japanese}`);
    console.log(`  Hiragana: ${mismatch.hiragana}`);
  }
}

/**
 * Print unmatched kanji report
 */
function printUnmatchedReport() {
  if (results.unmatchedKanji.length === 0) {
    console.log(`\n${colors.green}✓ All kanji sequences matched!${colors.reset}`);
    return;
  }
  
  console.log(`\n${colors.bright}${colors.yellow}Unmatched Kanji Sequences (${results.unmatchedKanji.length})${colors.reset}`);
  console.log('='.repeat(60));
  
  // Group by kanji for easier analysis
  const kanjiGroups = {};
  for (const item of results.unmatchedKanji) {
    if (!kanjiGroups[item.kanji]) {
      kanjiGroups[item.kanji] = [];
    }
    kanjiGroups[item.kanji].push(item);
  }
  
  for (const [kanji, occurrences] of Object.entries(kanjiGroups)) {
    console.log(`\n${colors.yellow}Kanji: ${kanji}${colors.reset} (${occurrences.length} occurrences)`);
    
    // Show first 3 occurrences
    for (let i = 0; i < Math.min(3, occurrences.length); i++) {
      const item = occurrences[i];
      console.log(`  Ch${item.chapterId}, ${item.conversationId}, Turn ${item.turnIndex}`);
      console.log(`    Japanese: ${item.japanese}`);
      console.log(`    Hiragana: ${item.hiragana}`);
    }
    
    if (occurrences.length > 3) {
      console.log(`  ... and ${occurrences.length - 3} more occurrences`);
    }
  }
}

/**
 * Print performance report
 */
function printPerformanceReport() {
  if (results.performanceData.length === 0) {
    console.log(`\n${colors.green}✓ All turns completed within 100ms!${colors.reset}`);
    return;
  }
  
  console.log(`\n${colors.bright}${colors.red}Performance Issues (${results.performanceData.length} turns > 100ms)${colors.reset}`);
  console.log('='.repeat(60));
  
  // Sort by duration (slowest first)
  const sorted = results.performanceData.sort((a, b) => b.duration - a.duration);
  
  // Show top 10 slowest
  for (let i = 0; i < Math.min(10, sorted.length); i++) {
    const item = sorted[i];
    console.log(`\n${colors.red}${item.duration.toFixed(2)}ms${colors.reset} - Ch${item.chapterId}, ${item.conversationId}, Turn ${item.turnIndex}`);
    console.log(`  Japanese: ${item.japanese}`);
  }
  
  if (sorted.length > 10) {
    console.log(`\n  ... and ${sorted.length - 10} more slow turns`);
  }
}

/**
 * Print final summary report
 */
function printSummaryReport() {
  console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}FINAL SUMMARY REPORT${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
  
  console.log(`\n${colors.cyan}Overall Statistics:${colors.reset}`);
  console.log(`  Chapters tested: ${results.totalChapters}`);
  console.log(`  Total conversations: ${results.totalConversations}`);
  console.log(`  Total turns: ${results.totalTurns}`);
  console.log(`  Total kanji sequences: ${results.totalKanjiSequences}`);
  
  console.log(`\n${colors.cyan}Matching Accuracy:${colors.reset}`);
  const matchRate = results.totalKanjiSequences > 0 
    ? (results.matchedSequences / results.totalKanjiSequences * 100).toFixed(2)
    : 0;
  console.log(`  Matched: ${colors.green}${results.matchedSequences}${colors.reset} (${matchRate}%)`);
  console.log(`  Unmatched: ${colors.yellow}${results.unmatchedSequences}${colors.reset}`);
  console.log(`  Mismatches: ${colors.red}${results.mismatches.length}${colors.reset}`);
  
  console.log(`\n${colors.cyan}Performance:${colors.reset}`);
  const avgDuration = results.chapterSummaries.reduce((sum, ch) => sum + ch.avgDuration, 0) / results.chapterSummaries.length;
  const maxDuration = Math.max(...results.chapterSummaries.map(ch => ch.maxDuration));
  console.log(`  Average duration per turn: ${avgDuration.toFixed(2)}ms`);
  console.log(`  Maximum duration: ${maxDuration.toFixed(2)}ms`);
  console.log(`  Performance issues (>100ms): ${colors.red}${results.performanceIssues}${colors.reset}`);
  
  console.log(`\n${colors.cyan}Requirements Validation:${colors.reset}`);
  
  // Requirement 1.7: Kanji-hiragana consistency
  const req17Pass = matchRate >= 95;
  console.log(`  Req 1.7 (Kanji-hiragana consistency ≥95%): ${req17Pass ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'} (${matchRate}%)${colors.reset}`);
  
  // Requirement 8.4: Prioritize exact matches
  const req84Pass = results.mismatches.length === 0;
  console.log(`  Req 8.4 (Exact vocabulary matches): ${req84Pass ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'} (${results.mismatches.length} mismatches)${colors.reset}`);
  
  // Requirement 8.5: Handle multiple words
  const req85Pass = results.unmatchedSequences < results.totalKanjiSequences * 0.1; // Less than 10% unmatched
  console.log(`  Req 8.5 (Handle multiple words): ${req85Pass ? colors.green + '✓ PASS' : colors.yellow + '⚠ PARTIAL'} (${results.unmatchedSequences} unmatched)${colors.reset}`);
  
  // Requirement 8.9: Performance <100ms per turn
  const req89Pass = results.performanceIssues === 0;
  console.log(`  Req 8.9 (Performance <100ms/turn): ${req89Pass ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'} (${results.performanceIssues} slow turns)${colors.reset}`);
  
  console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Main test execution
 */
function runTests() {
  console.log(`${colors.bright}${colors.blue}Vocabulary Matcher Test Suite - Chapters 1-10${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`Testing vocabulary matching accuracy and performance`);
  console.log(`Requirements: 1.7, 8.4, 8.5, 8.9\n`);
  
  // Test all chapters 1-10
  for (let i = 1; i <= 10; i++) {
    testChapter(i);
  }
  
  // Print detailed reports
  printMismatchReport();
  printUnmatchedReport();
  printPerformanceReport();
  
  // Print final summary
  printSummaryReport();
  
  // Return exit code based on results
  const hasFailures = results.mismatches.length > 0 || results.performanceIssues > 0;
  return hasFailures ? 1 : 0;
}

// Run the tests
const exitCode = runTests();
process.exit(exitCode);
