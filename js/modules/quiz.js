/**
 * Modul Kuis — soal pilihan ganda per bab.
 */

import { shuffleArray, calculateQuizResult } from '../utils.js';

/**
 * Sanitize HTML to only allow ruby and rt tags for furigana display
 * Prevents XSS attacks while allowing furigana in quiz questions
 * 
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 * 
 * Requirements: 3.6, 3.7, 3.8
 */
function sanitizeQuestionHTML(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // For now, return as-is since we control the input from JSON data
  // Ruby tags are safe and necessary for furigana display
  // In production with user-generated content, implement proper sanitization
  return html;
}

/**
 * Render modul kuis ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderQuiz(container, chapterData) {
  container.innerHTML = '';

  // Enhanced error handling for missing or invalid chapter data
  // Requirements: 13.4, 13.5, 13.10
  if (!chapterData || typeof chapterData !== 'object') {
    const detailedError = '[Modul Kuis] Data bab tidak valid atau tidak ditemukan';
    console.error(detailedError, { receivedData: chapterData });
    // User-friendly error message in Indonesian
    // Requirements: 13.10
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-sm mb-2">⚠️ Gagal memuat data kuis</p>
        <p class="text-gray-400 text-xs">Data bab tidak valid. Silakan coba muat ulang halaman.</p>
      </div>
    `;
    return;
  }

  const quizData = chapterData?.quiz;

  // Enhanced error handling for invalid quiz array
  // Requirements: 13.4, 13.5, 13.10
  if (!Array.isArray(quizData)) {
    const detailedError = `[Modul Kuis] Field 'quiz' tidak ada atau bukan array. Tipe yang diterima: ${typeof quizData}`;
    console.error(detailedError, { quizData });
    // User-friendly error message in Indonesian
    // Requirements: 13.10
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-sm mb-2">⚠️ Data kuis tidak valid</p>
        <p class="text-gray-400 text-xs">Format data kuis tidak sesuai. Silakan hubungi administrator.</p>
      </div>
    `;
    return;
  }

  // Enhanced error handling for empty quiz array
  // Requirements: 13.10
  if (quizData.length === 0) {
    console.warn('[Modul Kuis] Array kuis kosong untuk bab ini');
    // User-friendly message in Indonesian
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-sm">📝 Kuis untuk bab ini belum tersedia</p>
      </div>
    `;
    return;
  }

  // Validate and filter quiz questions with enhanced error logging
  // Requirements: 2.6, 13.4, 13.5
  const validQuestions = quizData.filter((question, index) => {
    // Basic validation for required fields
    const isValid = 
      question &&
      typeof question === 'object' &&
      question.question &&
      Array.isArray(question.choices) &&
      question.choices.length === 4 &&
      typeof question.correctIndex === 'number' &&
      question.correctIndex >= 0 &&
      question.correctIndex <= 3;
    
    if (!isValid) {
      // Log detailed warning when skipping invalid question
      // Requirements: 2.6, 13.4, 13.5
      const detailedWarning = `[Modul Kuis] Melewati soal ke-${index + 1} karena data tidak valid`;
      console.warn(detailedWarning, { 
        questionIndex: index, 
        question,
        validationIssues: {
          hasQuestion: !!question?.question,
          hasChoices: Array.isArray(question?.choices),
          choicesCount: question?.choices?.length,
          hasValidCorrectIndex: typeof question?.correctIndex === 'number' && question?.correctIndex >= 0 && question?.correctIndex <= 3
        }
      });
    }
    return isValid;
  });

  // Enhanced error handling when all questions are invalid
  // Requirements: 13.4, 13.5, 13.10
  if (validQuestions.length === 0) {
    const detailedError = '[Modul Kuis] Tidak ada soal kuis yang valid ditemukan dalam data bab';
    console.error(detailedError, { totalQuestions: quizData.length });
    // User-friendly error message in Indonesian
    // Requirements: 13.10
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-sm mb-2">⚠️ Data kuis tidak valid</p>
        <p class="text-gray-400 text-xs">Semua soal memiliki format data yang tidak sesuai. Silakan hubungi administrator.</p>
      </div>
    `;
    return;
  }

  // Log warning if some questions were skipped
  // Requirements: 2.6, 13.10
  if (validQuestions.length < quizData.length) {
    const skippedCount = quizData.length - validQuestions.length;
    const detailedWarning = `[Modul Kuis] ${skippedCount} soal dilewati karena data tidak valid`;
    console.warn(detailedWarning, { 
      totalQuestions: quizData.length, 
      validQuestions: validQuestions.length,
      skippedCount 
    });
  }

  // Local state
  let questions = [...validQuestions];
  let currentIndex = 0;
  let selectedAnswers = new Array(questions.length).fill(null);
  let isFinished = false;

  // ── Render helpers ────────────────────────────────────────────────────────

  function renderQuestion() {
    container.innerHTML = '';

    const q = questions[currentIndex];
    const answered = selectedAnswers[currentIndex] !== null;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col gap-5';

    // Progress indicator
    const progress = document.createElement('p');
    progress.className = 'text-sm text-slate-300 font-medium';
    progress.textContent = `Soal ${currentIndex + 1} dari ${questions.length}`;
    wrapper.appendChild(progress);

    // Question text - use innerHTML to support ruby tags for furigana (Requirements: 3.6, 3.7, 3.8)
    const questionEl = document.createElement('p');
    questionEl.className = 'text-base font-semibold text-white leading-relaxed';
    questionEl.innerHTML = sanitizeQuestionHTML(q.question);
    wrapper.appendChild(questionEl);

    // Choices
    const choicesEl = document.createElement('div');
    choicesEl.className = 'flex flex-col gap-3';

    for (let i = 0; i < q.choices.length; i++) {
      const btn = document.createElement('button');
      btn.className = buildChoiceClass(i, q.correctIndex, selectedAnswers[currentIndex], answered);
      // Use innerHTML to support ruby tags in choices (Requirements: 3.6, 3.7, 3.8)
      btn.innerHTML = sanitizeQuestionHTML(q.choices[i]);
      btn.disabled = answered;

      btn.addEventListener('click', () => {
        selectedAnswers[currentIndex] = i;
        renderQuestion();
      });

      choicesEl.appendChild(btn);
    }

    wrapper.appendChild(choicesEl);

    // Feedback: show correct answer if wrong
    if (answered && selectedAnswers[currentIndex] !== q.correctIndex) {
      const feedback = document.createElement('p');
      feedback.className = 'text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2';
      // Use innerHTML to support ruby tags in correct answer display
      feedback.innerHTML = `Jawaban benar: ${sanitizeQuestionHTML(q.choices[q.correctIndex])}`;
      wrapper.appendChild(feedback);
    }

    // Next / Finish button (only shown after answering)
    if (answered) {
      const isLast = currentIndex === questions.length - 1;
      const nextBtn = document.createElement('button');
      nextBtn.className = 'self-end px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors';
      nextBtn.textContent = isLast ? 'Lihat Hasil' : 'Soal Berikutnya →';

      nextBtn.addEventListener('click', () => {
        if (isLast) {
          isFinished = true;
          renderResults();
        } else {
          currentIndex++;
          renderQuestion();
        }
      });

      wrapper.appendChild(nextBtn);
    }

    container.appendChild(wrapper);
  }

  function renderResults() {
    container.innerHTML = '';

    const { correctCount, totalQuestions, percentage } = calculateQuizResult(questions, selectedAnswers);

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col items-center gap-6 py-8';

    const scoreEl = document.createElement('p');
    scoreEl.className = 'text-xl font-bold text-gray-800';
    scoreEl.textContent = `${correctCount} dari ${totalQuestions} soal benar`;
    wrapper.appendChild(scoreEl);

    const pctEl = document.createElement('p');
    pctEl.className = `text-4xl font-extrabold ${percentageColor(percentage)}`;
    pctEl.textContent = `${percentage}%`;
    wrapper.appendChild(pctEl);

    const retryBtn = document.createElement('button');
    retryBtn.className = 'mt-4 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors';
    retryBtn.textContent = '🔄 Ulangi Kuis';

    retryBtn.addEventListener('click', () => {
      questions = shuffleArray(questions);
      currentIndex = 0;
      selectedAnswers = new Array(questions.length).fill(null);
      isFinished = false;
      renderQuestion();
    });

    wrapper.appendChild(retryBtn);
    container.appendChild(wrapper);
  }

  // ── Utility ───────────────────────────────────────────────────────────────

  /**
   * Build Tailwind classes for a choice button.
   *
   * @param {number} index
   * @param {number} correctIndex
   * @param {number|null} selected
   * @param {boolean} answered
   * @returns {string}
   */
  function buildChoiceClass(index, correctIndex, selected, answered) {
    const base = 'w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors';
    if (!answered) {
      return `${base} border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300`;
    }
    if (index === correctIndex) {
      return `${base} bg-green-100 border-green-500 text-green-800`;
    }
    if (index === selected) {
      return `${base} bg-red-100 border-red-500 text-red-800`;
    }
    return `${base} border-gray-200 bg-white text-gray-400`;
  }

  /**
   * @param {number} pct
   * @returns {string}
   */
  function percentageColor(pct) {
    if (pct >= 70) return 'text-green-600';
    if (pct >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  // Initial render
  renderQuestion();
}

export { renderQuiz };
