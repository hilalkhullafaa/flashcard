/**
 * Modul Kuis — soal pilihan ganda per bab.
 */

import { shuffleArray, calculateQuizResult } from '../utils.js';

/**
 * Render modul kuis ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderQuiz(container, chapterData) {
  container.innerHTML = '';

  const quizData = chapterData?.quiz;

  if (!quizData || quizData.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Kuis untuk bab ini belum tersedia.</p>
    `;
    return;
  }

  // Local state
  let questions = [...quizData];
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
    progress.className = 'text-sm text-gray-400 font-medium';
    progress.textContent = `Soal ${currentIndex + 1} dari ${questions.length}`;
    wrapper.appendChild(progress);

    // Question text
    const questionEl = document.createElement('p');
    questionEl.className = 'text-base font-semibold text-gray-800 leading-relaxed';
    questionEl.textContent = q.question;
    wrapper.appendChild(questionEl);

    // Choices
    const choicesEl = document.createElement('div');
    choicesEl.className = 'flex flex-col gap-3';

    for (let i = 0; i < q.choices.length; i++) {
      const btn = document.createElement('button');
      btn.className = buildChoiceClass(i, q.correctIndex, selectedAnswers[currentIndex], answered);
      btn.textContent = q.choices[i];
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
      feedback.textContent = `Jawaban benar: ${q.choices[q.correctIndex]}`;
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
