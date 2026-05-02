/**
 * Unit Tests for Vocabulary Cache Utility
 * 
 * Tests caching functionality for vocabulary mappings and furigana generation
 * 
 * Requirements: 12.6, 12.7
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCachedVocabularyMap,
  getCachedFurigana,
  clearVocabularyCache,
  clearFuriganaCache,
  clearAllCaches,
  getCacheStats,
  DOMBatchUpdater
} from './vocabularyCache.js';

describe('Vocabulary Cache', () => {
  beforeEach(() => {
    // Clear all caches before each test
    clearAllCaches();
  });

  describe('getCachedVocabularyMap', () => {
    it('should build and cache vocabulary map on first call', () => {
      const vocabularyArray = [
        { kanji: '私', kana: 'わたし' },
        { kanji: '学生', kana: 'がくせい' }
      ];
      
      const buildVocabularyMap = (vocab) => {
        const map = new Map();
        vocab.forEach(v => map.set(v.kanji, v.kana));
        return map;
      };
      
      const result = getCachedVocabularyMap(1, vocabularyArray, buildVocabularyMap);
      
      expect(result).toBeInstanceOf(Map);
      expect(result.get('私')).toBe('わたし');
      expect(result.get('学生')).toBe('がくせい');
      
      // Verify it's cached
      const stats = getCacheStats();
      expect(stats.vocabularyCacheSize).toBe(1);
      expect(stats.vocabularyCachedChapters).toContain(1);
    });

    it('should return cached vocabulary map on subsequent calls', () => {
      const vocabularyArray = [
        { kanji: '私', kana: 'わたし' }
      ];
      
      let buildCallCount = 0;
      const buildVocabularyMap = (vocab) => {
        buildCallCount++;
        const map = new Map();
        vocab.forEach(v => map.set(v.kanji, v.kana));
        return map;
      };
      
      // First call - should build
      getCachedVocabularyMap(1, vocabularyArray, buildVocabularyMap);
      expect(buildCallCount).toBe(1);
      
      // Second call - should use cache
      getCachedVocabularyMap(1, vocabularyArray, buildVocabularyMap);
      expect(buildCallCount).toBe(1); // Not called again
    });

    it('should cache different chapters separately', () => {
      const vocab1 = [{ kanji: '私', kana: 'わたし' }];
      const vocab2 = [{ kanji: '学生', kana: 'がくせい' }];
      
      const buildVocabularyMap = (vocab) => {
        const map = new Map();
        vocab.forEach(v => map.set(v.kanji, v.kana));
        return map;
      };
      
      const result1 = getCachedVocabularyMap(1, vocab1, buildVocabularyMap);
      const result2 = getCachedVocabularyMap(2, vocab2, buildVocabularyMap);
      
      expect(result1.get('私')).toBe('わたし');
      expect(result1.has('学生')).toBe(false);
      
      expect(result2.get('学生')).toBe('がくせい');
      expect(result2.has('私')).toBe(false);
      
      const stats = getCacheStats();
      expect(stats.vocabularyCacheSize).toBe(2);
    });
  });

  describe('getCachedFurigana', () => {
    it('should generate and cache furigana on first call', () => {
      const generateFn = (kanji, hiragana, vocabMap) => {
        return `<ruby>${kanji}<rt>${hiragana}</rt></ruby>`;
      };
      
      const result = getCachedFurigana(
        1,
        '私',
        'わたし',
        generateFn,
        new Map()
      );
      
      expect(result).toBe('<ruby>私<rt>わたし</rt></ruby>');
      
      // Verify it's cached
      const stats = getCacheStats();
      expect(stats.furiganaCacheSize).toBe(1);
    });

    it('should return cached furigana on subsequent calls', () => {
      let generateCallCount = 0;
      const generateFn = (kanji, hiragana, vocabMap) => {
        generateCallCount++;
        return `<ruby>${kanji}<rt>${hiragana}</rt></ruby>`;
      };
      
      // First call - should generate
      getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      expect(generateCallCount).toBe(1);
      
      // Second call - should use cache
      getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      expect(generateCallCount).toBe(1); // Not called again
    });

    it('should cache different texts separately', () => {
      const generateFn = (kanji, hiragana, vocabMap) => {
        return `<ruby>${kanji}<rt>${hiragana}</rt></ruby>`;
      };
      
      const result1 = getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      const result2 = getCachedFurigana(1, '学生', 'がくせい', generateFn, new Map());
      
      expect(result1).toBe('<ruby>私<rt>わたし</rt></ruby>');
      expect(result2).toBe('<ruby>学生<rt>がくせい</rt></ruby>');
      
      const stats = getCacheStats();
      expect(stats.furiganaCacheSize).toBe(2);
    });

    it('should cache same text in different chapters separately', () => {
      const generateFn = (kanji, hiragana, vocabMap) => {
        return `<ruby>${kanji}<rt>${hiragana}</rt></ruby>`;
      };
      
      const result1 = getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      const result2 = getCachedFurigana(2, '私', 'わたし', generateFn, new Map());
      
      expect(result1).toBe(result2);
      
      const stats = getCacheStats();
      expect(stats.furiganaCacheSize).toBe(2); // Cached separately
    });
  });

  describe('clearVocabularyCache', () => {
    it('should clear specific chapter cache', () => {
      const vocab = [{ kanji: '私', kana: 'わたし' }];
      const buildFn = (v) => {
        const map = new Map();
        v.forEach(item => map.set(item.kanji, item.kana));
        return map;
      };
      
      getCachedVocabularyMap(1, vocab, buildFn);
      getCachedVocabularyMap(2, vocab, buildFn);
      
      expect(getCacheStats().vocabularyCacheSize).toBe(2);
      
      clearVocabularyCache(1);
      
      expect(getCacheStats().vocabularyCacheSize).toBe(1);
      expect(getCacheStats().vocabularyCachedChapters).not.toContain(1);
      expect(getCacheStats().vocabularyCachedChapters).toContain(2);
    });

    it('should clear all caches when no chapter specified', () => {
      const vocab = [{ kanji: '私', kana: 'わたし' }];
      const buildFn = (v) => {
        const map = new Map();
        v.forEach(item => map.set(item.kanji, item.kana));
        return map;
      };
      
      getCachedVocabularyMap(1, vocab, buildFn);
      getCachedVocabularyMap(2, vocab, buildFn);
      
      expect(getCacheStats().vocabularyCacheSize).toBe(2);
      
      clearVocabularyCache();
      
      expect(getCacheStats().vocabularyCacheSize).toBe(0);
    });
  });

  describe('clearFuriganaCache', () => {
    it('should clear specific chapter furigana cache', () => {
      const generateFn = (k, h) => `<ruby>${k}<rt>${h}</rt></ruby>`;
      
      getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      getCachedFurigana(1, '学生', 'がくせい', generateFn, new Map());
      getCachedFurigana(2, '先生', 'せんせい', generateFn, new Map());
      
      expect(getCacheStats().furiganaCacheSize).toBe(3);
      
      clearFuriganaCache(1);
      
      expect(getCacheStats().furiganaCacheSize).toBe(1);
    });

    it('should clear all furigana caches when no chapter specified', () => {
      const generateFn = (k, h) => `<ruby>${k}<rt>${h}</rt></ruby>`;
      
      getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      getCachedFurigana(2, '学生', 'がくせい', generateFn, new Map());
      
      expect(getCacheStats().furiganaCacheSize).toBe(2);
      
      clearFuriganaCache();
      
      expect(getCacheStats().furiganaCacheSize).toBe(0);
    });
  });

  describe('clearAllCaches', () => {
    it('should clear both vocabulary and furigana caches', () => {
      const vocab = [{ kanji: '私', kana: 'わたし' }];
      const buildFn = (v) => {
        const map = new Map();
        v.forEach(item => map.set(item.kanji, item.kana));
        return map;
      };
      const generateFn = (k, h) => `<ruby>${k}<rt>${h}</rt></ruby>`;
      
      getCachedVocabularyMap(1, vocab, buildFn);
      getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      
      expect(getCacheStats().vocabularyCacheSize).toBe(1);
      expect(getCacheStats().furiganaCacheSize).toBe(1);
      
      clearAllCaches();
      
      expect(getCacheStats().vocabularyCacheSize).toBe(0);
      expect(getCacheStats().furiganaCacheSize).toBe(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return accurate cache statistics', () => {
      const vocab = [{ kanji: '私', kana: 'わたし' }];
      const buildFn = (v) => {
        const map = new Map();
        v.forEach(item => map.set(item.kanji, item.kana));
        return map;
      };
      const generateFn = (k, h) => `<ruby>${k}<rt>${h}</rt></ruby>`;
      
      getCachedVocabularyMap(1, vocab, buildFn);
      getCachedVocabularyMap(2, vocab, buildFn);
      getCachedFurigana(1, '私', 'わたし', generateFn, new Map());
      
      const stats = getCacheStats();
      
      expect(stats.vocabularyCacheSize).toBe(2);
      expect(stats.furiganaCacheSize).toBe(1);
      expect(stats.vocabularyCachedChapters).toEqual([1, 2]);
      expect(stats.estimatedMemoryUsage).toBeGreaterThan(0);
    });
  });
});

describe('DOMBatchUpdater', () => {
  it('should create a batch updater instance', () => {
    const updater = new DOMBatchUpdater();
    expect(updater).toBeInstanceOf(DOMBatchUpdater);
    expect(updater.operations).toEqual([]);
    expect(updater.scheduled).toBe(false);
  });

  it('should add operations to batch', () => {
    const updater = new DOMBatchUpdater();
    const operation = () => {};
    
    updater.addOperation(operation);
    
    expect(updater.operations).toHaveLength(1);
    expect(updater.operations[0]).toBe(operation);
  });

  it('should clear operations', () => {
    const updater = new DOMBatchUpdater();
    updater.addOperation(() => {});
    updater.addOperation(() => {});
    
    expect(updater.operations).toHaveLength(2);
    
    updater.clear();
    
    expect(updater.operations).toHaveLength(0);
    expect(updater.scheduled).toBe(false);
  });
});
