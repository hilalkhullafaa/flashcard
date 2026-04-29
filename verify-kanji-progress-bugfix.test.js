/**
 * Kanji Progress Bugfix Verification Test
 * 
 * This test verifies the fix for the bug where kanji progress shows non-zero
 * value when no kanji are actually memorized (due to invalid vocab IDs stored
 * in kanji progress data).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { progressTracker } from './js/modules/progress.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

// Sample test data
const sampleChaptersData = [
  {
    id: 1,
    vocabulary: [
      { id: 'ch01_001', kanji: '本', kana: 'ほん', romaji: 'hon', meaning: 'buku' },
      { id: 'ch01_002', kanji: '人', kana: 'ひと', romaji: 'hito', meaning: 'orang' },
      { id: 'ch01_003', kanji: '', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
    ]
  },
  {
    id: 2,
    vocabulary: [
      { id: 'ch02_001', kanji: '学校', kana: 'がっこう', romaji: 'gakkou', meaning: 'sekolah' },
      { id: 'ch02_002', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' }
    ]
  }
];

describe('Kanji Progress Bugfix', () => {
  beforeEach(() => {
    localStorageMock.clear();
    progressTracker.vocabMemorized.clear();
    progressTracker.kanjiMemorized.clear();
    progressTracker.setChaptersData(sampleChaptersData);
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('should filter out vocab IDs from kanji progress on load', () => {
    // Simulate corrupted data: vocab IDs stored in kanji progress
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      'ch01_001',  // Invalid: vocab ID
      'ch01_002',  // Invalid: vocab ID
      '本',        // Valid: kanji text
      'ch02_001'   // Invalid: vocab ID
    ]));

    // Create new instance to trigger load
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Should only have valid kanji text
    expect(newTracker.kanjiMemorized.size).toBe(1);
    expect(newTracker.kanjiMemorized.has('本')).toBe(true);
    expect(newTracker.kanjiMemorized.has('ch01_001')).toBe(false);
    expect(newTracker.kanjiMemorized.has('ch01_002')).toBe(false);
    expect(newTracker.kanjiMemorized.has('ch02_001')).toBe(false);
  });

  it('should filter out non-kanji text from kanji progress on load', () => {
    // Simulate corrupted data: non-kanji text stored in kanji progress
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      'hiragana',  // Invalid: no kanji
      '本',        // Valid: kanji text
      'abc123',    // Invalid: no kanji
      '学校'       // Valid: kanji text
    ]));

    // Create new instance to trigger load
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Should only have valid kanji text
    expect(newTracker.kanjiMemorized.size).toBe(2);
    expect(newTracker.kanjiMemorized.has('本')).toBe(true);
    expect(newTracker.kanjiMemorized.has('学校')).toBe(true);
    expect(newTracker.kanjiMemorized.has('hiragana')).toBe(false);
    expect(newTracker.kanjiMemorized.has('abc123')).toBe(false);
  });

  it('should show 0 kanji memorized when no valid kanji in localStorage', () => {
    // Simulate corrupted data: only vocab IDs, no valid kanji
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      'ch01_001',
      'ch01_002',
      'ch02_001'
    ]));

    // Create new instance to trigger load
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Get stats
    const stats = newTracker.getStats(sampleChaptersData);

    // Should show 0 kanji memorized
    expect(stats.kanji.memorized).toBe(0);
    expect(stats.kanji.percentage).toBe(0);
  });

  it('should correctly count kanji when valid kanji text is stored', () => {
    // Store valid kanji text
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      '本',
      '学校'
    ]));

    // Create new instance to trigger load
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Get stats
    const stats = newTracker.getStats(sampleChaptersData);

    // Should show 2 kanji memorized
    expect(stats.kanji.memorized).toBe(2);
    expect(stats.kanji.total).toBeGreaterThan(0);
    expect(stats.kanji.percentage).toBeGreaterThan(0);
  });

  it('should auto-save cleaned data after filtering invalid entries', (done) => {
    // Simulate corrupted data
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      'ch01_001',  // Invalid
      '本',        // Valid
      'ch02_001'   // Invalid
    ]));

    // Create new instance to trigger load and cleanup
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Wait for batched save (100ms + buffer)
    setTimeout(() => {
      // Check that localStorage was updated with cleaned data
      const savedData = JSON.parse(localStorage.getItem('mnn_kanji_progress'));
      expect(savedData).toEqual(['本']);
      expect(savedData.length).toBe(1);
      done();
    }, 150);
  });

  it('should handle empty kanji progress correctly', () => {
    // No kanji progress data
    localStorage.removeItem('mnn_kanji_progress');

    // Create new instance
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Get stats
    const stats = newTracker.getStats(sampleChaptersData);

    // Should show 0 kanji memorized
    expect(stats.kanji.memorized).toBe(0);
    expect(stats.kanji.percentage).toBe(0);
    expect(newTracker.kanjiMemorized.size).toBe(0);
  });

  it('should not affect vocab progress when cleaning kanji progress', () => {
    // Set both vocab and kanji progress
    localStorage.setItem('mnn_vocab_progress', JSON.stringify([
      'ch01_001',
      'ch01_002'
    ]));
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      'ch01_001',  // Invalid: will be filtered
      '本'         // Valid
    ]));

    // Create new instance
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Vocab progress should be unchanged
    expect(newTracker.vocabMemorized.size).toBe(2);
    expect(newTracker.vocabMemorized.has('ch01_001')).toBe(true);
    expect(newTracker.vocabMemorized.has('ch01_002')).toBe(true);

    // Kanji progress should be cleaned
    expect(newTracker.kanjiMemorized.size).toBe(1);
    expect(newTracker.kanjiMemorized.has('本')).toBe(true);
  });

  it('should correctly mark and track kanji after cleanup', () => {
    // Start with corrupted data
    localStorage.setItem('mnn_kanji_progress', JSON.stringify([
      'ch01_001',  // Invalid
      'ch02_001'   // Invalid
    ]));

    // Create new instance (will clean up)
    const newTracker = new (progressTracker.constructor)();
    newTracker.setChaptersData(sampleChaptersData);

    // Should start with 0 kanji
    expect(newTracker.kanjiMemorized.size).toBe(0);

    // Mark new kanji as memorized
    newTracker.markKanjiMemorized('ch01_001');  // 本
    newTracker.markKanjiMemorized('ch02_001');  // 学校

    // Should now have 2 kanji
    expect(newTracker.kanjiMemorized.size).toBe(2);
    expect(newTracker.kanjiMemorized.has('本')).toBe(true);
    expect(newTracker.kanjiMemorized.has('学校')).toBe(true);

    // Stats should reflect correct count
    const stats = newTracker.getStats(sampleChaptersData);
    expect(stats.kanji.memorized).toBe(2);
  });
});

console.log('✅ Kanji progress bugfix verification tests defined successfully');
console.log('Run with: npm test verify-kanji-progress-bugfix.test.js');
