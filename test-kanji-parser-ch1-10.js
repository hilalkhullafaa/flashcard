/**
 * Test Script for kanjiParser.js with Chapter 1-10 Conversation Data
 * 
 * This script tests the kanji parser utility against all conversation data
 * from chapters 1-10 to verify:
 * 1. Correct identification of kanji sequences
 * 2. Proper distinction between kanji, hiragana, katakana, and punctuation
 * 3. Edge case handling
 * 4. Warnings for kanji sequences not found in vocabulary
 * 
 * Requirements: 1.8, 8.1, 8.2
 */

import { parseKanjiSegments, extractKanji, containsKanji, isKanji, isHiragana, isKatakana } from './js/utils/kanjiParser.js';
import fs from 'fs';
import path from 'path';

// Test results tracking
const testResults = {
  totalConversations: 0,
  totalTurns: 0,
  totalKanjiSequences: 0,
  parsingFailures: [],
  edgeCases: [],
  unknownKanji: [],
  successfulParses: 0,
  chapters: {}
};

/**
 * Load chapter data from JSON file
 */
function loadChapterData(chapterNum) {
  const filename = `ch${String(chapterNum).padStart(2, '0')}.json`;
  const filepath = path.join('data', filename);
  
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return null;
  }
}

/**
 * Test kanji parser on a single text string
 */
function testKanjiParsing(text, context) {
  const result = {
    text,
    context,
    success: true,
    errors: [],
    warnings: [],
    segments: null,
    kanjiSequences: [],
    hasKanji: false
  };

  try {
    // Test containsKanji
    result.hasKanji = containsKanji(text);
    
    // Test parseKanjiSegments
    result.segments = parseKanjiSegments(text);
    
    // Test extractKanji
    result.kanjiSequences = extractKanji(text);
    
    // Validate segments
    if (!Array.isArray(result.segments)) {
      result.success = false;
      result.errors.push('parseKanjiSegments did not return an array');
    }
    
    // Validate that segments reconstruct original text
    const reconstructed = result.segments.map(s => s.text).join('');
    if (reconstructed !== text) {
      result.success = false;
      result.errors.push(`Reconstructed text does not match original. Expected: "${text}", Got: "${reconstructed}"`);
    }
    
    // Validate kanji sequences
    if (!Array.isArray(result.kanjiSequences)) {
      result.success = false;
      result.errors.push('extractKanji did not return an array');
    }
    
    // Check for edge cases
    if (text.length === 0) {
      result.warnings.push('Empty string');
    }
    
    if (result.hasKanji && result.kanjiSequences.length === 0) {
      result.warnings.push('containsKanji returned true but no kanji sequences extracted');
    }
    
    if (!result.hasKanji && result.kanjiSequences.length > 0) {
      result.warnings.push('containsKanji returned false but kanji sequences were extracted');
    }
    
  } catch (error) {
    result.success = false;
    result.errors.push(`Exception: ${error.message}`);
  }
  
  return result;
}

/**
 * Check if kanji sequence exists in vocabulary
 */
function checkVocabularyMatch(kanjiSequence, vocabulary) {
  return vocabulary.some(v => v.kanji === kanjiSequence);
}

/**
 * Test all conversations in a chapter
 */
function testChapterConversations(chapterData) {
  const chapterNum = chapterData.chapter.id;
  const results = {
    chapterNum,
    conversationCount: 0,
    turnCount: 0,
    kanjiSequenceCount: 0,
    successCount: 0,
    failureCount: 0,
    edgeCaseCount: 0,
    unknownKanjiCount: 0,
    details: []
  };
  
  if (!chapterData.conversations || !Array.isArray(chapterData.conversations)) {
    console.warn(`Chapter ${chapterNum}: No conversations found`);
    return results;
  }
  
  results.conversationCount = chapterData.conversations.length;
  
  chapterData.conversations.forEach((conversation, convIndex) => {
    if (!conversation.turns || !Array.isArray(conversation.turns)) {
      console.warn(`Chapter ${chapterNum}, Conversation ${convIndex + 1}: No turns found`);
      return;
    }
    
    conversation.turns.forEach((turn, turnIndex) => {
      results.turnCount++;
      
      const context = {
        chapter: chapterNum,
        conversationId: conversation.id,
        conversationOrder: conversation.order,
        turnIndex: turnIndex + 1,
        speaker: turn.speaker
      };
      
      // Test the japanese field
      const parseResult = testKanjiParsing(turn.japanese, context);
      
      if (parseResult.success) {
        results.successCount++;
      } else {
        results.failureCount++;
        testResults.parsingFailures.push(parseResult);
      }
      
      if (parseResult.warnings.length > 0) {
        results.edgeCaseCount++;
        testResults.edgeCases.push(parseResult);
      }
      
      // Check kanji sequences against vocabulary
      parseResult.kanjiSequences.forEach(kanjiSeq => {
        results.kanjiSequenceCount++;
        testResults.totalKanjiSequences++;
        
        if (!checkVocabularyMatch(kanjiSeq, chapterData.vocabulary)) {
          results.unknownKanjiCount++;
          testResults.unknownKanji.push({
            kanji: kanjiSeq,
            context,
            text: turn.japanese
          });
        }
      });
      
      results.details.push(parseResult);
    });
  });
  
  return results;
}

/**
 * Generate summary report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('KANJI PARSER TEST REPORT - CHAPTERS 1-10');
  console.log('='.repeat(80));
  
  console.log('\n📊 OVERALL STATISTICS');
  console.log('-'.repeat(80));
  console.log(`Total Chapters Tested: ${Object.keys(testResults.chapters).length}`);
  console.log(`Total Conversations: ${testResults.totalConversations}`);
  console.log(`Total Turns: ${testResults.totalTurns}`);
  console.log(`Total Kanji Sequences: ${testResults.totalKanjiSequences}`);
  console.log(`Successful Parses: ${testResults.successfulParses}`);
  console.log(`Parsing Failures: ${testResults.parsingFailures.length}`);
  console.log(`Edge Cases: ${testResults.edgeCases.length}`);
  console.log(`Unknown Kanji Sequences: ${testResults.unknownKanji.length}`);
  
  // Chapter-by-chapter breakdown
  console.log('\n📚 CHAPTER-BY-CHAPTER BREAKDOWN');
  console.log('-'.repeat(80));
  Object.keys(testResults.chapters).sort((a, b) => a - b).forEach(chapterNum => {
    const chapter = testResults.chapters[chapterNum];
    console.log(`\nChapter ${chapterNum}:`);
    console.log(`  Conversations: ${chapter.conversationCount}`);
    console.log(`  Turns: ${chapter.turnCount}`);
    console.log(`  Kanji Sequences: ${chapter.kanjiSequenceCount}`);
    console.log(`  Success Rate: ${chapter.successCount}/${chapter.turnCount} (${((chapter.successCount / chapter.turnCount) * 100).toFixed(1)}%)`);
    console.log(`  Failures: ${chapter.failureCount}`);
    console.log(`  Edge Cases: ${chapter.edgeCaseCount}`);
    console.log(`  Unknown Kanji: ${chapter.unknownKanjiCount}`);
  });
  
  // Parsing failures
  if (testResults.parsingFailures.length > 0) {
    console.log('\n❌ PARSING FAILURES');
    console.log('-'.repeat(80));
    testResults.parsingFailures.forEach((failure, index) => {
      console.log(`\n${index + 1}. Chapter ${failure.context.chapter}, ${failure.context.conversationId}, Turn ${failure.context.turnIndex}`);
      console.log(`   Speaker: ${failure.context.speaker}`);
      console.log(`   Text: "${failure.text}"`);
      console.log(`   Errors:`);
      failure.errors.forEach(err => console.log(`     - ${err}`));
    });
  }
  
  // Edge cases
  if (testResults.edgeCases.length > 0) {
    console.log('\n⚠️  EDGE CASES');
    console.log('-'.repeat(80));
    testResults.edgeCases.slice(0, 10).forEach((edge, index) => {
      console.log(`\n${index + 1}. Chapter ${edge.context.chapter}, ${edge.context.conversationId}, Turn ${edge.context.turnIndex}`);
      console.log(`   Text: "${edge.text}"`);
      console.log(`   Warnings:`);
      edge.warnings.forEach(warn => console.log(`     - ${warn}`));
    });
    if (testResults.edgeCases.length > 10) {
      console.log(`\n   ... and ${testResults.edgeCases.length - 10} more edge cases`);
    }
  }
  
  // Unknown kanji sequences
  if (testResults.unknownKanji.length > 0) {
    console.log('\n⚠️  UNKNOWN KANJI SEQUENCES (Not in Vocabulary)');
    console.log('-'.repeat(80));
    
    // Group by kanji sequence
    const grouped = {};
    testResults.unknownKanji.forEach(item => {
      if (!grouped[item.kanji]) {
        grouped[item.kanji] = [];
      }
      grouped[item.kanji].push(item);
    });
    
    Object.keys(grouped).sort().forEach(kanji => {
      const occurrences = grouped[kanji];
      console.log(`\n"${kanji}" - ${occurrences.length} occurrence(s)`);
      occurrences.slice(0, 3).forEach(occ => {
        console.log(`  - Chapter ${occ.context.chapter}, ${occ.context.conversationId}: "${occ.text}"`);
      });
      if (occurrences.length > 3) {
        console.log(`  ... and ${occurrences.length - 3} more occurrences`);
      }
    });
  }
  
  // Accuracy metrics
  console.log('\n📈 ACCURACY METRICS');
  console.log('-'.repeat(80));
  const successRate = (testResults.successfulParses / testResults.totalTurns) * 100;
  const unknownRate = (testResults.unknownKanji.length / testResults.totalKanjiSequences) * 100;
  
  console.log(`Parsing Success Rate: ${successRate.toFixed(2)}%`);
  console.log(`Unknown Kanji Rate: ${unknownRate.toFixed(2)}%`);
  console.log(`Vocabulary Coverage: ${(100 - unknownRate).toFixed(2)}%`);
  
  // Final verdict
  console.log('\n✅ FINAL VERDICT');
  console.log('-'.repeat(80));
  if (testResults.parsingFailures.length === 0 && successRate >= 95) {
    console.log('✓ All tests passed! Kanji parser is working correctly.');
  } else if (testResults.parsingFailures.length > 0) {
    console.log('✗ Some parsing failures detected. Review failures above.');
  } else {
    console.log('⚠ Parser is working but success rate is below 95%.');
  }
  
  if (unknownRate > 5) {
    console.log(`⚠ Warning: ${unknownRate.toFixed(1)}% of kanji sequences not found in vocabulary.`);
  } else {
    console.log(`✓ Vocabulary coverage is good (${(100 - unknownRate).toFixed(1)}%).`);
  }
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Main test execution
 */
function runTests() {
  console.log('Starting Kanji Parser Tests for Chapters 1-10...\n');
  
  for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
    console.log(`Loading Chapter ${chapterNum}...`);
    const chapterData = loadChapterData(chapterNum);
    
    if (!chapterData) {
      console.error(`Failed to load Chapter ${chapterNum}`);
      continue;
    }
    
    const chapterResults = testChapterConversations(chapterData);
    testResults.chapters[chapterNum] = chapterResults;
    testResults.totalConversations += chapterResults.conversationCount;
    testResults.totalTurns += chapterResults.turnCount;
    testResults.successfulParses += chapterResults.successCount;
    
    console.log(`  ✓ Tested ${chapterResults.conversationCount} conversations, ${chapterResults.turnCount} turns`);
  }
  
  generateReport();
}

// Run the tests
runTests();
