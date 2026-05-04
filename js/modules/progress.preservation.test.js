/**
 * Preservation Property Tests for Vocabulary Progress Deduplication Fix
 * 
 * IMPORTANT: These tests capture baseline behavior that should be preserved
 * Tests should PASS on unfixed code (confirms baseline behavior)
 * Tests should PASS on fixed code (confirms no regressions)
 * 
 * These tests validate that non-buggy operations remain unchanged after the fix.
 * 
 * Run with: npm test progress.preservation.test.js
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { progressTracker } from './progress.js';

/**
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**
 */
describe('Preservation Property Tests: Non-Duplicate Behavior and Data Format', () => {
  beforeEach(() => {
    // Reset state before each test
    localStorage.clear();
    progressTracker.vocabMemorized = new Set();
    progressTracker.kanjiMemorized = new Set();
    progressTracker.cachedTotals = null;
    progressTracker.storageAvailable = true;
    progressTracker.storageWarningShown = false;
  });

  /**
   * Property 1: Progress Per Bab Preservation
   * 
   * For any chapter, progress should count all vocabulary items in that chapter
   * without deduplication (deduplication only applies to total across all chapters)
   * 
   * **Validates: Requirements 3.3**
   */
  test('PRESERVATION: progress per bab should count all vocabulary items without deduplication', () => {
    // Mock data with vocabulary in a single chapter
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' },
          { id: 'ch01_003', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark some vocabulary as memorized
    progressTracker.markVocabMemorized('ch01_001');
    progressTracker.markVocabMemorized('ch01_002');

    // Get stats
    const stats = progressTracker.getStats(mockChaptersData);

    // EXPECTED BEHAVIOR: Total should be 3 (all items in chapter)
    // This should pass on both unfixed and fixed code
    expect(stats.vocab.total).toBe(3);
    expect(stats.vocab.memorized).toBe(2);
  });

  /**
   * Property 2: localStorage Format Preservation
   * 
   * Saved data should always be array of strings for backward compatibility
   * 
   * **Validates: Requirements 3.2**
   */
  test('PRESERVATION: localStorage format should be array of strings', async () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark vocabulary and kanji
    progressTracker.markVocabMemorized('ch01_001');
    progressTracker.markKanjiMemorized('ch01_001');

    // Wait for debounced save
    await new Promise(resolve => setTimeout(resolve, 150));

    // Check localStorage format
    const vocabData = localStorage.getItem('mnn_vocab_progress');
    const kanjiData = localStorage.getItem('mnn_kanji_progress');

    // EXPECTED BEHAVIOR: Data should be JSON array of strings
    expect(vocabData).toBeTruthy();
    expect(kanjiData).toBeTruthy();

    const vocabParsed = JSON.parse(vocabData);
    const kanjiParsed = JSON.parse(kanjiData);

    expect(Array.isArray(vocabParsed)).toBe(true);
    expect(Array.isArray(kanjiParsed)).toBe(true);

    // All items should be strings
    vocabParsed.forEach(item => expect(typeof item).toBe('string'));
    kanjiParsed.forEach(item => expect(typeof item).toBe('string'));
  });

  /**
   * Property 3: Data Validation Preservation
   * 
   * Invalid data should be cleaned/reset on load
   * 
   * **Validates: Requirements 3.4**
   */
  test('PRESERVATION: invalid data should be cleaned on load', () => {
    // Set invalid vocab data (not an array)
    localStorage.setItem('mnn_vocab_progress', JSON.stringify({ invalid: 'format' }));
    
    // Load should handle gracefully
    progressTracker.load();
    
    // EXPECTED BEHAVIOR: Invalid data should be reset to empty Set
    expect(progressTracker.vocabMemorized.size).toBe(0);
  });

  test('PRESERVATION: corrupted JSON data should be handled gracefully', () => {
    // Set corrupted JSON data
    localStorage.setItem('mnn_vocab_progress', 'invalid json {{{');
    
    // Load should not throw
    expect(() => progressTracker.load()).not.toThrow();
    
    // EXPECTED BEHAVIOR: Corrupted data should be reset to empty Set
    expect(progressTracker.vocabMemorized.size).toBe(0);
  });

  test('PRESERVATION: invalid kanji data (vocab IDs instead of kanji text) should be cleaned', () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Set invalid kanji data (vocab IDs instead of kanji text)
    localStorage.setItem('mnn_kanji_progress', JSON.stringify(['ch01_001', 'ch02_002']));
    
    // Load should clean invalid entries
    progressTracker.load();
    
    // EXPECTED BEHAVIOR: Invalid entries (vocab IDs) should be filtered out
    expect(progressTracker.kanjiMemorized.size).toBe(0);
  });

  /**
   * Property 4: Debounced Save Preservation
   * 
   * Multiple rapid saves should be batched with 100ms delay
   * 
   * **Validates: Requirements 3.7**
   */
  test('PRESERVATION: multiple rapid saves should be debounced', async () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' },
          { id: 'ch01_003', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark multiple vocabulary items rapidly
    progressTracker.markVocabMemorized('ch01_001');
    progressTracker.markVocabMemorized('ch01_002');
    progressTracker.markVocabMemorized('ch01_003');

    // Wait for debounce (100ms + buffer)
    await new Promise(resolve => setTimeout(resolve, 150));

    // EXPECTED BEHAVIOR: Data should be saved to localStorage
    const vocabData = localStorage.getItem('mnn_vocab_progress');
    expect(vocabData).toBeTruthy();
    
    const vocabParsed = JSON.parse(vocabData);
    expect(vocabParsed).toContain('ch01_001');
    expect(vocabParsed).toContain('ch01_002');
    expect(vocabParsed).toContain('ch01_003');
  });

  /**
   * Property 5: Storage Warning Preservation
   * 
   * Unavailable storage should trigger warning
   * 
   * **Validates: Requirements 3.6**
   */
  test('PRESERVATION: unavailable storage should trigger warning', () => {
    // Mock localStorage.setItem to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      const error = new Error('localStorage unavailable');
      error.name = 'SecurityError';
      throw error;
    };

    // Spy on console.warn
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Try to save
    progressTracker.vocabMemorized.add('ch01_001');
    progressTracker.save();

    // Wait for debounced save
    return new Promise(resolve => setTimeout(resolve, 150)).then(() => {
      // EXPECTED BEHAVIOR: Should have logged warning
      expect(warnSpy).toHaveBeenCalled();
      expect(progressTracker.storageAvailable).toBe(false);

      // Restore
      localStorage.setItem = originalSetItem;
      warnSpy.mockRestore();
    });
  });

  test('PRESERVATION: quota exceeded should trigger warning', () => {
    // Mock localStorage.setItem to throw QuotaExceededError
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    };

    // Spy on console.warn
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Try to save
    progressTracker.vocabMemorized.add('ch01_001');
    progressTracker.save();

    // Wait for debounced save
    return new Promise(resolve => setTimeout(resolve, 150)).then(() => {
      // EXPECTED BEHAVIOR: Should have logged warning
      expect(warnSpy).toHaveBeenCalled();
      expect(progressTracker.storageAvailable).toBe(false);

      // Restore
      localStorage.setItem = originalSetItem;
      warnSpy.mockRestore();
    });
  });

  /**
   * Property 6: Memorized List Display Preservation
   * 
   * Memorized vocabulary list should display full information
   * 
   * **Validates: Requirements 3.5**
   */
  test('PRESERVATION: memorized vocabulary list should include full details', () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark vocabulary
    progressTracker.markVocabMemorized('ch01_001');
    progressTracker.markVocabMemorized('ch01_002');

    // Get memorized list
    const list = progressTracker.getMemorizedVocabList();

    // EXPECTED BEHAVIOR: List should include full details
    expect(list.length).toBe(2);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('kanji');
    expect(list[0]).toHaveProperty('kana');
    expect(list[0]).toHaveProperty('romaji');
    expect(list[0]).toHaveProperty('meaning');
    expect(list[0]).toHaveProperty('chapterId');
  });

  test('PRESERVATION: memorized kanji list should include full details', () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark kanji
    progressTracker.markKanjiMemorized('ch01_001');
    progressTracker.markKanjiMemorized('ch01_002');

    // Get memorized list
    const list = progressTracker.getMemorizedKanjiList();

    // EXPECTED BEHAVIOR: List should include full details
    expect(list.length).toBe(2);
    expect(list[0]).toHaveProperty('kanjiText');
    expect(list[0]).toHaveProperty('vocab');
    expect(list[0].vocab).toHaveProperty('id');
    expect(list[0].vocab).toHaveProperty('kanji');
    expect(list[0].vocab).toHaveProperty('kana');
    expect(list[0].vocab).toHaveProperty('romaji');
    expect(list[0].vocab).toHaveProperty('meaning');
    expect(list[0]).toHaveProperty('chapterId');
  });

  /**
   * Property 7: Independent Status for Different Vocabulary
   * 
   * Vocabulary with different kanji+kana combinations should have independent status
   * 
   * **Validates: Requirements 3.1**
   */
  test('PRESERVATION: different vocabulary should have independent status', () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark only first vocabulary
    progressTracker.markVocabMemorized('ch01_001');

    // EXPECTED BEHAVIOR: Only first vocabulary should be marked
    expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
    expect(progressTracker.isVocabMemorized('ch01_002')).toBe(false);
  });

  /**
   * Property 8: Persistence Across Load/Save Cycles
   * 
   * Data should persist correctly across load/save cycles
   * 
   * **Validates: Requirements 3.2**
   */
  test('PRESERVATION: data should persist across load/save cycles', async () => {
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark vocabulary and kanji
    progressTracker.markVocabMemorized('ch01_001');
    progressTracker.markVocabMemorized('ch01_002');
    progressTracker.markKanjiMemorized('ch01_001');

    // Wait for debounced save
    await new Promise(resolve => setTimeout(resolve, 150));

    // Simulate page reload - reset state
    progressTracker.vocabMemorized = new Set();
    progressTracker.kanjiMemorized = new Set();

    // Load from localStorage
    progressTracker.load();

    // EXPECTED BEHAVIOR: Data should be restored
    expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
    expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
    expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(true);
  });
});
