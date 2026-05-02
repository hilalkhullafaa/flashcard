/**
 * Edge Case Tests for Task 41
 * Tests edge cases for conversation and quiz modules
 * 
 * Sub-task 41.1: Test with empty conversation data
 * Sub-task 41.2: Test with empty quiz data
 * Sub-task 41.3: Test with special characters and punctuation
 * 
 * Requirements: 14.7, 8.8
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { renderConversation } from './conversation.js';
import { renderQuiz } from './quiz.js';

describe('Task 41: Edge Cases', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // ========================================================================
  // Sub-task 41.1: Test with empty conversation data
  // Requirements: 14.7
  // ========================================================================
  describe('Sub-task 41.1: Empty conversation data', () => {
    test('should handle empty conversations array gracefully', () => {
      const chapterData = {
        conversations: []
      };

      renderConversation(container, chapterData);

      // Should display appropriate message to user
      expect(container.innerHTML).toContain('belum tersedia');
      expect(container.innerHTML).toContain('📚');
      
      // Should not throw error
      expect(container.innerHTML).not.toContain('undefined');
      expect(container.innerHTML).not.toContain('null');
    });

    test('should handle undefined conversations array', () => {
      const chapterData = {
        vocabulary: []
      };

      renderConversation(container, chapterData);

      // Should display appropriate message
      expect(container.innerHTML).toContain('belum tersedia');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle null chapter data', () => {
      renderConversation(container, null);

      // Should display error message
      expect(container.innerHTML).toContain('Gagal memuat');
      expect(container.innerHTML).toContain('⚠️');
      
      // Should not throw error
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle undefined chapter data', () => {
      renderConversation(container, undefined);

      // Should display error message
      expect(container.innerHTML).toContain('Gagal memuat');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle conversations with empty turns array', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            title: 'Empty Conversation',
            turns: []
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should skip invalid conversation and show appropriate message
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle conversations with missing required fields', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            // missing turns
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should skip invalid conversation
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle conversations with invalid turn data', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー'
                // missing japanese, romaji, indonesian
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should skip invalid conversation
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle mixed valid and invalid conversations', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [] // invalid
          },
          {
            id: 'ch01_conv02',
            chapterId: 1,
            order: 2,
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'はじめまして。',
                romaji: 'Hajimemashite.',
                indonesian: 'Salam kenal.',
                hiragana: 'はじめまして。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render valid conversation
      expect(container.innerHTML).toContain('はじめまして');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });
  });

  // ========================================================================
  // Sub-task 41.2: Test with empty quiz data
  // Requirements: 14.7
  // ========================================================================
  describe('Sub-task 41.2: Empty quiz data', () => {
    test('should handle empty quiz array gracefully', () => {
      const chapterData = {
        quiz: []
      };

      renderQuiz(container, chapterData);

      // Should display appropriate message to user
      expect(container.innerHTML).toContain('belum tersedia');
      expect(container.innerHTML).toContain('📝');
      
      // Should not throw error
      expect(container.innerHTML).not.toContain('undefined');
      expect(container.innerHTML).not.toContain('null');
    });

    test('should handle undefined quiz array', () => {
      const chapterData = {
        vocabulary: []
      };

      renderQuiz(container, chapterData);

      // Should display appropriate message
      expect(container.innerHTML).toContain('tidak valid');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle null chapter data', () => {
      renderQuiz(container, null);

      // Should display error message
      expect(container.innerHTML).toContain('Gagal memuat');
      expect(container.innerHTML).toContain('⚠️');
      
      // Should not throw error
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle undefined chapter data', () => {
      renderQuiz(container, undefined);

      // Should display error message
      expect(container.innerHTML).toContain('Gagal memuat');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle quiz with missing required fields', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            // missing question, choices, correctIndex
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should skip invalid question and show error
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle quiz with invalid choices count', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: 'Test question',
            choices: ['A', 'B'], // should be 4
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should skip invalid question
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle quiz with invalid correctIndex', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: 'Test question',
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 5, // out of range
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should skip invalid question
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle mixed valid and invalid quiz questions', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            question: 'Invalid',
            choices: ['A'], // invalid
            correctIndex: 0
          },
          {
            id: 'ch01_q02',
            chapterId: 1,
            order: 2,
            question: 'Valid question',
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should render valid question
      expect(container.innerHTML).toContain('Valid question');
      expect(container.innerHTML).toContain('Soal 1 dari 1');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle quiz with empty question text', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: '',
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should skip invalid question (empty question text is invalid)
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle quiz with null question text', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: null,
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should skip invalid question
      expect(container.innerHTML).toContain('tidak valid');
    });
  });

  // ========================================================================
  // Sub-task 41.3: Test with special characters and punctuation
  // Requirements: 8.8, 14.7
  // ========================================================================
  describe('Sub-task 41.3: Special characters and punctuation', () => {
    beforeEach(() => {
      // Mock kanji parser utilities for furigana generation
      global.window = {
        kanjiParserUtils: {
          parseKanjiSegments: (text) => {
            const segments = [];
            let currentSegment = '';
            let isKanji = false;

            for (const char of text) {
              const charIsKanji = /[\u4e00-\u9faf]/.test(char);
              
              if (charIsKanji !== isKanji && currentSegment) {
                segments.push({ text: currentSegment, isKanji });
                currentSegment = '';
              }
              
              currentSegment += char;
              isKanji = charIsKanji;
            }
            
            if (currentSegment) {
              segments.push({ text: currentSegment, isKanji });
            }
            
            return segments;
          },
          containsKanji: (text) => /[\u4e00-\u9faf]/.test(text)
        },
        vocabularyMatcherUtils: {
          matchKanjiToHiragana: (kanjiText, hiraganaText) => {
            const map = new Map();
            map.set('私', 'わたし');
            map.set('学生', 'がくせい');
            map.set('日本', 'にほん');
            map.set('語', 'ご');
            return map;
          },
          getReading: (kanji, vocabMap, readingsMap) => {
            return readingsMap.get(kanji) || null;
          },
          buildVocabularyMap: (vocabulary) => {
            const map = new Map();
            vocabulary.forEach(v => {
              map.set(v.kanji, v.kana);
            });
            return map;
          }
        }
      };
    });

    test('should handle text with punctuation marks', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'はじめまして。よろしく！',
                romaji: 'Hajimemashite. Yoroshiku!',
                indonesian: 'Salam kenal. Senang bertemu!',
                hiragana: 'はじめまして。よろしく！'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with punctuation
      expect(container.innerHTML).toContain('はじめまして。よろしく！');
      
      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle text with question marks', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'これは何ですか？',
                romaji: 'Kore wa nan desu ka?',
                indonesian: 'Apa ini?',
                hiragana: 'これはなんですか？'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with question mark
      expect(container.innerHTML).toContain('これは何ですか？');
    });

    test('should handle text with numbers', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '私は25歳です。',
                romaji: 'Watashi wa 25-sai desu.',
                indonesian: 'Saya berusia 25 tahun.',
                hiragana: 'わたしは25さいです。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with numbers
      expect(container.innerHTML).toContain('25');
    });

    test('should handle text with symbols', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '電話番号は03-1234-5678です。',
                romaji: 'Denwa bangou wa 03-1234-5678 desu.',
                indonesian: 'Nomor telepon adalah 03-1234-5678.',
                hiragana: 'でんわばんごうは03-1234-5678です。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with symbols
      expect(container.innerHTML).toContain('03-1234-5678');
    });

    test('should handle mixed scripts (kanji, hiragana, katakana)', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '私はアメリカ人です。',
                romaji: 'Watashi wa amerikajin desu.',
                indonesian: 'Saya orang Amerika.',
                hiragana: 'わたしはアメリカじんです。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render mixed scripts
      expect(container.innerHTML).toContain('アメリカ');
    });

    test('should handle text with parentheses', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '私は学生（大学生）です。',
                romaji: 'Watashi wa gakusei (daigakusei) desu.',
                indonesian: 'Saya mahasiswa (universitas).',
                hiragana: 'わたしはがくせい（だいがくせい）です。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with parentheses
      expect(container.innerHTML).toContain('（');
      expect(container.innerHTML).toContain('）');
    });

    test('should handle text with ellipsis', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'えっと…わかりません。',
                romaji: 'Etto... wakarimasen.',
                indonesian: 'Hmm... saya tidak tahu.',
                hiragana: 'えっと…わかりません。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with ellipsis
      expect(container.innerHTML).toContain('…');
    });

    test('should handle quiz questions with punctuation', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: 'これは何ですか？',
            choices: ['本です。', 'ペンです。', '机です。', '椅子です。'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should render question with punctuation
      expect(container.innerHTML).toContain('これは何ですか？');
    });

    test('should handle quiz choices with special characters', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: 'Pilih jawaban yang tepat:',
            choices: [
              '私は学生です。',
              '私は先生です！',
              '私は医者です？',
              '私は…会社員です。'
            ],
            correctIndex: 0,
            category: 'grammar'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should render choices with special characters
      expect(container.innerHTML).toContain('私は学生です。');
      expect(container.innerHTML).toContain('！');
      expect(container.innerHTML).toContain('？');
      expect(container.innerHTML).toContain('…');
    });

    test('should handle text with multiple consecutive punctuation marks', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'えっ！？本当ですか！！',
                romaji: 'E!? Hontou desu ka!!',
                indonesian: 'Hah!? Benarkah!!',
                hiragana: 'えっ！？ほんとうですか！！'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with multiple punctuation
      expect(container.innerHTML).toContain('！？');
      expect(container.innerHTML).toContain('！！');
    });

    test('should handle text with quotation marks', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '「はじめまして」と言いました。',
                romaji: '"Hajimemashite" to iimashita.',
                indonesian: 'Saya berkata "Salam kenal".',
                hiragana: '「はじめまして」といいました。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text with quotation marks
      expect(container.innerHTML).toContain('「');
      expect(container.innerHTML).toContain('」');
    });

    test('should handle empty string in conversation turn', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '',
                romaji: '',
                indonesian: '',
                hiragana: ''
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should skip invalid conversation (empty strings)
      expect(container.innerHTML).toContain('tidak valid');
    });

    test('should handle whitespace-only text', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: '   ',
                romaji: '   ',
                indonesian: '   ',
                hiragana: '   '
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render but may look empty
      // The validation allows non-empty strings, even if whitespace
      expect(container.innerHTML).toBeTruthy();
    });

    test('should handle text with line breaks in quiz questions', () => {
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: 'A: はじめまして。\nB: どうぞよろしく。\n\nPilih respons yang tepat:',
            choices: ['はい', 'いいえ', 'ありがとう', 'すみません'],
            correctIndex: 0,
            category: 'conversation'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should render question with line breaks
      expect(container.innerHTML).toContain('はじめまして');
      expect(container.innerHTML).toContain('どうぞよろしく');
    });

    test('should handle text with tabs', () => {
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: 'はじめまして。\tよろしく。',
                romaji: 'Hajimemashite.\tYoroshiku.',
                indonesian: 'Salam kenal.\tSenang bertemu.',
                hiragana: 'はじめまして。\tよろしく。'
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render text (tabs may be normalized by HTML)
      expect(container.innerHTML).toContain('はじめまして');
      expect(container.innerHTML).toContain('よろしく');
    });
  });

  // ========================================================================
  // Additional edge cases for robustness
  // ========================================================================
  describe('Additional edge cases', () => {
    test('should handle very long conversation text', () => {
      const longText = 'はじめまして。'.repeat(100);
      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: [
              {
                speaker: 'ミラー',
                japanese: longText,
                romaji: 'Hajimemashite. '.repeat(100),
                indonesian: 'Salam kenal. '.repeat(100),
                hiragana: longText
              }
            ]
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render without crashing
      expect(container.innerHTML).toContain('はじめまして');
    });

    test('should handle very long quiz question', () => {
      const longQuestion = 'これは何ですか？'.repeat(50);
      const chapterData = {
        quiz: [
          {
            id: 'ch01_q01',
            chapterId: 1,
            order: 1,
            question: longQuestion,
            choices: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Should render without crashing
      expect(container.innerHTML).toContain('これは何ですか');
    });

    test('should handle conversation with many turns', () => {
      const turns = Array(100).fill(null).map((_, i) => ({
        speaker: i % 2 === 0 ? 'ミラー' : 'たなか',
        japanese: `ターン${i + 1}です。`,
        romaji: `Turn ${i + 1} desu.`,
        indonesian: `Giliran ${i + 1}.`,
        hiragana: `ターン${i + 1}です。`
      }));

      const chapterData = {
        conversations: [
          {
            id: 'ch01_conv01',
            chapterId: 1,
            order: 1,
            turns: turns
          }
        ]
      };

      renderConversation(container, chapterData);

      // Should render without crashing
      expect(container.innerHTML).toContain('ターン1です');
      expect(container.innerHTML).toContain('ターン100です');
    });

    test('should handle quiz with maximum questions', () => {
      const questions = Array(100).fill(null).map((_, i) => ({
        id: `ch01_q${i + 1}`,
        chapterId: 1,
        order: i + 1,
        question: `Question ${i + 1}`,
        choices: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        category: 'vocabulary'
      }));

      const chapterData = {
        quiz: questions
      };

      renderQuiz(container, chapterData);

      // Should render first question
      expect(container.innerHTML).toContain('Question 1');
      expect(container.innerHTML).toContain('Soal 1 dari 100');
    });
  });
});
