/**
 * Unit tests for quiz module
 * Tests ruby tag rendering for furigana display in quiz questions
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { renderQuiz } from './quiz.js';

describe('Quiz Module - Ruby Tag Support (Task 24.1)', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('Question text rendering with ruby tags', () => {
    test('should render ruby tags in question text for vocabulary questions', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q01',
            chapterId: 1,
            order: 1,
            question: "Bagaimana cara membaca kanji '<ruby>医者<rt>いしゃ</rt></ruby>'?",
            choices: ['せんせい', 'いしゃ', 'がくせい', 'ぎんこういん'],
            correctIndex: 1,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      const questionEl = container.querySelector('p.text-base');
      expect(questionEl).toBeTruthy();
      
      // Should contain ruby tag
      expect(questionEl.innerHTML).toContain('<ruby>');
      expect(questionEl.innerHTML).toContain('<rt>');
      expect(questionEl.innerHTML).toContain('医者');
      expect(questionEl.innerHTML).toContain('いしゃ');
    });

    test('should render ruby tags in question text for conversation questions', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q02',
            chapterId: 1,
            order: 1,
            question: "A: <ruby>失礼<rt>しつれい</rt></ruby>ですが、お<ruby>名前<rt>なまえ</rt></ruby>は？\nB: ___\n\nPilih respons yang tepat:",
            choices: ['はい、そうです。', 'ワンです。', 'いいえ、ちがいます。', 'ありがとうございます。'],
            correctIndex: 1,
            category: 'conversation'
          }
        ]
      };

      renderQuiz(container, chapterData);

      const questionEl = container.querySelector('p.text-base');
      expect(questionEl).toBeTruthy();
      
      // Should contain multiple ruby tags
      expect(questionEl.innerHTML).toContain('<ruby>失礼<rt>しつれい</rt></ruby>');
      expect(questionEl.innerHTML).toContain('<ruby>名前<rt>なまえ</rt></ruby>');
    });

    test('should render plain text questions without ruby tags', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q03',
            chapterId: 1,
            order: 1,
            question: "Pilih partikel yang tepat: わたし___ がくせいです。",
            choices: ['は', 'が', 'を', 'に'],
            correctIndex: 0,
            category: 'grammar'
          }
        ]
      };

      renderQuiz(container, chapterData);

      const questionEl = container.querySelector('p.text-base');
      expect(questionEl).toBeTruthy();
      
      // Should not contain ruby tags
      expect(questionEl.innerHTML).not.toContain('<ruby>');
      expect(questionEl.innerHTML).not.toContain('<rt>');
      expect(questionEl.textContent).toContain('わたし___ がくせいです');
    });
  });

  describe('Choice rendering with ruby tags', () => {
    test('should render ruby tags in answer choices', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q04',
            chapterId: 1,
            order: 1,
            question: "Pilih kata yang tepat:",
            choices: [
              '<ruby>先生<rt>せんせい</rt></ruby>',
              '<ruby>学生<rt>がくせい</rt></ruby>',
              '<ruby>医者<rt>いしゃ</rt></ruby>',
              '<ruby>会社員<rt>かいしゃいん</rt></ruby>'
            ],
            correctIndex: 0,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      const choiceButtons = container.querySelectorAll('button');
      // Should have 4 choice buttons
      expect(choiceButtons.length).toBeGreaterThanOrEqual(4);
      
      // Check first choice button contains ruby tag
      const firstChoice = choiceButtons[0];
      expect(firstChoice.innerHTML).toContain('<ruby>');
      expect(firstChoice.innerHTML).toContain('<rt>');
      expect(firstChoice.innerHTML).toContain('先生');
      expect(firstChoice.innerHTML).toContain('せんせい');
    });

    test('should render plain text choices without ruby tags', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q05',
            chapterId: 1,
            order: 1,
            question: "Pilih partikel yang tepat:",
            choices: ['は', 'が', 'を', 'に'],
            correctIndex: 0,
            category: 'grammar'
          }
        ]
      };

      renderQuiz(container, chapterData);

      const choiceButtons = container.querySelectorAll('button');
      expect(choiceButtons.length).toBeGreaterThanOrEqual(4);
      
      // Check choices don't contain ruby tags
      choiceButtons.forEach(button => {
        expect(button.innerHTML).not.toContain('<ruby>');
        expect(button.innerHTML).not.toContain('<rt>');
      });
    });
  });

  describe('Feedback rendering with ruby tags', () => {
    test('should render ruby tags in correct answer feedback', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q06',
            chapterId: 1,
            order: 1,
            question: "Bagaimana cara membaca kanji '<ruby>病院<rt>びょういん</rt></ruby>'?",
            choices: ['だいがく', '<ruby>病院<rt>びょういん</rt></ruby>', 'かいしゃ', 'ぎんこう'],
            correctIndex: 1,
            category: 'vocabulary'
          }
        ]
      };

      renderQuiz(container, chapterData);

      // Click wrong answer (first choice)
      const choiceButtons = container.querySelectorAll('button');
      choiceButtons[0].click();

      // Check feedback message
      const feedback = container.querySelector('.text-green-700');
      expect(feedback).toBeTruthy();
      expect(feedback.innerHTML).toContain('Jawaban benar:');
      expect(feedback.innerHTML).toContain('<ruby>病院<rt>びょういん</rt></ruby>');
    });
  });

  describe('Edge cases', () => {
    test('should handle empty question text', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q07',
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

      const questionEl = container.querySelector('p.text-base');
      expect(questionEl).toBeTruthy();
      expect(questionEl.innerHTML).toBe('');
    });

    test('should handle null question text', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q08',
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

      const questionEl = container.querySelector('p.text-base');
      expect(questionEl).toBeTruthy();
      expect(questionEl.innerHTML).toBe('');
    });

    test('should handle mixed content with ruby tags and plain text', () => {
      const chapterData = {
        quiz: [
          {
            id: 'test_q09',
            chapterId: 1,
            order: 1,
            question: "これは <ruby>日本語<rt>にほんご</rt></ruby> の <ruby>教科書<rt>きょうかしょ</rt></ruby> です。",
            choices: ['はい', 'いいえ', 'わかりません', 'そうです'],
            correctIndex: 0,
            category: 'reading'
          }
        ]
      };

      renderQuiz(container, chapterData);

      const questionEl = container.querySelector('p.text-base');
      expect(questionEl).toBeTruthy();
      
      // Should contain both ruby tags and plain text
      expect(questionEl.innerHTML).toContain('<ruby>日本語<rt>にほんご</rt></ruby>');
      expect(questionEl.innerHTML).toContain('<ruby>教科書<rt>きょうかしょ</rt></ruby>');
      expect(questionEl.innerHTML).toContain('これは');
      expect(questionEl.innerHTML).toContain('です。');
    });
  });

  describe('Invalid data handling', () => {
    test('should handle invalid chapter data gracefully', () => {
      renderQuiz(container, null);

      expect(container.innerHTML).toContain('Gagal memuat data kuis');
    });

    test('should handle missing quiz array', () => {
      const chapterData = {
        vocabulary: []
      };

      renderQuiz(container, chapterData);

      expect(container.innerHTML).toContain('Data kuis tidak valid');
    });

    test('should handle empty quiz array', () => {
      const chapterData = {
        quiz: []
      };

      renderQuiz(container, chapterData);

      expect(container.innerHTML).toContain('Kuis untuk bab ini belum tersedia');
    });
  });
});
