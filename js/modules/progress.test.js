/**
 * Vitest tests for ProgressTracker
 * Run with: npm test
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { progressTracker } from './progress.js';

// Mock chapter data for testing
const mockChaptersData = [
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

describe('ProgressTracker', () => {
  beforeEach(() => {
    // Reset state before each test
    localStorage.clear();
    progressTracker.vocabMemorized = new Set();
    progressTracker.kanjiMemorized = new Set();
    progressTracker.cachedTotals = null;
    progressTracker.storageAvailable = true;
    progressTracker.storageWarningShown = false;
    progressTracker.setChaptersData(mockChaptersData);
  });

  describe('Unique Key Generation', () => {
    test('_getVocabUniqueKey should generate correct key for normal vocabulary', () => {
      const vocab = { kanji: '私', kana: 'わたし' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('私|わたし');
    });

    test('_getVocabUniqueKey should handle empty kanji', () => {
      const vocab = { kanji: '', kana: 'あなた' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('|あなた');
    });

    test('_getVocabUniqueKey should handle empty kana', () => {
      const vocab = { kanji: '私', kana: '' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('私|');
    });

    test('_getVocabUniqueKey should handle both empty kanji and kana', () => {
      const vocab = { kanji: '', kana: '' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('|');
    });

    test('_getVocabUniqueKey should handle missing kanji property', () => {
      const vocab = { kana: 'わたし' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('|わたし');
    });

    test('_getVocabUniqueKey should handle missing kana property', () => {
      const vocab = { kanji: '私' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('私|');
    });

    test('_getVocabUniqueKey should handle null vocab', () => {
      const key = progressTracker._getVocabUniqueKey(null);
      expect(key).toBe('|');
    });

    test('_getVocabUniqueKey should handle undefined vocab', () => {
      const key = progressTracker._getVocabUniqueKey(undefined);
      expect(key).toBe('|');
    });

    test('_getVocabUniqueKey should handle special characters in kanji', () => {
      const vocab = { kanji: '〜私〜', kana: 'わたし' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('〜私〜|わたし');
    });

    test('_getVocabUniqueKey should handle special characters in kana', () => {
      const vocab = { kanji: '私', kana: 'わたし〜' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('私|わたし〜');
    });

    test('_getVocabUniqueKey should handle pipe character in kanji', () => {
      const vocab = { kanji: '私|他', kana: 'わたし' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('私|他|わたし');
    });

    test('_getVocabUniqueKey should handle pipe character in kana', () => {
      const vocab = { kanji: '私', kana: 'わた|し' };
      const key = progressTracker._getVocabUniqueKey(vocab);
      expect(key).toBe('私|わた|し');
    });

    test('_getVocabUniqueKey should generate same key for vocabulary with same kanji+kana', () => {
      const vocab1 = { id: 'ch01_001', kanji: '私', kana: 'わたし', meaning: 'I' };
      const vocab2 = { id: 'ch03_025', kanji: '私', kana: 'わたし', meaning: 'me' };
      const key1 = progressTracker._getVocabUniqueKey(vocab1);
      const key2 = progressTracker._getVocabUniqueKey(vocab2);
      expect(key1).toBe(key2);
      expect(key1).toBe('私|わたし');
    });

    test('_getVocabUniqueKey should generate different keys for vocabulary with different kanji', () => {
      const vocab1 = { kanji: '私', kana: 'わたし' };
      const vocab2 = { kanji: '僕', kana: 'わたし' };
      const key1 = progressTracker._getVocabUniqueKey(vocab1);
      const key2 = progressTracker._getVocabUniqueKey(vocab2);
      expect(key1).not.toBe(key2);
    });

    test('_getVocabUniqueKey should generate different keys for vocabulary with different kana', () => {
      const vocab1 = { kanji: '私', kana: 'わたし' };
      const vocab2 = { kanji: '私', kana: 'わたくし' };
      const key1 = progressTracker._getVocabUniqueKey(vocab1);
      const key2 = progressTracker._getVocabUniqueKey(vocab2);
      expect(key1).not.toBe(key2);
    });
  });

  describe('Vocabulary Tracking', () => {
    test('markVocabMemorized should mark vocabulary as memorized', () => {
      progressTracker.markVocabMemorized('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
    });

    test('markVocabMemorized should persist to localStorage', async () => {
      progressTracker.markVocabMemorized('ch01_001');
      // Wait for debounced save (100ms + buffer)
      await new Promise(resolve => setTimeout(resolve, 150));
      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).toContain('ch01_001');
    });

    test('markVocabMemorized should handle multiple vocabulary items', () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch01_002');
      progressTracker.markVocabMemorized('ch02_001');
      expect(progressTracker.vocabMemorized.size).toBe(3);
    });

    test('markVocabForgotten should remove vocabulary from memorized set', () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabForgotten('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
    });

    test('markVocabForgotten should persist removal to localStorage', async () => {
      progressTracker.markVocabMemorized('ch01_001');
      await new Promise(resolve => setTimeout(resolve, 150));
      progressTracker.markVocabForgotten('ch01_001');
      await new Promise(resolve => setTimeout(resolve, 150));
      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).not.toContain('ch01_001');
    });
  });

  describe('Status Synchronization Across Chapters', () => {
    test('markVocabMemorized should synchronize status across all chapters with same kanji+kana', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし', meaning: 'I' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい', meaning: 'student' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし', meaning: 'me' }, // same kanji+kana
            { id: 'ch03_026', kanji: '先生', kana: 'せんせい', meaning: 'teacher' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたし', meaning: 'I (formal)' }, // same kanji+kana
            { id: 'ch07_033', kanji: '学生', kana: 'がくせい', meaning: 'student' } // same kanji+kana
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1
      progressTracker.markVocabMemorized('ch01_001');

      // All vocabulary with same kanji+kana should be marked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch07_032')).toBe(true);
      
      // Other vocabulary should not be marked
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_026')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch07_033')).toBe(false);
    });

    test('markVocabMemorized should synchronize when marking from different chapter', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 3
      progressTracker.markVocabMemorized('ch03_025');

      // Both should be marked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
    });

    test('markVocabMemorized should handle vocabulary with same kanji but different kana separately', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '私', kana: 'わたくし' } // same kanji, different kana
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark first vocabulary
      progressTracker.markVocabMemorized('ch01_001');

      // Only first should be marked (different kana = different vocabulary)
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(false);
    });

    test('markVocabMemorized should handle vocabulary without kanji (hiragana/katakana only)', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '', kana: 'あなた' } // same hiragana-only
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1
      progressTracker.markVocabMemorized('ch01_001');

      // Both should be marked (same unique key: |あなた)
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
    });

    test('markVocabMemorized should persist all synchronized IDs to localStorage', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1
      progressTracker.markVocabMemorized('ch01_001');

      // Wait for debounced save
      await new Promise(resolve => setTimeout(resolve, 150));

      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      
      // All synchronized IDs should be in localStorage
      expect(stored).toContain('ch01_001');
      expect(stored).toContain('ch03_025');
      expect(stored).toContain('ch07_032');
    });

    test('markVocabMemorized should handle non-existent vocabulary ID gracefully', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark non-existent vocabulary
      progressTracker.markVocabMemorized('ch99_999');

      // Should still add the ID (backward compatibility)
      expect(progressTracker.isVocabMemorized('ch99_999')).toBe(true);
      // Should not affect other vocabulary
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
    });

    test('markVocabMemorized should work when chapters data is not set', () => {
      // Don't set chapters data
      progressTracker.allChaptersData = null;
      
      // Mark vocabulary
      progressTracker.markVocabMemorized('ch01_001');

      // Should still add the ID (fallback behavior)
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
    });

    test('markVocabMemorized should handle complex synchronization scenario', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' },
            { id: 'ch01_003', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '私', kana: 'わたし' }, // duplicate
            { id: 'ch02_002', kanji: '先生', kana: 'せんせい' },
            { id: 'ch02_003', kanji: '', kana: 'あなた' } // duplicate
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_001', kanji: '学生', kana: 'がくせい' }, // duplicate
            { id: 'ch03_002', kanji: '先生', kana: 'せんせい' }, // duplicate
            { id: 'ch03_003', kanji: '本', kana: 'ほん' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark 私(わたし) in chapter 1
      progressTracker.markVocabMemorized('ch01_001');
      
      // Mark 学生(がくせい) in chapter 3
      progressTracker.markVocabMemorized('ch03_001');

      // Check 私(わたし) synchronization
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch02_001')).toBe(true);
      
      // Check 学生(がくせい) synchronization
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_001')).toBe(true);
      
      // Check other vocabulary not marked
      expect(progressTracker.isVocabMemorized('ch01_003')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch02_002')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_002')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_003')).toBe(false);
    });

    test('markVocabMemorized should not duplicate IDs if called multiple times', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark same vocabulary multiple times
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch03_025');

      // Should only have 2 unique IDs in the set
      expect(progressTracker.vocabMemorized.size).toBe(2);
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
    });
  });

  describe('Status Removal Synchronization Across Chapters', () => {
    test('markVocabForgotten should synchronize removal across all chapters with same kanji+kana', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし', meaning: 'I' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい', meaning: 'student' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし', meaning: 'me' }, // same kanji+kana
            { id: 'ch03_026', kanji: '先生', kana: 'せんせい', meaning: 'teacher' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたし', meaning: 'I (formal)' }, // same kanji+kana
            { id: 'ch07_033', kanji: '学生', kana: 'がくせい', meaning: 'student' } // same kanji+kana
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1 (this marks all instances)
      progressTracker.markVocabMemorized('ch01_001');
      
      // Verify all are marked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch07_032')).toBe(true);

      // Unmark vocabulary in chapter 3
      progressTracker.markVocabForgotten('ch03_025');

      // All vocabulary with same kanji+kana should be unmarked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch07_032')).toBe(false);
      
      // Other vocabulary should remain unchanged
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_026')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch07_033')).toBe(false);
    });

    test('markVocabForgotten should synchronize when unmarking from different chapter', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1 (marks both)
      progressTracker.markVocabMemorized('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);

      // Unmark vocabulary in chapter 1
      progressTracker.markVocabForgotten('ch01_001');

      // Both should be unmarked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(false);
    });

    test('markVocabForgotten should handle vocabulary with same kanji but different kana separately', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '私', kana: 'わたくし' } // same kanji, different kana
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark both vocabulary items
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch01_002');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);

      // Unmark first vocabulary
      progressTracker.markVocabForgotten('ch01_001');

      // Only first should be unmarked (different kana = different vocabulary)
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
    });

    test('markVocabForgotten should handle vocabulary without kanji (hiragana/katakana only)', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '', kana: 'あなた' } // same hiragana-only
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1 (marks both)
      progressTracker.markVocabMemorized('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);

      // Unmark vocabulary in chapter 3
      progressTracker.markVocabForgotten('ch03_025');

      // Both should be unmarked (same unique key: |あなた)
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(false);
    });

    test('markVocabForgotten should persist all synchronized removals to localStorage', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary in chapter 1 (marks all)
      progressTracker.markVocabMemorized('ch01_001');
      await new Promise(resolve => setTimeout(resolve, 150));

      // Verify all are in localStorage
      let stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).toContain('ch01_001');
      expect(stored).toContain('ch03_025');
      expect(stored).toContain('ch07_032');

      // Unmark vocabulary in chapter 3
      progressTracker.markVocabForgotten('ch03_025');
      await new Promise(resolve => setTimeout(resolve, 150));

      // All synchronized IDs should be removed from localStorage
      stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).not.toContain('ch01_001');
      expect(stored).not.toContain('ch03_025');
      expect(stored).not.toContain('ch07_032');
    });

    test('markVocabForgotten should handle non-existent vocabulary ID gracefully', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark existing vocabulary
      progressTracker.markVocabMemorized('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);

      // Unmark non-existent vocabulary
      progressTracker.markVocabForgotten('ch99_999');

      // Should not affect other vocabulary
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
    });

    test('markVocabForgotten should work when chapters data is not set', () => {
      // Mark vocabulary first
      progressTracker.vocabMemorized.add('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);

      // Don't set chapters data
      progressTracker.allChaptersData = null;
      
      // Unmark vocabulary
      progressTracker.markVocabForgotten('ch01_001');

      // Should still remove the ID (fallback behavior)
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
    });

    test('markVocabForgotten should handle complex removal synchronization scenario', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' },
            { id: 'ch01_003', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '私', kana: 'わたし' }, // duplicate
            { id: 'ch02_002', kanji: '先生', kana: 'せんせい' },
            { id: 'ch02_003', kanji: '', kana: 'あなた' } // duplicate
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_001', kanji: '学生', kana: 'がくせい' }, // duplicate
            { id: 'ch03_002', kanji: '先生', kana: 'せんせい' }, // duplicate
            { id: 'ch03_003', kanji: '本', kana: 'ほん' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark multiple vocabulary items
      progressTracker.markVocabMemorized('ch01_001'); // marks 私(わたし) in all chapters
      progressTracker.markVocabMemorized('ch03_001'); // marks 学生(がくせい) in all chapters
      progressTracker.markVocabMemorized('ch02_002'); // marks 先生(せんせい) in all chapters
      progressTracker.markVocabMemorized('ch03_003'); // marks 本(ほん)

      // Verify all are marked
      expect(progressTracker.vocabMemorized.size).toBe(7); // 2+2+2+1

      // Unmark 私(わたし) from chapter 2
      progressTracker.markVocabForgotten('ch02_001');

      // Check 私(わたし) removed from all chapters
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch02_001')).toBe(false);
      
      // Check 学生(がくせい) still marked
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_001')).toBe(true);
      
      // Check 先生(せんせい) still marked
      expect(progressTracker.isVocabMemorized('ch02_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_002')).toBe(true);
      
      // Check 本(ほん) still marked
      expect(progressTracker.isVocabMemorized('ch03_003')).toBe(true);

      // Unmark 学生(がくせい) from chapter 1
      progressTracker.markVocabForgotten('ch01_002');

      // Check 学生(がくせい) removed from all chapters
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_001')).toBe(false);
      
      // Check others still marked
      expect(progressTracker.isVocabMemorized('ch02_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_003')).toBe(true);
    });

    test('markVocabForgotten should not affect vocabulary if called on already unmarked item', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark only one vocabulary
      progressTracker.markVocabMemorized('ch01_002');
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);

      // Unmark already unmarked vocabulary
      progressTracker.markVocabForgotten('ch01_001');

      // Should not affect other vocabulary
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
    });

    test('markVocabForgotten should handle edge case with empty kanji and kana', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '', kana: '' },
            { id: 'ch01_002', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '', kana: '' }, // duplicate empty
            { id: 'ch02_002', kanji: '学生', kana: 'がくせい' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark empty vocabulary (marks both)
      progressTracker.markVocabMemorized('ch01_001');
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch02_001')).toBe(true);

      // Unmark empty vocabulary
      progressTracker.markVocabForgotten('ch02_001');

      // Both should be unmarked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch02_001')).toBe(false);
    });

    test('markVocabForgotten should not remove IDs multiple times if called repeatedly', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // Mark vocabulary
      progressTracker.markVocabMemorized('ch01_001');
      expect(progressTracker.vocabMemorized.size).toBe(2);

      // Unmark same vocabulary multiple times
      progressTracker.markVocabForgotten('ch01_001');
      progressTracker.markVocabForgotten('ch01_001');
      progressTracker.markVocabForgotten('ch03_025');

      // Should have 0 items (all removed)
      expect(progressTracker.vocabMemorized.size).toBe(0);
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(false);
    });
  });

  describe('Kanji Tracking', () => {
    test('markKanjiMemorized should mark kanji as memorized', () => {
      progressTracker.markKanjiMemorized('ch01_001'); // vocab with kanji '私'
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(true);
    });

    test('markKanjiMemorized should persist kanji text to localStorage', async () => {
      progressTracker.markKanjiMemorized('ch01_001'); // vocab with kanji '私'
      // Wait for debounced save
      await new Promise(resolve => setTimeout(resolve, 150));
      const stored = JSON.parse(localStorage.getItem('mnn_kanji_progress'));
      expect(stored).toContain('私');
    });

    test('markKanjiForgotten should remove kanji from memorized set', () => {
      progressTracker.markKanjiMemorized('ch01_001'); // vocab with kanji '私'
      progressTracker.markKanjiForgotten('ch01_001');
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(false);
    });
  });

  describe('Statistics', () => {
    test('getStats should calculate correct statistics', () => {
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

      progressTracker.setChaptersData(mockChapters);
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch02_001');
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私' as memorized

      const stats = progressTracker.getStats(mockChapters);

      expect(stats.vocab.total).toBe(5);
      expect(stats.vocab.memorized).toBe(2);
      expect(stats.vocab.percentage).toBe(40);

      expect(stats.kanji.total).toBe(3);
      expect(stats.kanji.memorized).toBe(1);
      expect(stats.kanji.percentage).toBe(33);
    });

    test('getStats should handle empty chapter data', () => {
      const stats = progressTracker.getStats([]);
      expect(stats.vocab.total).toBe(0);
      expect(stats.vocab.memorized).toBe(0);
      expect(stats.vocab.percentage).toBe(0);
      expect(stats.kanji.total).toBe(0);
      expect(stats.kanji.memorized).toBe(0);
      expect(stats.kanji.percentage).toBe(0);
    });

    test('getStats should handle chapters without vocabulary', () => {
      const mockChapters = [{ patterns: [], grammar: [] }];
      const stats = progressTracker.getStats(mockChapters);
      expect(stats.vocab.total).toBe(0);
      expect(stats.kanji.total).toBe(0);
    });
  });

  describe('Deduplication in getStats()', () => {
    test('should deduplicate vocabulary with same kanji+kana across chapters', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし', meaning: 'I' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい', meaning: 'student' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし', meaning: 'me' }, // duplicate
            { id: 'ch03_026', kanji: '先生', kana: 'せんせい', meaning: 'teacher' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたし', meaning: 'I (formal)' }, // duplicate
            { id: 'ch07_033', kanji: '学生', kana: 'がくせい', meaning: 'student' } // duplicate
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should count only unique vocabulary: 私(わたし), 学生(がくせい), 先生(せんせい) = 3
      expect(stats.vocab.total).toBe(3);
    });

    test('should deduplicate kanji across chapters', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }, // duplicate kanji
            { id: 'ch03_026', kanji: '先生', kana: 'せんせい' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたくし' }, // same kanji, different kana
            { id: 'ch07_033', kanji: '学生', kana: 'がくせい' } // duplicate kanji
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should count only unique kanji: 私, 学生, 先生 = 3
      expect(stats.kanji.total).toBe(3);
    });

    test('should count vocabulary with same kanji but different kana as separate items', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '私', kana: 'わたくし' } // same kanji, different kana
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should count as 2 different vocabulary items
      expect(stats.vocab.total).toBe(2);
      // But only 1 unique kanji
      expect(stats.kanji.total).toBe(1);
    });

    test('should count vocabulary with same kana but different kanji as separate items', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '僕', kana: 'わたし' } // different kanji, same kana (hypothetical)
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should count as 2 different vocabulary items
      expect(stats.vocab.total).toBe(2);
      // And 2 different kanji
      expect(stats.kanji.total).toBe(2);
    });

    test('should handle vocabulary without kanji (hiragana/katakana only)', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '', kana: 'あなた' },
            { id: 'ch01_002', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '', kana: 'あなた' }, // duplicate hiragana-only
            { id: 'ch03_026', kanji: '', kana: 'はい' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should count unique vocabulary: あなた, 私(わたし), はい = 3
      expect(stats.vocab.total).toBe(3);
      // Should count only kanji: 私 = 1
      expect(stats.kanji.total).toBe(1);
    });

    test('should use cached totals on subsequent calls', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      
      // First call - calculates and caches
      const stats1 = progressTracker.getStats(mockChapters);
      expect(stats1.vocab.total).toBe(2);
      expect(stats1.kanji.total).toBe(2);
      expect(progressTracker.cachedTotals).toEqual({ vocab: 2, kanji: 2 });

      // Second call - uses cache
      const stats2 = progressTracker.getStats(mockChapters);
      expect(stats2.vocab.total).toBe(2);
      expect(stats2.kanji.total).toBe(2);
    });

    test('should handle complex deduplication scenario with multiple duplicates', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' },
            { id: 'ch01_003', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '私', kana: 'わたし' }, // duplicate
            { id: 'ch02_002', kanji: '先生', kana: 'せんせい' },
            { id: 'ch02_003', kanji: '', kana: 'あなた' } // duplicate
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_001', kanji: '学生', kana: 'がくせい' }, // duplicate
            { id: 'ch03_002', kanji: '先生', kana: 'せんせい' }, // duplicate
            { id: 'ch03_003', kanji: '本', kana: 'ほん' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Unique vocabulary: 私(わたし), 学生(がくせい), あなた, 先生(せんせい), 本(ほん) = 5
      expect(stats.vocab.total).toBe(5);
      // Unique kanji: 私, 学生, 先生, 本 = 4
      expect(stats.kanji.total).toBe(4);
    });

    test('should handle edge case with empty kanji and kana', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '', kana: '' },
            { id: 'ch01_002', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '', kana: '' }, // duplicate empty
            { id: 'ch02_002', kanji: '学生', kana: 'がくせい' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should count: empty, 私(わたし), 学生(がくせい) = 3
      // Note: empty entries are deduplicated too
      expect(stats.vocab.total).toBe(3);
      // Kanji: 私, 学生 = 2
      expect(stats.kanji.total).toBe(2);
    });

    test('should handle null and undefined vocabulary items gracefully', () => {
      const mockChapters = [
        {
          vocabulary: [
            null,
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            undefined,
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);
      const stats = progressTracker.getStats(mockChapters);

      // Should skip null/undefined and count only valid items
      expect(stats.vocab.total).toBe(2);
      expect(stats.kanji.total).toBe(2);
    });

    test('should ensure per-chapter progress calculation remains unchanged', () => {
      // This test verifies that deduplication only affects total counts,
      // not per-chapter calculations (which should count all items in that chapter)
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '私', kana: 'わたし' }, // duplicate
            { id: 'ch02_002', kanji: '先生', kana: 'せんせい' }
          ]
        }
      ];

      progressTracker.setChaptersData(mockChapters);

      // Mark vocabulary in both chapters
      progressTracker.markVocabMemorized('ch01_001'); // 私 わたし
      progressTracker.markVocabMemorized('ch02_001'); // 私 わたし (duplicate, same unique key)

      const stats = progressTracker.getStats(mockChapters);

      // Total should be deduplicated: 私(わたし), 学生(がくせい), 先生(せんせい) = 3
      expect(stats.vocab.total).toBe(3);
      // Memorized count should also be deduplicated: only 私(わたし) is marked = 1 unique vocabulary
      // Even though 2 IDs are in the Set (ch01_001, ch02_001), they represent the same vocabulary
      expect(stats.vocab.memorized).toBe(1);
      
      // Note: Per-chapter progress would be calculated separately by other code
      // This test just ensures getStats() deduplicates totals correctly
    });
  });

  describe('Persistence', () => {
    test('load should restore progress from localStorage', () => {
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch01_002']));
      localStorage.setItem('mnn_kanji_progress', JSON.stringify(['私'])); // kanji text, not vocab ID

      progressTracker.load();

      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(true);
    });

    test('load should handle corrupted vocab data', () => {
      localStorage.setItem('mnn_vocab_progress', 'invalid json');
      
      // Should not throw
      progressTracker.load();
      expect(progressTracker.vocabMemorized.size).toBe(0);
    });

    test('load should handle invalid data format', () => {
      localStorage.setItem('mnn_vocab_progress', JSON.stringify({ invalid: 'format' }));
      
      progressTracker.load();
      expect(progressTracker.vocabMemorized.size).toBe(0);
    });

    test('load should handle missing localStorage data', () => {
      progressTracker.load();
      expect(progressTracker.vocabMemorized.size).toBe(0);
      expect(progressTracker.kanjiMemorized.size).toBe(0);
    });

    test('save should persist progress to localStorage', async () => {
      progressTracker.vocabMemorized.add('ch01_001');
      progressTracker.kanjiMemorized.add('私'); // kanji text, not vocab ID
      
      progressTracker.save();

      // Wait for debounced save (100ms + buffer)
      await new Promise(resolve => setTimeout(resolve, 150));

      const vocabStored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      const kanjiStored = JSON.parse(localStorage.getItem('mnn_kanji_progress'));

      expect(vocabStored).toContain('ch01_001');
      expect(kanjiStored).toContain('私');
    });

    test('save should handle localStorage quota exceeded', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      };

      progressTracker.vocabMemorized.add('ch01_001');
      
      // Should not throw
      expect(() => progressTracker.save()).not.toThrow();

      // Restore original
      localStorage.setItem = originalSetItem;
    });

    test('save should handle localStorage unavailable', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('localStorage unavailable');
      };

      progressTracker.vocabMemorized.add('ch01_001');
      
      // Should not throw
      expect(() => progressTracker.save()).not.toThrow();

      // Restore original
      localStorage.setItem = originalSetItem;
    });

    test('integration: should persist and restore state across load/save cycles', async () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch01_002');
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私'

      // Wait for debounced save
      await new Promise(resolve => setTimeout(resolve, 150));

      // Simulate page reload
      const vocabData = localStorage.getItem('mnn_vocab_progress');
      const kanjiData = localStorage.getItem('mnn_kanji_progress');
      
      // Reset state
      progressTracker.vocabMemorized = new Set();
      progressTracker.kanjiMemorized = new Set();
      
      localStorage.setItem('mnn_vocab_progress', vocabData);
      localStorage.setItem('mnn_kanji_progress', kanjiData);
      progressTracker.load();

      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(true);
    });
  });

  describe('List Methods', () => {
    test('getMemorizedVocabList should return empty array when no items memorized', () => {
      const list = progressTracker.getMemorizedVocabList();
      expect(list.length).toBe(0);
    });

    test('getMemorizedVocabList should return correct items with full details', () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markVocabMemorized('ch02_001');
      
      const list = progressTracker.getMemorizedVocabList();
      
      expect(list.length).toBe(2);
      expect(list[0].id).toBe('ch01_001');
      expect(list[0].kanji).toBe('私');
      expect(list[0].kana).toBe('わたし');
      expect(list[0].chapterId).toBe(1);
      expect(list[1].id).toBe('ch02_001');
      expect(list[1].kanji).toBe('学生');
      expect(list[1].chapterId).toBe(2);
    });

    test('getMemorizedVocabList should handle missing vocabulary IDs gracefully', () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.vocabMemorized.add('ch99_999'); // Non-existent vocab ID
      
      const list = progressTracker.getMemorizedVocabList();
      
      expect(list.length).toBe(1);
      expect(list[0].id).toBe('ch01_001');
    });

    test('getMemorizedKanjiList should return empty array when no kanji memorized', () => {
      const list = progressTracker.getMemorizedKanjiList();
      expect(list.length).toBe(0);
    });

    test('getMemorizedKanjiList should return correct kanji with associated vocabulary', () => {
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私'
      progressTracker.markKanjiMemorized('ch02_001'); // marks kanji '学生'
      
      const list = progressTracker.getMemorizedKanjiList();
      
      expect(list.length).toBe(2);
      expect(list[0].kanjiText).toBe('私');
      expect(list[0].vocab.id).toBe('ch01_001');
      expect(list[0].vocab.kana).toBe('わたし');
      expect(list[0].chapterId).toBe(1);
      expect(list[1].kanjiText).toBe('学生');
      expect(list[1].vocab.id).toBe('ch02_001');
      expect(list[1].chapterId).toBe(2);
    });

    test('getMemorizedKanjiList should handle missing kanji texts gracefully', () => {
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私'
      progressTracker.kanjiMemorized.add('無効'); // Non-existent kanji text
      
      const list = progressTracker.getMemorizedKanjiList();
      
      expect(list.length).toBe(1);
      expect(list[0].kanjiText).toBe('私');
    });
  });

  describe('Delete Methods', () => {
    test('deleteMemorizedVocab should successfully remove item and return true', async () => {
      progressTracker.markVocabMemorized('ch01_001');
      
      const result = progressTracker.deleteMemorizedVocab('ch01_001');
      
      expect(result).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      
      // Wait for debounced save
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).not.toContain('ch01_001');
    });

    test('deleteMemorizedVocab should return false when item not found', () => {
      const result = progressTracker.deleteMemorizedVocab('ch99_999');
      expect(result).toBe(false);
    });

    test('deleteMemorizedKanji should successfully remove kanji and return true', async () => {
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私'
      
      const result = progressTracker.deleteMemorizedKanji('私');
      
      expect(result).toBe(true);
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(false);
      
      // Wait for debounced save
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const stored = JSON.parse(localStorage.getItem('mnn_kanji_progress'));
      expect(stored).not.toContain('私');
    });

    test('deleteMemorizedKanji should return false when kanji not found', () => {
      const result = progressTracker.deleteMemorizedKanji('無効');
      expect(result).toBe(false);
    });

    test('data consistency: deleting vocab should not affect kanji status', () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私'
      
      progressTracker.deleteMemorizedVocab('ch01_001');
      
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(false);
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(true);
    });

    test('data consistency: deleting kanji should not affect vocab status', () => {
      progressTracker.markVocabMemorized('ch01_001');
      progressTracker.markKanjiMemorized('ch01_001'); // marks kanji '私'
      
      progressTracker.deleteMemorizedKanji('私');
      
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isKanjiMemorized('ch01_001')).toBe(false);
    });
  });

  describe('Backward Compatibility Migration', () => {
    test('should migrate old format data with single vocabulary ID per item', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' } // same kanji+kana
          ]
        },
        {
          vocabulary: [
            { id: 'ch07_032', kanji: '私', kana: 'わたし' } // same kanji+kana
          ]
        }
      ];

      // Simulate old format data (only one ID marked)
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should trigger migration)
      progressTracker.load();

      // Wait for debounced save from migration
      await new Promise(resolve => setTimeout(resolve, 150));

      // All vocabulary with same kanji+kana should be marked after migration
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch07_032')).toBe(true);
      expect(progressTracker.vocabMemorized.size).toBe(3);

      // Verify migrated data is saved to localStorage
      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).toContain('ch01_001');
      expect(stored).toContain('ch03_025');
      expect(stored).toContain('ch07_032');
    });

    test('should handle mixed format data (some migrated, some not)', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }, // duplicate
            { id: 'ch03_026', kanji: '学生', kana: 'がくせい' } // duplicate
          ]
        }
      ];

      // Simulate mixed format data (私 fully migrated, 学生 only one ID)
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch03_025', 'ch01_002']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should trigger migration for 学生 only)
      progressTracker.load();

      // Wait for debounced save from migration
      await new Promise(resolve => setTimeout(resolve, 150));

      // All vocabulary should be marked after migration
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_026')).toBe(true);
      expect(progressTracker.vocabMemorized.size).toBe(4);

      // Verify migrated data is saved to localStorage
      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).toContain('ch01_001');
      expect(stored).toContain('ch03_025');
      expect(stored).toContain('ch01_002');
      expect(stored).toContain('ch03_026');
    });

    test('should not modify already migrated data', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      // Simulate already migrated data (all IDs present)
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch03_025']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should not trigger migration)
      progressTracker.load();

      // Wait to ensure no save is triggered
      await new Promise(resolve => setTimeout(resolve, 150));

      // All vocabulary should still be marked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
      expect(progressTracker.vocabMemorized.size).toBe(2);

      // Verify data remains unchanged in localStorage
      const stored = JSON.parse(localStorage.getItem('mnn_vocab_progress'));
      expect(stored).toContain('ch01_001');
      expect(stored).toContain('ch03_025');
      expect(stored.length).toBe(2);
    });

    test('should handle migration with vocabulary without kanji', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '', kana: 'あなた' } // same hiragana-only
          ]
        }
      ];

      // Simulate old format data (only one ID marked)
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should trigger migration)
      progressTracker.load();

      // Wait for debounced save from migration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Both vocabulary should be marked after migration
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_025')).toBe(true);
      expect(progressTracker.vocabMemorized.size).toBe(2);
    });

    test('should handle migration with complex scenario', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' },
            { id: 'ch01_002', kanji: '学生', kana: 'がくせい' },
            { id: 'ch01_003', kanji: '', kana: 'あなた' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch02_001', kanji: '私', kana: 'わたし' }, // duplicate
            { id: 'ch02_002', kanji: '先生', kana: 'せんせい' },
            { id: 'ch02_003', kanji: '', kana: 'あなた' } // duplicate
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_001', kanji: '学生', kana: 'がくせい' }, // duplicate
            { id: 'ch03_002', kanji: '先生', kana: 'せんせい' }, // duplicate
            { id: 'ch03_003', kanji: '本', kana: 'ほん' }
          ]
        }
      ];

      // Simulate old format data (only some IDs marked)
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch02_002']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should trigger migration)
      progressTracker.load();

      // Wait for debounced save from migration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Check 私(わたし) migrated
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch02_001')).toBe(true);
      
      // Check 先生(せんせい) migrated
      expect(progressTracker.isVocabMemorized('ch02_002')).toBe(true);
      expect(progressTracker.isVocabMemorized('ch03_002')).toBe(true);
      
      // Check others not marked
      expect(progressTracker.isVocabMemorized('ch01_002')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch01_003')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_001')).toBe(false);
      expect(progressTracker.isVocabMemorized('ch03_003')).toBe(false);

      // Total should be 4 (2 for 私, 2 for 先生)
      expect(progressTracker.vocabMemorized.size).toBe(4);
    });

    test('should skip migration when no chapters data available', () => {
      // Simulate old format data
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001']));
      
      // Reset without setting chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.allChaptersData = null;
      
      // Load data (should not trigger migration)
      progressTracker.load();

      // Only the original ID should be in the set
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      expect(progressTracker.vocabMemorized.size).toBe(1);
    });

    test('should skip migration when no vocabulary data to migrate', () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      // No data in localStorage
      localStorage.removeItem('mnn_vocab_progress');
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should not trigger migration)
      progressTracker.load();

      // No vocabulary should be marked
      expect(progressTracker.vocabMemorized.size).toBe(0);
    });

    test('should handle migration with non-existent vocabulary ID gracefully', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      // Simulate old format data with non-existent ID
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch99_999']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should trigger migration for ch01_001 only)
      progressTracker.load();

      // Wait for debounced save from migration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Valid vocabulary should be marked
      expect(progressTracker.isVocabMemorized('ch01_001')).toBe(true);
      // Non-existent ID should still be in the set (backward compatibility)
      expect(progressTracker.isVocabMemorized('ch99_999')).toBe(true);
    });

    test('should log migration information', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      // Mock console.log to capture migration log
      const originalLog = console.log;
      let logMessage = '';
      console.log = (message) => {
        if (message.includes('[Migration]')) {
          logMessage = message;
        }
      };

      // Simulate old format data
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should trigger migration)
      progressTracker.load();

      // Wait for debounced save from migration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Verify migration log was generated
      expect(logMessage).toContain('[Migration]');
      expect(logMessage).toContain('1 → 2');

      // Restore console.log
      console.log = originalLog;
    });

    test('should not log when no migration is needed', async () => {
      const mockChapters = [
        {
          vocabulary: [
            { id: 'ch01_001', kanji: '私', kana: 'わたし' }
          ]
        },
        {
          vocabulary: [
            { id: 'ch03_025', kanji: '私', kana: 'わたし' }
          ]
        }
      ];

      // Mock console.log to capture migration log
      const originalLog = console.log;
      let logMessage = '';
      console.log = (message) => {
        if (message.includes('[Migration]')) {
          logMessage = message;
        }
      };

      // Simulate already migrated data
      localStorage.setItem('mnn_vocab_progress', JSON.stringify(['ch01_001', 'ch03_025']));
      
      // Reset and set chapters data
      progressTracker.vocabMemorized = new Set();
      progressTracker.setChaptersData(mockChapters);
      
      // Load data (should not trigger migration)
      progressTracker.load();

      // Wait to ensure no save is triggered
      await new Promise(resolve => setTimeout(resolve, 150));

      // Verify no migration log was generated
      expect(logMessage).toBe('');

      // Restore console.log
      console.log = originalLog;
    });
  });
});
