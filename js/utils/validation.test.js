/**
 * Unit tests for validation utility module
 * Tests validation functions for conversations, quiz questions, and chapter data
 */

import { describe, it, expect } from 'vitest';
import {
  validateConversation,
  validateQuizQuestion,
  validateChapterData,
  isValidHiragana
} from './validation.js';

describe('Validation Utility', () => {
  describe('isValidHiragana', () => {
    it('should return true for valid hiragana text', () => {
      expect(isValidHiragana('すみません、それは なんですか。')).toBe(true);
      expect(isValidHiragana('はじめまして。')).toBe(true);
      expect(isValidHiragana('どうぞ よろしく。')).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isValidHiragana('')).toBe(true);
    });

    it('should return false for text with kanji', () => {
      expect(isValidHiragana('日本語')).toBe(false);
      expect(isValidHiragana('これは 本です')).toBe(false);
    });

    it('should return false for text with katakana', () => {
      expect(isValidHiragana('カタカナ')).toBe(false);
      expect(isValidHiragana('テレビ')).toBe(false);
    });

    it('should return false for non-string input', () => {
      expect(isValidHiragana(null)).toBe(false);
      expect(isValidHiragana(undefined)).toBe(false);
      expect(isValidHiragana(123)).toBe(false);
    });
  });

  describe('validateConversation', () => {
    it('should validate a valid conversation', () => {
      const conversation = {
        id: 'ch01_conv01',
        chapterId: 1,
        order: 1,
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            hiragana: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      };

      const result = validateConversation(conversation);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing conversation id', () => {
      const conversation = {
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
          }
        ]
      };

      const result = validateConversation(conversation);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing or invalid conversation id');
    });

    it('should detect missing turns array', () => {
      const conversation = {
        id: 'ch01_conv01'
      };

      const result = validateConversation(conversation);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('has no turns'))).toBe(true);
    });

    it('should detect missing required fields in turns', () => {
      const conversation = {
        id: 'ch01_conv01',
        turns: [
          {
            speaker: 'ミラー'
            // missing japanese, romaji, indonesian
          }
        ]
      };

      const result = validateConversation(conversation);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('missing japanese'))).toBe(true);
      expect(result.errors.some(e => e.includes('missing romaji'))).toBe(true);
      expect(result.errors.some(e => e.includes('missing indonesian'))).toBe(true);
    });

    it('should warn about missing hiragana field', () => {
      const conversation = {
        id: 'ch01_conv01',
        turns: [
          {
            speaker: 'ミラー',
            japanese: 'はじめまして。',
            romaji: 'Hajimemashite.',
            indonesian: 'Salam kenal.'
            // missing hiragana
          }
        ]
      };

      const result = validateConversation(conversation);
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.includes('missing hiragana'))).toBe(true);
    });

    it('should warn about invalid hiragana characters', () => {
      const conversation = {
        id: 'ch01_conv01',
        turns: [
          {
            speaker: 'ミラー',
            japanese: '日本語',
            hiragana: '日本語', // contains kanji
            romaji: 'Nihongo',
            indonesian: 'Bahasa Jepang'
          }
        ]
      };

      const result = validateConversation(conversation);
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.includes('invalid characters'))).toBe(true);
    });

    it('should reject non-object input', () => {
      const result = validateConversation(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Conversation is not an object');
    });
  });

  describe('validateQuizQuestion', () => {
    it('should validate a valid quiz question', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing question id', () => {
      const question = {
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing question id');
    });

    it('should detect missing question text', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing question text');
    });

    it('should detect missing chapterId', () => {
      const question = {
        id: 'ch01_q01',
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing or invalid chapterId');
    });

    it('should detect missing order', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing or invalid order');
    });

    it('should detect missing category', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing category');
    });

    it('should detect invalid category', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'invalid_category'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid category'))).toBe(true);
    });

    it('should accept all valid categories', () => {
      const validCategories = ['vocabulary', 'grammar', 'reading', 'conversation'];
      
      validCategories.forEach(category => {
        const question = {
          id: 'ch01_q01',
          chapterId: 1,
          order: 1,
          question: 'What is this?',
          choices: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
          category: category
        };

        const result = validateQuizQuestion(question);
        expect(result.valid).toBe(true);
      });
    });

    it('should detect incorrect number of choices', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B'], // should be 4
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('should have 4 choices'))).toBe(true);
    });

    it('should detect invalid correctIndex (negative)', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: -1,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('out of range'))).toBe(true);
    });

    it('should detect invalid correctIndex (too large)', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 4,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('out of range'))).toBe(true);
    });

    it('should accept correctIndex 0-3', () => {
      for (let i = 0; i <= 3; i++) {
        const question = {
          id: 'ch01_q01',
          chapterId: 1,
          order: 1,
          question: 'What is this?',
          choices: ['A', 'B', 'C', 'D'],
          correctIndex: i,
          category: 'vocabulary'
        };

        const result = validateQuizQuestion(question);
        expect(result.valid).toBe(true);
      }
    });

    it('should detect non-array choices', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'What is this?',
        choices: 'not an array',
        correctIndex: 0,
        category: 'vocabulary'
      };

      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Choices is not an array');
    });

    it('should reject non-object input', () => {
      const result = validateQuizQuestion(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Question is not an object');
    });
  });

  describe('validateChapterData', () => {
    it('should validate chapter data with correct counts', () => {
      const chapterData = {
        conversations: Array(10).fill(null).map((_, i) => ({
          id: `ch01_conv${i + 1}`,
          turns: [
            {
              speaker: 'ミラー',
              japanese: 'はじめまして。',
              hiragana: 'はじめまして。',
              romaji: 'Hajimemashite.',
              indonesian: 'Salam kenal.'
            }
          ]
        })),
        quiz: Array(50).fill(null).map((_, i) => ({
          id: `ch01_q${i + 1}`,
          chapterId: 1,
          order: i + 1,
          question: 'Test question',
          choices: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
          category: 'vocabulary'
        }))
      };

      const result = validateChapterData(chapterData, 1);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect incorrect conversation count for chapters 1-10', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'はじめまして。',
                hiragana: 'はじめまして。',
                romaji: 'Hajimemashite.',
                indonesian: 'Salam kenal.'
              }
            ]
          }
        ],
        quiz: Array(50).fill(null).map((_, i) => ({
          id: `ch01_q${i + 1}`,
          chapterId: 1,
          order: i + 1,
          question: 'Test question',
          choices: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
          category: 'vocabulary'
        }))
      };

      const result = validateChapterData(chapterData, 1);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('should have 10 conversations'))).toBe(true);
    });

    it('should detect incorrect quiz count for chapters 1-10', () => {
      const chapterData = {
        conversations: Array(10).fill(null).map((_, i) => ({
          id: `ch01_conv${i + 1}`,
          turns: [
            {
              speaker: 'ミラー',
              japanese: 'はじめまして。',
              hiragana: 'はじめまして。',
              romaji: 'Hajimemashite.',
              indonesian: 'Salam kenal.'
            }
          ]
        })),
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: 'Test question',
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      const result = validateChapterData(chapterData, 1);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('should have 50 quiz questions'))).toBe(true);
    });

    it('should not enforce counts for chapters > 10', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch11_conv01',
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'はじめまして。',
                hiragana: 'はじめまして。',
                romaji: 'Hajimemashite.',
                indonesian: 'Salam kenal.'
              }
            ]
          }
        ],
        quiz: [
          {
            id: 'ch11_q01',
            chapterId: 11,
            order: 1,
            question: 'Test question',
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      const result = validateChapterData(chapterData, 11);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate individual conversations and questions', () => {
      const chapterData = {
        conversations: Array(10).fill(null).map((_, i) => ({
          id: `ch01_conv${i + 1}`,
          turns: [
            {
              speaker: 'ミラー',
              japanese: 'はじめまして。',
              // missing romaji and indonesian
            }
          ]
        })),
        quiz: Array(50).fill(null).map((_, i) => ({
          id: `ch01_q${i + 1}`,
          chapterId: 1,
          order: i + 1,
          question: 'Test question',
          choices: ['A', 'B'], // wrong count
          correctIndex: 0,
          category: 'vocabulary'
        }))
      };

      const result = validateChapterData(chapterData, 1);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('missing romaji'))).toBe(true);
      expect(result.errors.some(e => e.includes('should have 4 choices'))).toBe(true);
    });

    it('should reject non-object input', () => {
      const result = validateChapterData(null, 1);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Chapter data is not an object');
    });
  });
});


/**
 * Task 21.2: Additional unit tests for quiz validation
 * Feature: minna-no-nihongo-chapter-1-10-enhancement
 */
describe('Quiz Validation - Additional Tests (Task 21.2)', () => {
  describe('Valid quiz questions', () => {
    it('should validate a complete valid quiz question', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Bagaimana cara membaca kanji 私?',
        choices: ['わたし', 'あなた', 'かれ', 'かのじょ'],
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should validate all valid categories', () => {
      const categories = ['vocabulary', 'grammar', 'reading', 'conversation'];
      
      for (const category of categories) {
        const question = {
          id: 'ch01_q01',
          chapterId: 1,
          order: 1,
          question: 'Test question',
          choices: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
          category: category
        };
        
        const result = validateQuizQuestion(question);
        expect(result.valid).toBe(true);
      }
    });
    
    it('should validate all valid correctIndex values (0-3)', () => {
      for (let i = 0; i <= 3; i++) {
        const question = {
          id: 'ch01_q01',
          chapterId: 1,
          order: 1,
          question: 'Test question',
          choices: ['A', 'B', 'C', 'D'],
          correctIndex: i,
          category: 'vocabulary'
        };
        
        const result = validateQuizQuestion(question);
        expect(result.valid).toBe(true);
      }
    });
  });
  
  describe('Invalid field types', () => {
    it('should detect invalid id type', () => {
      const question = {
        id: 123, // Should be string
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
    
    it('should detect invalid chapterId type', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: '1', // Should be number
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
    
    it('should detect invalid choices type', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: 'not an array', // Should be array
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
  });
  
  describe('Out-of-range correctIndex', () => {
    it('should detect correctIndex less than 0', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: -1,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('correctIndex'))).toBe(true);
    });
    
    it('should detect correctIndex greater than 3', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 4,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('correctIndex'))).toBe(true);
    });
  });
  
  describe('Invalid choices array', () => {
    it('should detect choices array with less than 4 elements', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C'], // Only 3 choices
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('4 choices'))).toBe(true);
    });
    
    it('should detect choices array with more than 4 elements', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D', 'E'], // 5 choices
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('4 choices'))).toBe(true);
    });
    
    it('should detect empty choice strings', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', '', 'C', 'D'], // Empty choice
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
  });
  
  describe('Invalid category', () => {
    it('should detect invalid category value', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'invalid_category'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('category'))).toBe(true);
    });
    
    it('should detect missing category', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: 'Test',
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0
        // Missing category
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
  });
  
  describe('Empty or missing fields', () => {
    it('should detect empty question text', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        question: '', // Empty
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
    
    it('should detect missing question field', () => {
      const question = {
        id: 'ch01_q01',
        chapterId: 1,
        order: 1,
        // Missing question
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      };
      
      const result = validateQuizQuestion(question);
      expect(result.valid).toBe(false);
    });
  });
});
