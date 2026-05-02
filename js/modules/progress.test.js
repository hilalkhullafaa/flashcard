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
});
