/**
 * Performance Profiling Script for Furigana Generation
 * 
 * This script profiles furigana generation performance for all chapters 1-10
 * to ensure generation completes within 100ms per conversation turn.
 * 
 * Requirements: 8.9, 12.3
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { 
  parseKanjiSegments, 
  containsKanji 
} from './js/utils/kanjiParser.js';
import { 
  matchKanjiToHiragana, 
  getReading, 
  buildVocabularyMap 
} from './js/utils/vocabularyMatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate ruby text (furigana) - same logic as conversation.js
 */
function generateRubyText(kanjiText, hiraganaText, vocabularyMap = null) {
  if (kanjiText === hiraganaText || !containsKanji(kanjiText)) {
    return kanjiText;
  }
  
  const segments = parseKanjiSegments(kanjiText);
  const readingsMap = matchKanjiToHiragana(kanjiText, hiraganaText, vocabularyMap);
  
  let result = '';
  
  for (const segment of segments) {
    if (segment.isKanji) {
      const reading = getReading(segment.text, vocabularyMap, readingsMap);
      
      if (reading) {
        result += `<ruby>${segment.text}<rt style="font-size: 0.5em; opacity: 0.8;">${reading}</rt></ruby>`;
      } else {
        result += segment.text;
      }
    } else {
      result += segment.text;
    }
  }
  
  return result;
}

/**
 * Profile furigana generation for a single conversation turn
 */
function profileTurn(turn, vocabularyMap, chapterNumber, conversationId) {
  const startTime = performance.now();
  
  const result = generateRubyText(
    turn.japanese,
    turn.hiragana,
    vocabularyMap
  );
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  return {
    chapterNumber,
    conversationId,
    speaker: turn.speaker,
    japanese: turn.japanese,
    duration,
    exceedsThreshold: duration > 100,
    resultLength: result.length
  };
}

/**
 * Profile furigana generation for all conversations in a chapter
 */
function profileChapter(chapterNumber) {
  const chapterFile = join(__dirname, `data/ch${String(chapterNumber).padStart(2, '0')}.json`);
  
  let chapterData;
  try {
    const fileContent = readFileSync(chapterFile, 'utf-8');
    chapterData = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load chapter ${chapterNumber}:`, error.message);
    return null;
  }
  
  const conversations = chapterData.conversations || [];
  const vocabulary = chapterData.vocabulary || [];
  
  // Build vocabulary map
  const vocabularyMap = buildVocabularyMap(vocabulary);
  
  const results = [];
  
  for (const conversation of conversations) {
    if (!conversation.turns || !Array.isArray(conversation.turns)) {
      continue;
    }
    
    for (const turn of conversation.turns) {
      if (!turn.japanese || !turn.hiragana) {
        continue;
      }
      
      const result = profileTurn(
        turn,
        vocabularyMap,
        chapterNumber,
        conversation.id
      );
      
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Generate performance report
 */
function generateReport(allResults) {
  console.log('\n=== Furigana Generation Performance Report ===\n');
  
  // Overall statistics
  const totalTurns = allResults.length;
  const exceedingThreshold = allResults.filter(r => r.exceedsThreshold);
  const durations = allResults.map(r => r.duration);
  
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const medianDuration = durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)];
  
  console.log('Overall Statistics:');
  console.log(`  Total conversation turns: ${totalTurns}`);
  console.log(`  Average duration: ${avgDuration.toFixed(2)}ms`);
  console.log(`  Median duration: ${medianDuration.toFixed(2)}ms`);
  console.log(`  Min duration: ${minDuration.toFixed(2)}ms`);
  console.log(`  Max duration: ${maxDuration.toFixed(2)}ms`);
  console.log(`  Turns exceeding 100ms threshold: ${exceedingThreshold.length} (${(exceedingThreshold.length / totalTurns * 100).toFixed(1)}%)`);
  
  // Per-chapter statistics
  console.log('\nPer-Chapter Statistics:');
  for (let ch = 1; ch <= 10; ch++) {
    const chapterResults = allResults.filter(r => r.chapterNumber === ch);
    if (chapterResults.length === 0) continue;
    
    const chapterDurations = chapterResults.map(r => r.duration);
    const chapterAvg = chapterDurations.reduce((a, b) => a + b, 0) / chapterDurations.length;
    const chapterMax = Math.max(...chapterDurations);
    const chapterExceeding = chapterResults.filter(r => r.exceedsThreshold).length;
    
    console.log(`  Chapter ${ch}:`);
    console.log(`    Turns: ${chapterResults.length}`);
    console.log(`    Avg: ${chapterAvg.toFixed(2)}ms`);
    console.log(`    Max: ${chapterMax.toFixed(2)}ms`);
    console.log(`    Exceeding threshold: ${chapterExceeding}`);
  }
  
  // Show slowest turns
  if (exceedingThreshold.length > 0) {
    console.log('\nSlowest Turns (exceeding 100ms threshold):');
    const slowest = exceedingThreshold.sort((a, b) => b.duration - a.duration).slice(0, 10);
    
    for (const result of slowest) {
      console.log(`  Chapter ${result.chapterNumber}, ${result.conversationId}:`);
      console.log(`    Speaker: ${result.speaker}`);
      console.log(`    Duration: ${result.duration.toFixed(2)}ms`);
      console.log(`    Text: ${result.japanese.substring(0, 50)}${result.japanese.length > 50 ? '...' : ''}`);
    }
  }
  
  // Performance bottleneck analysis
  console.log('\nPerformance Bottleneck Analysis:');
  
  // Analyze by text length
  const shortTexts = allResults.filter(r => r.japanese.length < 20);
  const mediumTexts = allResults.filter(r => r.japanese.length >= 20 && r.japanese.length < 50);
  const longTexts = allResults.filter(r => r.japanese.length >= 50);
  
  console.log('  By text length:');
  if (shortTexts.length > 0) {
    const avgShort = shortTexts.reduce((sum, r) => sum + r.duration, 0) / shortTexts.length;
    console.log(`    Short (<20 chars): ${shortTexts.length} turns, avg ${avgShort.toFixed(2)}ms`);
  }
  if (mediumTexts.length > 0) {
    const avgMedium = mediumTexts.reduce((sum, r) => sum + r.duration, 0) / mediumTexts.length;
    console.log(`    Medium (20-50 chars): ${mediumTexts.length} turns, avg ${avgMedium.toFixed(2)}ms`);
  }
  if (longTexts.length > 0) {
    const avgLong = longTexts.reduce((sum, r) => sum + r.duration, 0) / longTexts.length;
    console.log(`    Long (>50 chars): ${longTexts.length} turns, avg ${avgLong.toFixed(2)}ms`);
  }
  
  // Conclusion
  console.log('\nConclusion:');
  if (exceedingThreshold.length === 0) {
    console.log('  ✓ All conversation turns complete within 100ms threshold');
    console.log('  ✓ Performance requirement met (Requirement 12.3)');
  } else {
    console.log(`  ✗ ${exceedingThreshold.length} turns exceed 100ms threshold`);
    console.log('  ✗ Performance optimization needed');
    console.log('\nRecommendations:');
    console.log('  1. Implement vocabulary mapping cache (Task 19.2)');
    console.log('  2. Optimize DOM update operations');
    console.log('  3. Consider lazy loading for long conversations');
  }
  
  console.log('\n=== End of Report ===\n');
}

/**
 * Main profiling function
 */
function main() {
  console.log('Starting furigana generation performance profiling...\n');
  
  const allResults = [];
  
  // Profile all chapters 1-10
  for (let ch = 1; ch <= 10; ch++) {
    console.log(`Profiling Chapter ${ch}...`);
    const results = profileChapter(ch);
    
    if (results) {
      allResults.push(...results);
      console.log(`  Processed ${results.length} conversation turns`);
    }
  }
  
  // Generate report
  generateReport(allResults);
}

// Run profiling
main();
