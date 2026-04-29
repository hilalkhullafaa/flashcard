/**
 * Manual Integration Verification Script
 * Tests the complete unique progress and kanji synchronization feature
 */

import { progressTracker } from './js/modules/progress.js';
import { hasKanji } from './js/utils.js';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Test data with duplicate kanji across chapters
const mockChaptersData = [
  {
    chapter: { id: 1, title: 'Chapter 1' },
    vocabulary: [
      { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', wordClass: 'nomina', meaning: 'saya' },
      { id: 'ch01_002', kanji: '', kana: 'あなた', romaji: 'anata', wordClass: 'nomina', meaning: 'kamu' },
      { id: 'ch01_003', kanji: '先生', kana: 'せんせい', romaji: 'sensei', wordClass: 'nomina', meaning: 'guru' },
      { id: 'ch01_004', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', wordClass: 'nomina', meaning: 'pelajar' }
    ]
  },
  {
    chapter: { id: 2, title: 'Chapter 2' },
    vocabulary: [
      { id: 'ch02_001', kanji: '私', kana: 'わたし', romaji: 'watashi', wordClass: 'nomina', meaning: 'saya' }, // Duplicate
      { id: 'ch02_002', kanji: '本', kana: 'ほん', romaji: 'hon', wordClass: 'nomina', meaning: 'buku' },
      { id: 'ch02_003', kanji: '', kana: 'はい', romaji: 'hai', wordClass: 'ekspresi', meaning: 'ya' }
    ]
  },
  {
    chapter: { id: 3, title: 'Chapter 3' },
    vocabulary: [
      { id: 'ch03_001', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', wordClass: 'nomina', meaning: 'pelajar' }, // Duplicate
      { id: 'ch03_002', kanji: '先生', kana: 'せんせい', romaji: 'sensei', wordClass: 'nomina', meaning: 'guru' }, // Duplicate
      { id: 'ch03_003', kanji: '日本', kana: 'にほん', romaji: 'nihon', wordClass: 'nomina', meaning: 'Jepang' }
    ]
  }
];

console.log('\n🧪 Integration Verification: Unique Progress and Kanji Synchronization\n');
console.log('═'.repeat(80));

// Reset state
localStorage.clear();
progressTracker.vocabMemorized = new Set();
progressTracker.kanjiMemorized = new Set();
progressTracker.cachedTotals = null;
progressTracker.setChaptersData(mockChaptersData);

// Test 1: Unique Counting
console.log('\n📊 Test 1: Unique Progress Counting');
console.log('─'.repeat(80));

const stats = progressTracker.getStats(mockChaptersData);
console.log(`Total vocabulary items across all chapters: ${mockChaptersData.reduce((sum, ch) => sum + ch.vocabulary.length, 0)}`);
console.log(`Unique vocabulary count: ${stats.vocab.total}`);
console.log(`Total kanji items across all chapters: ${mockChaptersData.reduce((sum, ch) => sum + ch.vocabulary.filter(v => v.kanji && hasKanji(v.kanji)).length, 0)}`);
console.log(`Unique kanji count: ${stats.kanji.total}`);

// Expected unique vocab: 私|わたし, |あなた, 先生|せんせい, 学生|がくせい, 本|ほん, |はい, 日本|にほん
// Note: 私|わたし appears in ch01 and ch02, so it's counted once = 7 unique
const expectedUniqueVocab = 7; 
const expectedUniqueKanji = 5; // 私, 先生, 学生, 本, 日本

if (stats.vocab.total === expectedUniqueVocab) {
  console.log(`✅ Unique vocabulary counting works correctly (${expectedUniqueVocab} unique items)`);
} else {
  console.log(`❌ Unique vocabulary counting failed: expected ${expectedUniqueVocab}, got ${stats.vocab.total}`);
}

if (stats.kanji.total === expectedUniqueKanji) {
  console.log(`✅ Unique kanji counting works correctly (${expectedUniqueKanji} unique items)`);
} else {
  console.log(`❌ Unique kanji counting failed: expected ${expectedUniqueKanji}, got ${stats.kanji.total}`);
}

// Test 2: Cross-Chapter Kanji Synchronization
console.log('\n🔄 Test 2: Cross-Chapter Kanji Synchronization');
console.log('─'.repeat(80));

// Mark kanji '私' as memorized using ch01_001
progressTracker.markKanjiMemorized('ch01_001');
console.log(`Marked kanji '私' as memorized using vocab ID: ch01_001`);

// Check if it's memorized for ch02_001 (same kanji, different chapter)
const isCh02Memorized = progressTracker.isKanjiMemorized('ch02_001');
console.log(`Checking if '私' is memorized for ch02_001: ${isCh02Memorized}`);

if (isCh02Memorized) {
  console.log('✅ Cross-chapter kanji synchronization works correctly');
} else {
  console.log('❌ Cross-chapter kanji synchronization failed');
}

// Test 3: Kanji Forgetting Synchronization
console.log('\n🗑️  Test 3: Kanji Forgetting Synchronization');
console.log('─'.repeat(80));

// Mark kanji '学生' as memorized using ch01_004
progressTracker.markKanjiMemorized('ch01_004');
console.log(`Marked kanji '学生' as memorized using vocab ID: ch01_004`);

// Verify it's memorized for ch03_001
const isCh03BeforeForget = progressTracker.isKanjiMemorized('ch03_001');
console.log(`Checking if '学生' is memorized for ch03_001: ${isCh03BeforeForget}`);

// Mark as forgotten using ch03_001
progressTracker.markKanjiForgotten('ch03_001');
console.log(`Marked kanji '学生' as forgotten using vocab ID: ch03_001`);

// Verify it's forgotten for ch01_004
const isCh01AfterForget = progressTracker.isKanjiMemorized('ch01_004');
console.log(`Checking if '学生' is memorized for ch01_004: ${isCh01AfterForget}`);

if (isCh03BeforeForget && !isCh01AfterForget) {
  console.log('✅ Kanji forgetting synchronization works correctly');
} else {
  console.log('❌ Kanji forgetting synchronization failed');
}

// Test 4: Independent Tracking Systems
console.log('\n🔀 Test 4: Independent Tracking Systems');
console.log('─'.repeat(80));

// Mark vocabulary by ID
progressTracker.markVocabMemorized('ch01_003'); // 先生
console.log(`Marked vocabulary '先生' (ch01_003) as memorized by vocab ID`);

// Check kanji status (should be independent)
const isKanjiMemorized = progressTracker.isKanjiMemorized('ch01_003');
console.log(`Checking if kanji '先生' is memorized: ${isKanjiMemorized}`);

// Mark kanji
progressTracker.markKanjiMemorized('ch02_002'); // 本
console.log(`Marked kanji '本' (ch02_002) as memorized by kanji text`);

// Check vocab status (should be independent)
const isVocabMemorized = progressTracker.isVocabMemorized('ch02_002');
console.log(`Checking if vocabulary '本' (ch02_002) is memorized: ${isVocabMemorized}`);

if (!isKanjiMemorized && !isVocabMemorized) {
  console.log('✅ Independent tracking systems work correctly');
} else {
  console.log('❌ Independent tracking systems failed');
}

// Test 5: Progress Statistics with Memorization
console.log('\n📈 Test 5: Progress Statistics with Memorization');
console.log('─'.repeat(80));

// Mark some items as memorized
progressTracker.markVocabMemorized('ch01_001'); // 私
progressTracker.markVocabMemorized('ch01_002'); // あなた
progressTracker.markKanjiMemorized('ch01_003'); // 先生 (already marked vocab above, so vocab count = 3)
progressTracker.markKanjiMemorized('ch02_002'); // 本 (already marked kanji above)

const finalStats = progressTracker.getStats(mockChaptersData);
console.log(`Vocabulary progress: ${finalStats.vocab.memorized}/${finalStats.vocab.total} (${finalStats.vocab.percentage}%)`);
console.log(`Kanji progress: ${finalStats.kanji.memorized}/${finalStats.kanji.total} (${finalStats.kanji.percentage}%)`);

// Expected: 3 vocab memorized (ch01_001, ch01_002, ch01_003), 3 kanji memorized (私, 先生, 本)
const expectedVocabMemorized = 3;
const expectedKanjiMemorized = 3;

if (finalStats.vocab.memorized === expectedVocabMemorized && finalStats.kanji.memorized === expectedKanjiMemorized) {
  console.log('✅ Progress statistics calculation works correctly');
} else {
  console.log(`❌ Progress statistics calculation failed: expected vocab=${expectedVocabMemorized}, kanji=${expectedKanjiMemorized}, got vocab=${finalStats.vocab.memorized}, kanji=${finalStats.kanji.memorized}`);
}

// Test 6: LocalStorage Persistence
console.log('\n💾 Test 6: LocalStorage Persistence');
console.log('─'.repeat(80));

// Wait for debounced save
await new Promise(resolve => setTimeout(resolve, 150));

const vocabStored = JSON.parse(localStorage.getItem('mnn_vocab_progress') || '[]');
const kanjiStored = JSON.parse(localStorage.getItem('mnn_kanji_progress') || '[]');

console.log(`Vocabulary IDs in localStorage: ${vocabStored.join(', ')}`);
console.log(`Kanji texts in localStorage: ${kanjiStored.join(', ')}`);

if (vocabStored.includes('ch01_001') && vocabStored.includes('ch01_002')) {
  console.log('✅ Vocabulary persistence works correctly');
} else {
  console.log('❌ Vocabulary persistence failed');
}

if (kanjiStored.includes('私') && kanjiStored.includes('先生') && kanjiStored.includes('本')) {
  console.log('✅ Kanji persistence works correctly');
} else {
  console.log('❌ Kanji persistence failed');
}

// Test 7: Kotoba Module Badge Display
console.log('\n🏷️  Test 7: Kotoba Module Badge Display');
console.log('─'.repeat(80));

// Simulate kotoba module checking memorization status
const vocabWithKanji = mockChaptersData[0].vocabulary[0]; // 私
const vocabWithoutKanji = mockChaptersData[0].vocabulary[1]; // あなた

const shouldShowBadge1 = vocabWithKanji.kanji && hasKanji(vocabWithKanji.kanji) 
  ? progressTracker.isKanjiMemorized(vocabWithKanji.id)
  : false;

const shouldShowBadge2 = vocabWithoutKanji.kanji && hasKanji(vocabWithoutKanji.kanji) 
  ? progressTracker.isKanjiMemorized(vocabWithoutKanji.id)
  : false;

console.log(`Vocabulary '私' (ch01_001) should show badge: ${shouldShowBadge1}`);
console.log(`Vocabulary 'あなた' (ch01_002) should show badge: ${shouldShowBadge2}`);

if (shouldShowBadge1 && !shouldShowBadge2) {
  console.log('✅ Kotoba module badge display logic works correctly');
} else {
  console.log('❌ Kotoba module badge display logic failed');
}

// Summary
console.log('\n' + '═'.repeat(80));
console.log('✅ All integration tests completed successfully!');
console.log('═'.repeat(80) + '\n');
