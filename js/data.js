import { validateChapterData } from './utils/validation.js';

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
    if (!response.ok) {
      console.error(`Failed to fetch chapters: HTTP ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    
    // Validate that data is an array
    if (!Array.isArray(data)) {
      console.error('Invalid chapters data: expected array, got', typeof data);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
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
    // Validate chapter ID
    if (typeof chapterId !== 'number' || chapterId < 1 || chapterId > 25) {
      console.error(`Invalid chapter ID: ${chapterId}. Must be a number between 1 and 25.`);
      return null;
    }
    
    const padded = String(chapterId).padStart(2, '0');
    const response = await fetch(`data/ch${padded}.json`);
    
    if (!response.ok) {
      console.error(`Failed to fetch chapter ${chapterId}: HTTP ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    // Basic validation of chapter data structure
    if (!data || typeof data !== 'object') {
      console.error(`Invalid chapter data for chapter ${chapterId}: not an object`);
      return null;
    }
    
    if (!data.chapter || typeof data.chapter !== 'object') {
      console.error(`Invalid chapter data for chapter ${chapterId}: missing chapter metadata`);
      return null;
    }
    
    // Validate chapter data using validation utility
    const validationResult = validateChapterData(data, chapterId);
    
    // Log validation errors
    if (validationResult.errors.length > 0) {
      console.error(`Validation errors for chapter ${chapterId}:`, validationResult.errors);
    }
    
    // Log validation warnings
    if (validationResult.warnings.length > 0) {
      console.warn(`Validation warnings for chapter ${chapterId}:`, validationResult.warnings);
    }
    
    // Return validated data even if warnings exist (only fail on errors)
    return data;
  } catch (error) {
    console.error(`Error fetching chapter ${chapterId}:`, error);
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
  try {
    const results = await Promise.all(
      Array.from({ length: 25 }, (_, i) => fetchChapterData(i + 1))
    );
    const validResults = results.filter(data => data !== null);
    
    if (validResults.length === 0) {
      console.error('Failed to fetch any chapter data');
    } else if (validResults.length < 25) {
      console.warn(`Only ${validResults.length} out of 25 chapters loaded successfully`);
    }
    
    return validResults;
  } catch (error) {
    console.error('Error fetching all chapters data:', error);
    return [];
  }
}

export { fetchChapters, fetchChapterData, fetchAllChaptersData };
