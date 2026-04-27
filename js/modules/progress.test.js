/**
 * Manual test runner for ProgressTracker
 * Run with: node js/modules/progress.test.js
 */

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n🧪 Running ProgressTracker Tests\n');
    
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        this.passed++;
        console.log(`✅ ${name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// Simple assertion library
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertContains(array, value, message) {
  if (!array.includes(value)) {
    throw new Error(message || `Expected array to contain ${value}`);
  }
}

function assertNotContains(array, value, message) {
  if (array.includes(value)) {
    throw new Error(message || `Expected array not to contain ${value}`);
  }
}

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

// Import the module
import { progressTracker } from './progress.js';

// Test suite
const runner = new TestRunner();

// Helper to reset state
function resetState() {
  localStorage.clear();
  progressTracker.vocabMemorized = new Set();
  progressTracker.kanjiMemorized = new Set();
}

// Tests
runner.test('markVocabMemorized should mark vocabulary as memorized', () => {
  resetState();
  progressTracker.markVocabMemorized('ch01_001');
  assert(progressTracker.isVocabMemorized('ch01_001'), 'Vocab should be memorized');
});

runner.test('markVocabMemorized should persist to localStorage', () => {
  resetState();
  progressTracker.markVocabMemorized('ch01_001');
  const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
  assertContains(stored, 'ch01_001', 'localStorage should contain vocab ID');
});

runner.test('markVocabMemorized should handle multiple vocabulary items', () => {
  resetState();
  progressTracker.markVocabMemorized('ch01_001');
  progressTracker.markVocabMemorized('ch01_002');
  progressTracker.markVocabMemorized('ch02_001');
  assertEqual(progressTracker.vocabMemorized.size, 3, 'Should have 3 memorized items');
});

runner.test('markVocabForgotten should remove vocabulary from memorized set', () => {
  resetState();
  progressTracker.markVocabMemorized('ch01_001');
  progressTracker.markVocabForgotten('ch01_001');
  assert(!progressTracker.isVocabMemorized('ch01_001'), 'Vocab should not be memorized');
});

runner.test('markVocabForgotten should persist removal to localStorage', () => {
  resetState();
  progressTracker.markVocabMemorized('ch01_001');
  progressTracker.markVocabForgotten('ch01_001');
  const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
  assertNotContains(stored, 'ch01_001', 'localStorage should not contain vocab ID');
});

runner.test('markKanjiMemorized should mark kanji as memorized', () => {
  resetState();
  progressTracker.markKanjiMemorized('ch01_001');
  assert(progressTracker.isKanjiMemorized('ch01_001'), 'Kanji should be memorized');
});

runner.test('markKanjiMemorized should persist to localStorage', () => {
  resetState();
  progressTracker.markKanjiMemorized('ch01_001');
  const stored = JSON.parse(localStorage.getItem('mnn_kanji_progress'));
  assertContains(stored, 'ch01_001', 'localStorage should contain kanji ID');
});

runner.test('markKanjiForgotten should remove kanji from memorized set', () => {
  resetState();
  progressTracker.markKanjiMemorized('ch01_001');
  progressTracker.markKanjiForgotten('ch01_001');
  assert(!progressTracker.isKanjiMemorized('ch01_001'), 'Kanji should not be memorized');
});

runner.test('getStats should calculate correct statistics', () => {
  resetState();
  const mockChapters = [
    {
      vocabulary: [
        { id: 'ch01_001', kanji: '私', kana: 'わたし' },
        { id: 'ch01_002', kanji: '', kana: 'あなた' },
        { id: 'ch01_003', kanji: '先生', kana: 'せんせい' }
      ]
    },
    {
      vocabulary: [
        { id: 'ch02_001', kanji: '学生', kana: 'がくせい' },
        { id: 'ch02_002', kanji: '', kana: 'はい' }
      ]
    }
  ];

  progressTracker.markVocabMemorized('ch01_001');
  progressTracker.markVocabMemorized('ch02_001');
  progressTracker.markKanjiMemorized('ch01_001');

  const stats = progressTracker.getStats(mockChapters);

  assertEqual(stats.vocab.total, 5, 'Total vocab should be 5');
  assertEqual(stats.vocab.memorized, 2, 'Memorized vocab should be 2');
  assertEqual(stats.vocab.percentage, 40, 'Vocab percentage should be 40');

  assertEqual(stats.kanji.total, 3, 'Total kanji should be 3');
  assertEqual(stats.kanji.memorized, 1, 'Memorized kanji should be 1');
  assertEqual(stats.kanji.percentage, 33, 'Kanji percentage should be 33');
});

runner.test('getStats should handle empty chapter data', () => {
  resetState();
  const stats = progressTracker.getStats([]);
  assertEqual(stats.vocab.total, 0, 'Total vocab should be 0');
  assertEqual(stats.vocab.memorized, 0, 'Memorized vocab should be 0');
  assertEqual(stats.vocab.percentage, 0, 'Vocab percentage should be 0');
  assertEqual(stats.kanji.total, 0, 'Total kanji should be 0');
  assertEqual(stats.kanji.memorized, 0, 'Memorized kanji should be 0');
  assertEqual(stats.kanji.percentage, 0, 'Kanji percentage should be 0');
});

runner.test('getStats should handle chapters without vocabulary', () => {
  resetState();
  const mockChapters = [{ patterns: [], grammar: [] }];
  const stats = progressTracker.getStats(mockChapters);
  assertEqual(stats.vocab.total, 0, 'Total vocab should be 0');
  assertEqual(stats.kanji.total, 0, 'Total kanji should be 0');
});

runner.test('load should restore progress from localStorage', () => {
  resetState();
  localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch01_002']));
  localStorage.setItem('mnn_kanji_progress', JSON.stringify(['ch01_001']));

  progressTracker.load();

  assert(progressTracker.isVocabMemorized('ch01_001'), 'Vocab ch01_001 should be memorized');
  assert(progressTracker.isVocabMemorized('ch01_002'), 'Vocab ch01_002 should be memorized');
  assert(progressTracker.isKanjiMemorized('ch01_001'), 'Kanji ch01_001 should be memorized');
});

runner.test('load should handle corrupted vocab data', () => {
  resetState();
  localStorage.setItem('mnn_vocab_progress', 'invalid json');
  
  // Should not throw
  progressTracker.load();
  assertEqual(progressTracker.vocabMemorized.size, 0, 'Should have 0 memorized items');
});

runner.test('load should handle invalid data format', () => {
  resetState();
  localStorage.setItem('mnn_vocab_progress', JSON.stringify({ invalid: 'format' }));
  
  progressTracker.load();
  assertEqual(progressTracker.vocabMemorized.size, 0, 'Should have 0 memorized items');
});

runner.test('load should handle missing localStorage data', () => {
  resetState();
  progressTracker.load();
  assertEqual(progressTracker.vocabMemorized.size, 0, 'Should have 0 vocab memorized');
  assertEqual(progressTracker.kanjiMemorized.size, 0, 'Should have 0 kanji memorized');
});

runner.test('save should persist progress to localStorage', () => {
  resetState();
  progressTracker.vocabMemorized.add('ch01_001');
  progressTracker.kanjiMemorized.add('ch01_001');
  
  progressTracker.save();

  const vocabStored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
  const kanjiStored = JSON.parse(localStorage.getItem('mnn_kanji_progress'));

  assertContains(vocabStored, 'ch01_001', 'Vocab should be in localStorage');
  assertContains(kanjiStored, 'ch01_001', 'Kanji should be in localStorage');
});

runner.test('save should handle localStorage quota exceeded', () => {
  resetState();
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = () => {
    const error = new Error('QuotaExceededError');
    error.name = 'QuotaExceededError';
    throw error;
  };

  progressTracker.vocabMemorized.add('ch01_001');
  
  // Should not throw
  progressTracker.save();

  // Restore original
  localStorage.setItem = originalSetItem;
});

runner.test('save should handle localStorage unavailable', () => {
  resetState();
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = () => {
    throw new Error('localStorage unavailable');
  };

  progressTracker.vocabMemorized.add('ch01_001');
  
  // Should not throw
  progressTracker.save();

  // Restore original
  localStorage.setItem = originalSetItem;
});

runner.test('integration: should persist and restore state across load/save cycles', () => {
  resetState();
  progressTracker.markVocabMemorized('ch01_001');
  progressTracker.markVocabMemorized('ch01_002');
  progressTracker.markKanjiMemorized('ch01_001');

  // Simulate page reload
  const vocabData = localStorage.getItem('mnn_vocab_progress');
  const kanjiData = localStorage.getItem('mnn_kanji_progress');
  
  resetState();
  localStorage.setItem('mnn_vocab_progress', vocabData);
  localStorage.setItem('mnn_kanji_progress', kanjiData);
  progressTracker.load();

  assert(progressTracker.isVocabMemorized('ch01_001'), 'Vocab ch01_001 should persist');
  assert(progressTracker.isVocabMemorized('ch01_002'), 'Vocab ch01_002 should persist');
  assert(progressTracker.isKanjiMemorized('ch01_001'), 'Kanji ch01_001 should persist');
});

// Run all tests
runner.run();
