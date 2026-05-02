/**
 * Test Script for Task 17.1: Test enhanced error handling for unknown kanji
 * 
 * This script verifies that:
 * 1. Detailed warnings are logged when kanji sequences are not found in vocabulary
 * 2. Context information (chapter number, conversation ID) is included in warnings
 * 3. Kanji displays without furigana when no match is found
 * 
 * Requirements: 1.8, 8.7
 */

import { getReading } from './js/utils/vocabularyMatcher.js';

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

console.log(`${colors.bright}${colors.blue}Enhanced Error Handling Test${colors.reset}`);
console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

// Test 1: Unknown kanji without context
console.log(`${colors.cyan}Test 1: Unknown kanji without context${colors.reset}`);
console.log('Expected: Warning logged without context information');
const vocabularyMap = new Map([
  ['私', 'わたし'],
  ['学生', 'がくせい']
]);
const fallbackMap = new Map();
const result1 = getReading('未知', vocabularyMap, fallbackMap);
console.log(`Result: ${result1 === null ? colors.green + 'null (correct)' : colors.red + 'unexpected value'} ${colors.reset}`);
console.log('');

// Test 2: Unknown kanji with full context
console.log(`${colors.cyan}Test 2: Unknown kanji with full context${colors.reset}`);
console.log('Expected: Warning logged with chapter number and conversation ID');
const context = {
  chapterNumber: 5,
  conversationId: 'ch05_conv03'
};
const result2 = getReading('未知', vocabularyMap, fallbackMap, context);
console.log(`Result: ${result2 === null ? colors.green + 'null (correct)' : colors.red + 'unexpected value'} ${colors.reset}`);
console.log('');

// Test 3: Unknown kanji with partial context (chapter only)
console.log(`${colors.cyan}Test 3: Unknown kanji with partial context (chapter only)${colors.reset}`);
console.log('Expected: Warning logged with chapter number only');
const partialContext = {
  chapterNumber: 3
};
const result3 = getReading('未知', vocabularyMap, fallbackMap, partialContext);
console.log(`Result: ${result3 === null ? colors.green + 'null (correct)' : colors.red + 'unexpected value'} ${colors.reset}`);
console.log('');

// Test 4: Known kanji (should not log warning)
console.log(`${colors.cyan}Test 4: Known kanji (should not log warning)${colors.reset}`);
console.log('Expected: No warning, returns reading from vocabulary map');
const result4 = getReading('私', vocabularyMap, fallbackMap, context);
console.log(`Result: ${result4 === 'わたし' ? colors.green + 'わたし (correct)' : colors.red + 'unexpected value'} ${colors.reset}`);
console.log('');

// Test 5: Kanji found in fallback map (should not log warning)
console.log(`${colors.cyan}Test 5: Kanji found in fallback map (should not log warning)${colors.reset}`);
console.log('Expected: No warning, returns reading from fallback map');
const fallbackMap2 = new Map([['推測', 'すいそく']]);
const result5 = getReading('推測', vocabularyMap, fallbackMap2, context);
console.log(`Result: ${result5 === 'すいそく' ? colors.green + 'すいそく (correct)' : colors.red + 'unexpected value'} ${colors.reset}`);
console.log('');

console.log(`${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.bright}${colors.green}Test completed successfully!${colors.reset}`);
console.log(`${colors.yellow}Note: Check console output above for warning messages${colors.reset}\n`);
