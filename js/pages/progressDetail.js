import { progressTracker } from '../modules/progress.js';

/**
 * Render progress detail page with memorized vocabulary and kanji lists
 * @param {HTMLElement} container - Container element
 * @param {Array} allChaptersData - All chapters data
 */
async function renderProgressDetail(container, allChaptersData) {
  container.innerHTML = '';

  // ── Header ────────────────────────────────────────────────────────────────
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-20 bg-slate-900 border-b border-slate-700';
  header.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
      <button id="back-btn" type="button"
        class="flex items-center gap-1 text-slate-400 hover:text-white text-sm font-medium transition-colors shrink-0 focus:outline-none"
        aria-label="Kembali ke Beranda">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="text-xs">Kembali</span>
      </button>
      <div class="flex-1 min-w-0">
        <h1 class="text-sm font-bold text-white">Detail Progress</h1>
      </div>
    </div>
  `;
  container.appendChild(header);
  header.querySelector('#back-btn').addEventListener('click', () => { window.location.hash = '#/'; });

  // ── Main content ──────────────────────────────────────────────────────────
  const main = document.createElement('main');
  main.className = 'max-w-2xl mx-auto px-4 py-5';
  container.appendChild(main);

  // Check if localStorage is available
  if (!progressTracker.storageAvailable) {
    const warningBanner = document.createElement('div');
    warningBanner.className = 'mb-5 bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-xl text-sm';
    warningBanner.innerHTML = `
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <p class="flex-1">Penyimpanan tidak tersedia. Progress tidak akan tersimpan setelah menutup halaman.</p>
      </div>
    `;
    main.appendChild(warningBanner);
  }

  // ── Progress Statistics ───────────────────────────────────────────────────
  const statsSection = document.createElement('div');
  statsSection.id = 'progress-stats';
  statsSection.className = 'mb-5';
  main.appendChild(statsSection);
  renderProgressStats(statsSection, allChaptersData);

  // ── Vocabulary List Section ───────────────────────────────────────────────
  const vocabSection = document.createElement('div');
  vocabSection.id = 'vocab-section';
  vocabSection.className = 'mb-5';
  main.appendChild(vocabSection);

  // ── Kanji List Section ────────────────────────────────────────────────────
  const kanjiSection = document.createElement('div');
  kanjiSection.id = 'kanji-section';
  kanjiSection.className = 'mb-5';
  main.appendChild(kanjiSection);

  // Render lists
  renderVocabList(vocabSection, allChaptersData);
  renderKanjiList(kanjiSection, allChaptersData);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = document.createElement('footer');
  footer.className = 'mt-10 py-4 text-center text-xs text-slate-600 border-t border-slate-800';
  footer.innerHTML = `&copy; ${new Date().getFullYear()} HILKA. All rights reserved.`;
  container.appendChild(footer);
}

/**
 * Render progress statistics section
 * @param {HTMLElement} container - Container element
 * @param {Array} allChaptersData - All chapters data
 */
function renderProgressStats(container, allChaptersData) {
  try {
    if (!Array.isArray(allChaptersData) || allChaptersData.length === 0) {
      container.innerHTML = '';
      return;
    }

    const stats = progressTracker.getStats(allChaptersData);

    container.innerHTML = `
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <h2 class="text-sm font-bold text-white mb-4">Progress Keseluruhan</h2>
        
        <!-- Vocabulary Progress -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-300">Kosakata</span>
            <span class="text-xs font-semibold text-slate-300">${stats.vocab.memorized} / ${stats.vocab.total} (${stats.vocab.percentage}%)</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div class="bg-green-500 h-full rounded-full transition-all duration-300" style="width: ${stats.vocab.percentage}%"></div>
          </div>
        </div>

        <!-- Kanji Progress -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-300">Kanji</span>
            <span class="text-xs font-semibold text-slate-300">${stats.kanji.memorized} / ${stats.kanji.total} (${stats.kanji.percentage}%)</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div class="bg-green-500 h-full rounded-full transition-all duration-300" style="width: ${stats.kanji.percentage}%"></div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error rendering progress stats:', error);
    container.innerHTML = '';
  }
}

/**
 * Render vocabulary list section
 * @param {HTMLElement} container - Container element
 * @param {Array} allChaptersData - All chapters data
 */
function renderVocabList(container, allChaptersData) {
  container.innerHTML = '';

  // Section header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-3';
  header.innerHTML = `
    <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Kosakata yang Dihafal</h2>
  `;
  container.appendChild(header);

  // Get memorized vocabulary list
  const vocabList = progressTracker.getMemorizedVocabList();

  // Empty state
  if (vocabList.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'bg-slate-800 border border-slate-700 rounded-xl p-8 text-center';
    emptyState.innerHTML = `
      <svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-sm text-slate-400 mb-2">Belum ada kosakata yang dihafal</p>
      <p class="text-xs text-slate-500">Mulai belajar dengan mode Flashcard untuk menghafal kosakata</p>
    `;
    container.appendChild(emptyState);
    return;
  }

  // Add count badge to header
  const countBadge = document.createElement('span');
  countBadge.className = 'bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full font-semibold';
  countBadge.textContent = vocabList.length;
  header.appendChild(countBadge);

  // Render vocabulary items
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-2';

  for (const vocab of vocabList) {
    const item = createVocabItem(vocab, allChaptersData);
    list.appendChild(item);
  }

  container.appendChild(list);
}

/**
 * Create vocabulary item element
 * @param {Object} vocab - Vocabulary item
 * @param {Array} allChaptersData - All chapters data
 * @returns {HTMLElement} Vocabulary item element
 */
function createVocabItem(vocab, allChaptersData) {
  const item = document.createElement('div');
  item.className = 'flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl transition-all';
  item.dataset.vocabId = vocab.id;

  const jp = vocab.kanji ? `${vocab.kanji}（${vocab.kana}）` : vocab.kana;

  item.innerHTML = `
    <span class="shrink-0 w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold text-xs">
      ${vocab.chapterId}
    </span>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-white">${jp}</p>
      <p class="text-xs text-slate-400">${vocab.romaji} — ${vocab.meaning}</p>
    </div>
    <button type="button" class="delete-vocab-btn shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Hapus ${jp}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  `;

  // Add delete handler
  const deleteBtn = item.querySelector('.delete-vocab-btn');
  deleteBtn.addEventListener('click', () => handleVocabDelete(vocab.id, item, allChaptersData));

  return item;
}

/**
 * Handle vocabulary delete action
 * @param {string} vocabId - Vocabulary ID
 * @param {HTMLElement} itemElement - Item DOM element
 * @param {Array} allChaptersData - All chapters data
 */
function handleVocabDelete(vocabId, itemElement, allChaptersData) {
  const deleteBtn = itemElement.querySelector('.delete-vocab-btn');
  
  // Disable button and show loading state
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = `
    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
  `;

  // Perform deletion
  const success = progressTracker.deleteMemorizedVocab(vocabId);

  if (success) {
    // Show success feedback with fade-out animation
    itemElement.style.opacity = '0';
    itemElement.style.transform = 'translateX(-10px)';
    itemElement.style.transition = 'opacity 300ms, transform 300ms';

    setTimeout(() => {
      itemElement.remove();
      
      // Update statistics
      const statsSection = document.getElementById('progress-stats');
      if (statsSection) {
        renderProgressStats(statsSection, allChaptersData);
      }

      // Check if list is now empty and re-render if needed
      const vocabSection = document.getElementById('vocab-section');
      const remainingItems = vocabSection.querySelectorAll('[data-vocab-id]');
      if (remainingItems.length === 0) {
        renderVocabList(vocabSection, allChaptersData);
      } else {
        // Update count badge
        const countBadge = vocabSection.querySelector('.bg-slate-700');
        if (countBadge) {
          countBadge.textContent = remainingItems.length;
        }
      }

      // Show success toast
      showToast('Kosakata berhasil dihapus', 'success');
    }, 300);
  } else {
    // Show error feedback
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    showToast('Gagal menghapus kosakata. Silakan coba lagi.', 'error');
  }
}

/**
 * Render kanji list section
 * @param {HTMLElement} container - Container element
 * @param {Array} allChaptersData - All chapters data
 */
function renderKanjiList(container, allChaptersData) {
  container.innerHTML = '';

  // Section header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-3';
  header.innerHTML = `
    <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Kanji yang Dihafal</h2>
  `;
  container.appendChild(header);

  // Get memorized kanji list
  const kanjiList = progressTracker.getMemorizedKanjiList();

  // Empty state
  if (kanjiList.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'bg-slate-800 border border-slate-700 rounded-xl p-8 text-center';
    emptyState.innerHTML = `
      <svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-slate-400 mb-2">Belum ada kanji yang dihafal</p>
      <p class="text-xs text-slate-500">Mulai belajar dengan mode Flashcard untuk menghafal kanji</p>
    `;
    container.appendChild(emptyState);
    return;
  }

  // Add count badge to header
  const countBadge = document.createElement('span');
  countBadge.className = 'bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full font-semibold';
  countBadge.textContent = kanjiList.length;
  header.appendChild(countBadge);

  // Render kanji items
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-2';

  for (const kanji of kanjiList) {
    const item = createKanjiItem(kanji, allChaptersData);
    list.appendChild(item);
  }

  container.appendChild(list);
}

/**
 * Create kanji item element
 * @param {Object} kanji - Kanji item
 * @param {Array} allChaptersData - All chapters data
 * @returns {HTMLElement} Kanji item element
 */
function createKanjiItem(kanji, allChaptersData) {
  const item = document.createElement('div');
  item.className = 'flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl transition-all';
  item.dataset.kanjiText = kanji.kanjiText;

  item.innerHTML = `
    <span class="shrink-0 w-8 h-8 rounded-lg bg-purple-900 flex items-center justify-center text-purple-300 font-bold text-xs">
      ${kanji.chapterId}
    </span>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-white">${kanji.kanjiText}（${kanji.vocab.kana}）</p>
      <p class="text-xs text-slate-400">${kanji.vocab.romaji} — ${kanji.vocab.meaning}</p>
    </div>
    <button type="button" class="delete-kanji-btn shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Hapus ${kanji.kanjiText}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  `;

  // Add delete handler
  const deleteBtn = item.querySelector('.delete-kanji-btn');
  deleteBtn.addEventListener('click', () => handleKanjiDelete(kanji.kanjiText, item, allChaptersData));

  return item;
}

/**
 * Handle kanji delete action
 * @param {string} kanjiText - Kanji text
 * @param {HTMLElement} itemElement - Item DOM element
 * @param {Array} allChaptersData - All chapters data
 */
function handleKanjiDelete(kanjiText, itemElement, allChaptersData) {
  const deleteBtn = itemElement.querySelector('.delete-kanji-btn');
  
  // Disable button and show loading state
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = `
    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
  `;

  // Perform deletion
  const success = progressTracker.deleteMemorizedKanji(kanjiText);

  if (success) {
    // Show success feedback with fade-out animation
    itemElement.style.opacity = '0';
    itemElement.style.transform = 'translateX(-10px)';
    itemElement.style.transition = 'opacity 300ms, transform 300ms';

    setTimeout(() => {
      itemElement.remove();
      
      // Update statistics
      const statsSection = document.getElementById('progress-stats');
      if (statsSection) {
        renderProgressStats(statsSection, allChaptersData);
      }

      // Check if list is now empty and re-render if needed
      const kanjiSection = document.getElementById('kanji-section');
      const remainingItems = kanjiSection.querySelectorAll('[data-kanji-text]');
      if (remainingItems.length === 0) {
        renderKanjiList(kanjiSection, allChaptersData);
      } else {
        // Update count badge
        const countBadge = kanjiSection.querySelector('.bg-slate-700');
        if (countBadge) {
          countBadge.textContent = remainingItems.length;
        }
      }

      // Show success toast
      showToast('Kanji berhasil dihapus', 'success');
    }, 300);
  } else {
    // Show error feedback
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    showToast('Gagal menghapus kanji. Silakan coba lagi.', 'error');
  }
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type ('success' or 'error')
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-900/90 border-green-700 text-green-200' : 'bg-red-900/90 border-red-700 text-red-200';
  const icon = type === 'success' 
    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';

  toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} border px-4 py-3 rounded-lg shadow-lg max-w-md text-sm flex items-center gap-3 animate-fade-in`;
  toast.innerHTML = `
    <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      ${icon}
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -10px)';
    toast.style.transition = 'opacity 300ms, transform 300ms';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export { renderProgressDetail };
