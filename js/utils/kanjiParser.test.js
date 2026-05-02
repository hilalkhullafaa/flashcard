/**
 * Unit Tests for Kanji Parser
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 * Task 15.2: Write unit tests for kanji parser edge cases
 * 
 * Run with: npm test
 */

import { describe, test, expect } from 'vitest';
import { parseKanjiSegments, containsKanji } from './kanjiParser.js';

describe('Kanji Parser - Edge Cases', () => {
  
  describe('Empty and null inputs', () => {
    test('should handle empty string', () => {
      const result = parseKanjiSegments('');
      expect(result).toEqual([]);
    });
    
    test('should handle null input gracefully', () => {
      const result = parseKanjiSegments(null);
      expect(result).toEqual([]);
    });
    
    test('should handle undefined input gracefully', () => {
      const result = parseKanjiSegments(undefined);
      expect(result).toEqual([]);
    });
  });
  
  describe('Hiragana-only text', () => {
    test('should parse hiragana-only text', () => {
      const result = parseKanjiSegments('はじめまして');
      expect(result).toEqual([
        { text: 'はじめまして', isKanji: false }
      ]);
    });
    
    test('should detect no kanji in hiragana text', () => {
      const result = containsKanji('はじめまして');
      expect(result).toBe(false);
    });
    
    test('should handle hiragana with punctuation', () => {
      const result = parseKanjiSegments('はじめまして。');
      expect(result).toEqual([
        { text: 'はじめまして。', isKanji: false }
      ]);
    });
  });
  
  describe('Katakana-only text', () => {
    test('should parse katakana-only text', () => {
      const result = parseKanjiSegments('アメリカ');
      expect(result).toEqual([
        { text: 'アメリカ', isKanji: false }
      ]);
    });
    
    test('should detect no kanji in katakana text', () => {
      const result = containsKanji('アメリカ');
      expect(result).toBe(false);
    });
    
    test('should handle katakana with middle dot', () => {
      const result = parseKanjiSegments('マイク・ミラー');
      expect(result).toEqual([
        { text: 'マイク・ミラー', isKanji: false }
      ]);
    });
  });
  
  describe('Mixed scripts', () => {
    test('should parse mixed kanji and hiragana', () => {
      const result = parseKanjiSegments('私は学生です');
      expect(result.length).toBeGreaterThan(1);
      
      // Should have kanji segments
      const kanjiSegments = result.filter(s => s.isKanji);
      expect(kanjiSegments.length).toBeGreaterThan(0);
      
      // Should have non-kanji segments
      const nonKanjiSegments = result.filter(s => !s.isKanji);
      expect(nonKanjiSegments.length).toBeGreaterThan(0);
    });
    
    test('should detect kanji in mixed text', () => {
      const result = containsKanji('私は学生です');
      expect(result).toBe(true);
    });
    
    test('should parse mixed kanji, hiragana, and katakana', () => {
      const result = parseKanjiSegments('私はアメリカ人です');
      expect(result.length).toBeGreaterThan(1);
    });
  });
  
  describe('Special characters and punctuation', () => {
    test('should handle Japanese punctuation', () => {
      const result = parseKanjiSegments('私は学生です。');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
    
    test('should handle question marks', () => {
      const result = parseKanjiSegments('先生ですか？');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
    
    test('should handle exclamation marks', () => {
      const result = parseKanjiSegments('はい！');
      expect(result).toEqual([
        { text: 'はい！', isKanji: false }
      ]);
    });
    
    test('should handle quotation marks', () => {
      const result = parseKanjiSegments('「こんにちは」');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
  
  describe('Numbers and symbols', () => {
    test('should handle Arabic numerals', () => {
      const result = parseKanjiSegments('123');
      expect(result).toEqual([
        { text: '123', isKanji: false }
      ]);
    });
    
    test('should handle mixed text with numbers', () => {
      const result = parseKanjiSegments('私は20歳です');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
    
    test('should handle tilde', () => {
      const result = parseKanjiSegments('～さん');
      expect(result).toEqual([
        { text: '～さん', isKanji: false }
      ]);
    });
  });
  
  describe('Long kanji sequences', () => {
    test('should handle single long kanji word', () => {
      const result = parseKanjiSegments('日本語');
      expect(result).toEqual([
        { text: '日本語', isKanji: true }
      ]);
    });
    
    test('should handle multiple long kanji words', () => {
      const result = parseKanjiSegments('日本語の先生です');
      expect(result.length).toBeGreaterThan(1);
      
      const kanjiSegments = result.filter(s => s.isKanji);
      expect(kanjiSegments.length).toBeGreaterThan(0);
    });
  });
  
  describe('Compound words', () => {
    test('should parse compound kanji words', () => {
      const result = parseKanjiSegments('銀行員');
      expect(result).toEqual([
        { text: '銀行員', isKanji: true }
      ]);
    });
    
    test('should parse compound words with okurigana', () => {
      const result = parseKanjiSegments('食べます');
      expect(result.length).toBeGreaterThan(0);
    });
  });
  
  describe('Whitespace handling', () => {
    test('should handle leading whitespace', () => {
      const result = parseKanjiSegments(' 私は学生です');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
    
    test('should handle trailing whitespace', () => {
      const result = parseKanjiSegments('私は学生です ');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
    
    test('should handle spaces between words', () => {
      const result = parseKanjiSegments('私は 学生です');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
  
  describe('Rare and complex kanji', () => {
    test('should handle common kanji', () => {
      const result = containsKanji('日本');
      expect(result).toBe(true);
    });
    
    test('should handle less common kanji', () => {
      const result = containsKanji('銀行');
      expect(result).toBe(true);
    });
  });
  
  describe('Performance', () => {
    test('should parse long text efficiently', () => {
      const longText = '私は学生です。'.repeat(100);
      const startTime = Date.now();
      const result = parseKanjiSegments(longText);
      const endTime = Date.now();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // Should complete within 100ms (requirement from design doc)
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100);
    });
  });
});
