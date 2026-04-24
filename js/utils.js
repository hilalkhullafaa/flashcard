/**
 * Mengacak array menggunakan algoritma Fisher-Yates.
 * Mengembalikan array baru tanpa memodifikasi array asli.
 *
 * @template T
 * @param {T[]} arr - Array yang akan diacak
 * @returns {T[]} Array baru dengan urutan elemen yang diacak
 */
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Menghitung hasil kuis berdasarkan pertanyaan dan jawaban yang dipilih.
 *
 * @param {import('./data.js').QuizQuestion[]} questions - Array soal kuis
 * @param {(number|null)[]} selectedAnswers - Jawaban pengguna per soal (indeks pilihan atau null)
 * @returns {{ correctCount: number, totalQuestions: number, percentage: number }}
 */
function calculateQuizResult(questions, selectedAnswers) {
  const totalQuestions = questions.length;
  let correctCount = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (selectedAnswers[i] === questions[i].correctIndex) {
      correctCount++;
    }
  }
  const percentage = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
  return { correctCount, totalQuestions, percentage };
}

/**
 * Mengembalikan indeks berikutnya secara siklik.
 * Dari indeks terakhir (total - 1) kembali ke 0.
 *
 * @param {number} currentIndex - Indeks saat ini
 * @param {number} total - Jumlah total elemen
 * @returns {number} Indeks berikutnya
 */
function getNextIndex(currentIndex, total) {
  return (currentIndex + 1) % total;
}

/**
 * Mengembalikan indeks sebelumnya secara siklik.
 * Dari indeks 0 kembali ke indeks terakhir (total - 1).
 *
 * @param {number} currentIndex - Indeks saat ini
 * @param {number} total - Jumlah total elemen
 * @returns {number} Indeks sebelumnya
 */
function getPrevIndex(currentIndex, total) {
  return (currentIndex - 1 + total) % total;
}

/**
 * Mencari kosakata dan pola kalimat dari semua bab berdasarkan kata kunci.
 * Pencarian bersifat case-insensitive.
 *
 * @typedef {Object} SearchResult
 * @property {'vocab'|'pattern'} type
 * @property {number} chapterId
 * @property {import('./data.js').VocabEntry|import('./data.js').SentencePattern} item
 */

/**
 * @param {import('./data.js').ChapterData[]} allChaptersData - Data semua bab
 * @param {string} query - Kata kunci pencarian
 * @returns {SearchResult[]} Array hasil pencarian
 */
function searchVocabAndPatterns(allChaptersData, query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results = [];
  for (const chapterData of allChaptersData) {
    const chapterId = chapterData.chapter.id;
    for (const item of (chapterData.vocabulary || [])) {
      if (
        (item.kanji && item.kanji.toLowerCase().includes(q)) ||
        (item.kana && item.kana.toLowerCase().includes(q)) ||
        (item.romaji && item.romaji.toLowerCase().includes(q)) ||
        (item.meaning && item.meaning.toLowerCase().includes(q))
      ) {
        results.push({ type: 'vocab', chapterId, item });
      }
    }
    for (const item of (chapterData.patterns || [])) {
      if (
        (item.pattern && item.pattern.toLowerCase().includes(q)) ||
        (item.explanation && item.explanation.toLowerCase().includes(q))
      ) {
        results.push({ type: 'pattern', chapterId, item });
      }
    }
  }
  return results;
}

export { shuffleArray, calculateQuizResult, getNextIndex, getPrevIndex, searchVocabAndPatterns };
