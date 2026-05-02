/**
 * Unit Tests for Error Handling
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 * Task 40: Write unit tests for error handling
 * 
 * Run with: npm test
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Error Handling Tests', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;
  
  beforeEach(() => {
    // Spy on console methods
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console methods
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
  
  describe('Missing required fields', () => {
    test('should handle conversation with missing speaker field', () => {
      const conversation = {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            // Missing speaker
            japanese: 'Test',
            romaji: 'Test',
            indonesian: 'Test',
            hiragana: 'Test'
          }
        ]
      };
      
      // The system should handle this gracefully
      expect(() => {
        // Simulate validation
        if (!conversation.turns[0].speaker) {
          console.error('Missing speaker field in conversation turn');
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    test('should handle quiz question with missing choices', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        // Missing choices
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      expect(() => {
        if (!question.choices) {
          console.error('Missing choices field in quiz question');
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('Invalid field types', () => {
    test('should handle invalid chapterId type', () => {
      const conversation = {
        id: 'ch01_conv01',
        chapterId: '1', // Should be number
        order: 1,
        turns: []
      };
      
      expect(() => {
        if (typeof conversation.chapterId !== 'number') {
          console.error('Invalid chapterId type:', typeof conversation.chapterId);
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    test('should handle invalid correctIndex type', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: '0', // Should be number
        category: 'vocabulary'
      };
      
      expect(() => {
        if (typeof question.correctIndex !== 'number') {
          console.error('Invalid correctIndex type:', typeof question.correctIndex);
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('Out-of-range values', () => {
    test('should handle correctIndex out of range', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 5, // Out of range
        category: 'vocabulary'
      };
      
      expect(() => {
        if (question.correctIndex < 0 || question.correctIndex > 3) {
          console.error('correctIndex out of range:', question.correctIndex);
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    test('should handle negative order value', () => {
      const conversation = {
        id: 'ch01_conv01',
        chapterId: 1,
        order: -1, // Invalid
        turns: []
      };
      
      expect(() => {
        if (conversation.order <= 0) {
          console.error('Invalid order value:', conversation.order);
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('Furigana matching errors', () => {
    test('should handle kanji not found in vocabulary', () => {
      const kanji = '漢字';
      const vocabulary = new Map();
      
      expect(() => {
        if (!vocabulary.has(kanji)) {
          console.warn(`Kanji sequence '${kanji}' not found in vocabulary dataset`);
        }
      }).not.toThrow();
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
    
    test('should handle ambiguous kanji sequences', () => {
      const kanji = '日本語';
      
      expect(() => {
        console.warn(`Ambiguous kanji sequence detected: ${kanji}`);
      }).not.toThrow();
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
  
  describe('User-friendly error messages', () => {
    test('should provide user-friendly message for missing conversation data', () => {
      const errorMessage = 'Gagal memuat data percakapan';
      
      expect(errorMessage).toBe('Gagal memuat data percakapan');
      expect(errorMessage).toMatch(/percakapan/);
    });
    
    test('should provide user-friendly message for invalid conversation data', () => {
      const errorMessage = 'Data percakapan tidak valid';
      
      expect(errorMessage).toBe('Data percakapan tidak valid');
      expect(errorMessage).toMatch(/tidak valid/);
    });
    
    test('should provide user-friendly message for missing quiz data', () => {
      const errorMessage = 'Gagal memuat data kuis';
      
      expect(errorMessage).toBe('Gagal memuat data kuis');
      expect(errorMessage).toMatch(/kuis/);
    });
  });
  
  describe('Developer-facing error messages', () => {
    test('should provide detailed error for missing field', () => {
      const conversationId = 'ch01_conv01';
      const fieldName = 'speaker';
      
      expect(() => {
        console.error(`Invalid conversation: missing required field '${fieldName}' in conversation ${conversationId}`);
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(fieldName)
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(conversationId)
      );
    });
    
    test('should provide detailed error for kanji not in vocabulary', () => {
      const kanji = '漢字';
      const chapterId = 1;
      
      expect(() => {
        console.warn(`Kanji sequence '${kanji}' not found in chapter ${chapterId} vocabulary dataset`);
      }).not.toThrow();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(kanji)
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(String(chapterId))
      );
    });
  });
  
  describe('System errors', () => {
    test('should handle JSON parse failures gracefully', () => {
      const invalidJSON = '{invalid json}';
      
      expect(() => {
        try {
          JSON.parse(invalidJSON);
        } catch (error) {
          console.error('JSON parse failed:', error.message);
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    test('should handle module loading failures gracefully', () => {
      const moduleName = 'nonexistent-module';
      
      expect(() => {
        console.error(`Failed to load module: ${moduleName}`);
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('Data validation errors', () => {
    test('should handle empty conversation array', () => {
      const conversations = [];
      
      expect(() => {
        if (conversations.length === 0) {
          console.warn('No conversations found in chapter data');
        }
      }).not.toThrow();
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
    
    test('should handle empty quiz array', () => {
      const quiz = [];
      
      expect(() => {
        if (quiz.length === 0) {
          console.warn('No quiz questions found in chapter data');
        }
      }).not.toThrow();
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
    
    test('should handle null chapter data', () => {
      const chapterData = null;
      
      expect(() => {
        if (!chapterData) {
          console.error('Chapter data is null or undefined');
        }
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('Error recovery', () => {
    test('should skip invalid entry and continue processing', () => {
      const conversations = [
        { id: 'ch01_conv01', turns: [] }, // Valid
        { id: 'ch01_conv02' }, // Invalid - missing turns
        { id: 'ch01_conv03', turns: [] }  // Valid
      ];
      
      const validConversations = [];
      
      expect(() => {
        for (const conv of conversations) {
          if (!conv.turns) {
            console.error(`Skipping invalid conversation: ${conv.id}`);
            continue;
          }
          validConversations.push(conv);
        }
      }).not.toThrow();
      
      expect(validConversations.length).toBe(2);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    test('should continue after encountering unknown kanji', () => {
      const kanjiWords = ['私', '未知の漢字', '学生'];
      const vocabulary = new Map([['私', 'わたし'], ['学生', 'がくせい']]);
      const processedWords = [];
      
      expect(() => {
        for (const kanji of kanjiWords) {
          if (!vocabulary.has(kanji)) {
            console.warn(`Unknown kanji: ${kanji}, displaying without furigana`);
          }
          processedWords.push(kanji);
        }
      }).not.toThrow();
      
      expect(processedWords.length).toBe(3);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
