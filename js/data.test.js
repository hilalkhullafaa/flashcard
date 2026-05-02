/**
 * Unit tests for data.js validation integration
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.8
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchChapterData } from './data.js';

describe('Data Loading with Validation Integration', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;
  
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = vi.fn();
  });
  
  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    vi.restoreAllMocks();
  });
  
  it('should validate chapter data after loading', async () => {
    // Mock valid chapter data
    const mockData = {
      chapter: { id: 1, title: 'Test Chapter' },
      conversations: Array(10).fill(null).map((_, i) => ({
        id: `conv${i}`,
        chapterId: 1,
        order: i + 1,
        turns: [
          {
            speaker: 'A',
            japanese: 'こんにちは',
            hiragana: 'こんにちは',
            romaji: 'konnichiwa',
            indonesian: 'Halo'
          }
        ]
      })),
      quiz: Array(50).fill(null).map((_, i) => ({
        id: `q${i}`,
        chapterId: 1,
        order: i + 1,
        question: 'Test question',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: i < 15 ? 'vocabulary' : i < 30 ? 'grammar' : i < 40 ? 'reading' : 'conversation'
      }))
    };
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchChapterData(1);
    
    expect(result).toEqual(mockData);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
  
  it('should log validation errors to console', async () => {
    // Mock chapter data with validation errors (missing conversations)
    const mockData = {
      chapter: { id: 1, title: 'Test Chapter' },
      conversations: [], // Should have 10
      quiz: [] // Should have 50
    };
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchChapterData(1);
    
    expect(result).toEqual(mockData);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Validation errors for chapter 1:',
      expect.arrayContaining([
        'Chapter 1 should have 10 conversations, has 0',
        'Chapter 1 should have 50 quiz questions, has 0'
      ])
    );
  });
  
  it('should log validation warnings to console', async () => {
    // Mock chapter data with validation warnings (missing hiragana)
    const mockData = {
      chapter: { id: 1, title: 'Test Chapter' },
      conversations: Array(10).fill(null).map((_, i) => ({
        id: `conv${i}`,
        chapterId: 1,
        order: i + 1,
        turns: [
          {
            speaker: 'A',
            japanese: 'こんにちは',
            // Missing hiragana field
            romaji: 'konnichiwa',
            indonesian: 'Halo'
          }
        ]
      })),
      quiz: Array(50).fill(null).map((_, i) => ({
        id: `q${i}`,
        chapterId: 1,
        order: i + 1,
        question: 'Test question',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: i < 15 ? 'vocabulary' : i < 30 ? 'grammar' : i < 40 ? 'reading' : 'conversation'
      }))
    };
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchChapterData(1);
    
    expect(result).toEqual(mockData);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Validation warnings for chapter 1:',
      expect.arrayContaining([
        expect.stringContaining('missing hiragana')
      ])
    );
  });
  
  it('should return validated data even if warnings exist', async () => {
    // Mock chapter data with warnings but no errors
    const mockData = {
      chapter: { id: 1, title: 'Test Chapter' },
      conversations: Array(10).fill(null).map((_, i) => ({
        id: `conv${i}`,
        chapterId: 1,
        order: i + 1,
        turns: [
          {
            speaker: 'A',
            japanese: 'こんにちは',
            // Missing hiragana - warning only
            romaji: 'konnichiwa',
            indonesian: 'Halo'
          }
        ]
      })),
      quiz: Array(50).fill(null).map((_, i) => ({
        id: `q${i}`,
        chapterId: 1,
        order: i + 1,
        question: 'Test question',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: i < 15 ? 'vocabulary' : i < 30 ? 'grammar' : i < 40 ? 'reading' : 'conversation'
      }))
    };
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchChapterData(1);
    
    // Should return data despite warnings
    expect(result).toEqual(mockData);
    expect(result).not.toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalled();
  });
  
  it('should not validate chapters outside range 1-10', async () => {
    // Mock chapter 11 data (no conversations/quiz required)
    const mockData = {
      chapter: { id: 11, title: 'Test Chapter 11' },
      conversations: [], // Not required for chapter 11
      quiz: [] // Not required for chapter 11
    };
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    });
    
    const result = await fetchChapterData(11);
    
    expect(result).toEqual(mockData);
    // Should not log errors for missing conversations/quiz in chapter 11
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        expect.stringContaining('should have 10 conversations')
      ])
    );
  });
});
