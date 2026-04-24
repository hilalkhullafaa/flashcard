/**
 * @typedef {Object} Chapter
 * @property {number} id
 * @property {string} title
 * @property {string} titleRomaji
 * @property {string} titleId
 */

/**
 * @typedef {Object} ChapterData
 * @property {Chapter} chapter
 * @property {import('./utils.js').VocabEntry[]} vocabulary
 * @property {import('./utils.js').SentencePattern[]} patterns
 * @property {import('./utils.js').QuizQuestion[]} quiz
 */

/**
 * Fetch daftar semua bab dari data/chapters.json.
 * @returns {Promise<Chapter[]|null>} Array Chapter, atau null jika gagal.
 */
async function fetchChapters() {
  try {
    const response = await fetch('data/chapters.json');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Fetch data lengkap satu bab dari data/ch{id}.json.
 * @param {number} chapterId - Nomor bab (1–25)
 * @returns {Promise<ChapterData|null>} ChapterData, atau null jika gagal.
 */
async function fetchChapterData(chapterId) {
  try {
    const padded = String(chapterId).padStart(2, '0');
    const response = await fetch(`data/ch${padded}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Fetch data semua 25 bab secara paralel.
 * Bab yang gagal di-fetch (null) akan difilter dari hasil.
 *
 * @returns {Promise<ChapterData[]>} Array ChapterData dari bab yang berhasil di-fetch
 */
async function fetchAllChaptersData() {
  const results = await Promise.all(
    Array.from({ length: 25 }, (_, i) => fetchChapterData(i + 1))
  );
  return results.filter(data => data !== null);
}

export { fetchChapters, fetchChapterData, fetchAllChaptersData };
