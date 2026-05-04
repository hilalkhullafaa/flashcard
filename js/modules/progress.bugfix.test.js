/**
 * Bug Condition Exploration Tests for Vocabulary Progress Deduplication Fix
 * 
 * CRITICAL: These tests are EXPECTED TO FAIL on unfixed code
 * Failure confirms the bug exists - this is the SUCCESS case for exploration tests
 * 
 * These tests encode the expected behavior and will validate the fix when they pass
 * after implementation.
 * 
 * Run with: npm test progress.bugfix.test.js
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { progressTracker } from './progress.js';

/**
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
 */
describe('Bug Condition Exploration: Duplicate Vocabulary and Kanji Counting', () => {
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
   * Test Case 1: Duplicate Vocabulary Count
   * 
   * Bug Condition: Vocabulary with same kanji+kana in multiple chapters should count as 1 in total
   * Current Behavior (UNFIXED): Total count = 2 (counted separately)
   * Expected Behavior (FIXED): Total count = 1 (deduplicated)
   * 
   * Example: "私" (わたし) appears in ch01 and ch03
   */
  test('EXPLORATION: duplicate vocabulary with same kanji+kana should count as 1 in total', () => {
    // Mock data with duplicate vocabulary "私" (わたし) in two chapters
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch03_025', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch03_026', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);
    const stats = progressTracker.getStats(mockChaptersData);

    // EXPECTED BEHAVIOR: Total should be 3 unique vocabulary items
    // "私" (わたし) appears twice but should count as 1
    // "学生" (がくせい) appears once = 1
    // "先生" (せんせい) appears once = 1
    // Total unique = 3
    
    // CURRENT BEHAVIOR (UNFIXED): Total will be 4 (all items counted separately)
    // This test will FAIL on unfixed code, confirming the bug exists
    expect(stats.vocab.total).toBe(3);
  });

  /**
   * Test Case 2: Duplicate Kanji Count
   * 
   * Bug Condition: Kanji appearing in multiple vocabulary items should count as 1 in total
   * Current Behavior (UNFIXED): Kanji counted multiple times
   * Expected Behavior (FIXED): Each unique kanji counted once
   * 
   * Example: Kanji "私" appears in multiple vocabulary items
   */
  test('EXPLORATION: duplicate kanji in multiple vocabulary items should count as 1 in total', () => {
    // Mock data with kanji "私" appearing in multiple vocabulary items
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch03_025', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch03_026', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);
    const stats = progressTracker.getStats(mockChaptersData);

    // EXPECTED BEHAVIOR: Total should be 3 unique kanji
    // "私" appears in 2 vocabulary items but should count as 1
    // "学生" has 2 kanji: "学" and "生" = 2
    // "先生" has 2 kanji: "先" and "生" = 2, but "生" already counted
    // Total unique kanji = 私, 学, 生, 先 = 4
    
    // Wait, let me recalculate based on the actual kanji text field
    // The kanji field contains the full word, not individual kanji
    // So "私" = 1, "学生" = 1, "先生" = 1
    // Total unique = 3
    
    // CURRENT BEHAVIOR (UNFIXED): May count duplicates
    // This test will FAIL on unfixed code if deduplication is not working
    expect(stats.kanji.total).toBe(3);
  });

  /**
   * Test Case 3: Unsynchronized Status - Marking Vocabulary
   * 
   * Bug Condition: Marking vocabulary in one chapter should mark all instances with same kanji+kana
   * Current Behavior (UNFIXED): Status only saved for specific vocabulary ID
   * Expected Behavior (FIXED): Status synchronized across all chapters
   * 
   * Example: Marking "私" (わたし) in ch01 should also mark it in ch03
   */
  test('EXPLORATION: marking vocabulary in one chapter should mark all instances with same kanji+kana', () => {
    // Mock data with duplicate vocabulary "私" (わたし) in two chapters
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch03_025', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark vocabulary in chapter 1
    progressTracker.markVocabMemorized('ch01_001');

    // EXPECTED BEHAVIOR: Vocabulary with same kanji+kana in chapter 3 should also be marked
    // CURRENT BEHAVIOR (UNFIXED): Only ch01_001 is marked, ch03_025 is not
    // This test will FAIL on unfixed code, confirming the bug exists
    expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
  });

  /**
   * Test Case 4: Status Removal Synchronization
   * 
   * Bug Condition: Unmarking vocabulary in one chapter should unmark all instances with same kanji+kana
   * Current Behavior (UNFIXED): Status only removed for specific vocabulary ID
   * Expected Behavior (FIXED): Status removal synchronized across all chapters
   * 
   * Example: Unmarking "私" (わたし) in ch01 should also unmark it in ch03
   */
  test('EXPLORATION: unmarking vocabulary in one chapter should unmark all instances with same kanji+kana', () => {
    // Mock data with duplicate vocabulary "私" (わたし) in two chapters
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch03_025', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark vocabulary in both chapters (simulating the fixed behavior)
    progressTracker.markVocabMemorized('ch01_001');
    progressTracker.markVocabMemorized('ch03_025');

    // Verify both are marked
    expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
    expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);

    // Unmark vocabulary in chapter 1
    progressTracker.markVocabForgotten('ch01_001');

    // EXPECTED BEHAVIOR: Vocabulary with same kanji+kana in chapter 3 should also be unmarked
    // CURRENT BEHAVIOR (UNFIXED): Only ch01_001 is unmarked, ch03_025 is still marked
    // This test will FAIL on unfixed code, confirming the bug exists
    expect(progressTracker.isVocabMemorized('ch03_025')).toBe(false);
  });

  /**
   * Test Case 5: Edge Case - Vocabulary Without Kanji
   * 
   * Bug Condition: Vocabulary without kanji (empty kanji field) should still be deduplicated by kana
   * Expected Behavior: Vocabulary with empty kanji but same kana should be deduplicated
   */
  test('EXPLORATION: vocabulary without kanji should be deduplicated by kana', () => {
    // Mock data with vocabulary without kanji
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_002', kanji: '', kana: 'あなた', romaji: 'anata', meaning: 'anda' },
          { id: 'ch01_003', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch02_001', kanji: '', kana: 'あなた', romaji: 'anata', meaning: 'anda' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);
    const stats = progressTracker.getStats(mockChaptersData);

    // EXPECTED BEHAVIOR: Total should be 2 unique vocabulary items
    // "" + "あなた" appears twice but should count as 1
    // "私" + "わたし" appears once = 1
    // Total unique = 2
    
    // CURRENT BEHAVIOR (UNFIXED): Total will be 3 (all items counted separately)
    expect(stats.vocab.total).toBe(2);
  });

  /**
   * Test Case 6: Edge Case - Same Kanji Different Kana
   * 
   * Bug Condition: Vocabulary with same kanji but different kana should be counted separately
   * Expected Behavior: Different kanji+kana combinations are unique vocabulary items
   */
  test('EXPLORATION: vocabulary with same kanji but different kana should be counted separately', () => {
    // Mock data with same kanji but different readings
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '生', kana: 'せい', romaji: 'sei', meaning: 'kehidupan' },
          { id: 'ch01_002', kanji: '生', kana: 'なま', romaji: 'nama', meaning: 'mentah' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);
    const stats = progressTracker.getStats(mockChaptersData);

    // EXPECTED BEHAVIOR: Total should be 2 unique vocabulary items
    // "生" + "せい" = 1
    // "生" + "なま" = 1
    // Total unique = 2 (different readings = different vocabulary)
    
    // This should pass even on unfixed code since they have different IDs
    expect(stats.vocab.total).toBe(2);
  });

  /**
   * Test Case 7: Kanji Memorization Synchronization
   * 
   * Bug Condition: Marking kanji in one vocabulary should mark it in all vocabulary with same kanji
   * Current Behavior (UNFIXED): Kanji status may not be synchronized
   * Expected Behavior (FIXED): Kanji status synchronized across all vocabulary items
   */
  test('EXPLORATION: marking kanji should synchronize across all vocabulary with same kanji text', () => {
    // Mock data with same kanji in multiple vocabulary items
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch03_025', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);

    // Mark kanji in chapter 1
    progressTracker.markKanjiMemorized('ch01_001');

    // EXPECTED BEHAVIOR: Kanji should be marked for all vocabulary with same kanji text
    // Since kanji tracking uses kanji text (not vocab ID), this should work even on unfixed code
    // But let's verify the behavior
    expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(true);
    expect(progressTracker.isKanjiMemorized('ch03_025')).toBe(true);
  });

  /**
   * Test Case 8: Total Count with Multiple Duplicates
   * 
   * Bug Condition: Multiple vocabulary items with duplicates across chapters
   * Expected Behavior: Total count reflects unique vocabulary only
   */
  test('EXPLORATION: total count should reflect unique vocabulary across multiple chapters with duplicates', () => {
    // Mock data with multiple duplicates
    const mockChaptersData = [
      {
        vocabulary: [
          { id: 'ch01_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch01_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' },
          { id: 'ch01_003', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch02_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch02_002', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'pelajar' },
          { id: 'ch02_003', kanji: '会社', kana: 'かいしゃ', romaji: 'kaisha', meaning: 'perusahaan' }
        ]
      },
      {
        vocabulary: [
          { id: 'ch03_001', kanji: '私', kana: 'わたし', romaji: 'watashi', meaning: 'saya' },
          { id: 'ch03_002', kanji: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'guru' },
          { id: 'ch03_003', kanji: '医者', kana: 'いしゃ', romaji: 'isha', meaning: 'dokter' }
        ]
      }
    ];

    progressTracker.setChaptersData(mockChaptersData);
    const stats = progressTracker.getStats(mockChaptersData);

    // EXPECTED BEHAVIOR: Total should be 5 unique vocabulary items
    // "私" (わたし) appears 3 times = 1
    // "学生" (がくせい) appears 2 times = 1
    // "先生" (せんせい) appears 2 times = 1
    // "会社" (かいしゃ) appears 1 time = 1
    // "医者" (いしゃ) appears 1 time = 1
    // Total unique = 5
    
    // CURRENT BEHAVIOR (UNFIXED): Total will be 9 (all items counted separately)
    // This test will FAIL on unfixed code, confirming the bug exists
    expect(stats.vocab.total).toBe(5);
  });
});
