import { fetchChapterData } from '../data.js';
import { renderKotoba } from '../modules/kotoba.js';
import { renderPattern } from '../modules/pattern.js';
import { renderGrammar } from '../modules/grammar.js';
import { renderFlashcard } from '../modules/flashcard.js';
import { renderQuiz } from '../modules/quiz.js';

/**
 * Konfigurasi tab: key, label, dan fungsi render modul.
 * @type {Array<{key: string, label: string, render: Function}>}
 */
const TABS = [
  { key: 'kotoba',   label: 'Kotoba',        render: renderKotoba   },
  { key: 'pola',     label: 'Pola Kalimat',  render: renderPattern  },
  { key: 'materi',   label: 'Materi',        render: renderGrammar  },
  { key: 'flashcard',label: 'Flashcard',     render: renderFlashcard},
  { key: 'kuis',     label: 'Kuis',          render: renderQuiz     },
];

/**
 * Render halaman detail bab dengan tab navigasi dan konten modul aktif.
 *
 * @param {HTMLElement} container - Elemen DOM tempat halaman dirender
 * @param {number} chapterId - Nomor bab (1–25)
 * @param {string|null} activeTab - Tab aktif awal (key tab), default "kotoba"
 */
async function renderChapterDetail(container, chapterId, activeTab) {
  // Validasi chapterId
  if (!chapterId || chapterId < 1 || chapterId > 25) {
    window.location.hash = '#/';
    return;
  }

  const currentTab = TABS.find(t => t.key === activeTab) ? activeTab : 'kotoba';

  container.innerHTML = '';

  // ── Sticky header ────────────────────────────────────────────────────────
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-20 bg-red-600 text-white shadow-md';
  header.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
      <button
        id="back-btn"
        type="button"
        class="flex items-center gap-1 text-red-100 hover:text-white text-sm font-medium transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-white rounded"
        aria-label="Kembali ke Daftar Bab"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden sm:inline">Kembali ke Daftar Bab</span>
      </button>
      <div id="chapter-title" class="flex-1 min-w-0">
        <div class="h-5 w-48 bg-red-500 rounded animate-pulse"></div>
      </div>
    </div>
  `;
  container.appendChild(header);

  header.querySelector('#back-btn').addEventListener('click', () => {
    window.location.hash = '#/';
  });

  // ── Tab bar ──────────────────────────────────────────────────────────────
  const tabBar = document.createElement('nav');
  tabBar.className = 'sticky top-[52px] z-10 bg-white border-b border-gray-200 shadow-sm';
  tabBar.setAttribute('aria-label', 'Navigasi modul bab');

  const tabList = document.createElement('div');
  tabList.className = 'max-w-5xl mx-auto px-4 flex overflow-x-auto scrollbar-hide';

  const tabButtons = {};

  for (const tab of TABS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.tabKey = tab.key;
    btn.textContent = tab.label;
    btn.className = buildTabClass(tab.key === currentTab);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', tab.key === currentTab ? 'true' : 'false');
    tabList.appendChild(btn);
    tabButtons[tab.key] = btn;
  }

  tabBar.appendChild(tabList);
  container.appendChild(tabBar);

  // ── Content area ─────────────────────────────────────────────────────────
  const contentArea = document.createElement('main');
  contentArea.className = 'max-w-5xl mx-auto px-4 py-6';
  container.appendChild(contentArea);

  // ── Loading state ─────────────────────────────────────────────────────────
  showLoading(contentArea);

  // ── Fetch chapter data ────────────────────────────────────────────────────
  const chapterData = await fetchChapterData(chapterId);

  if (!chapterData) {
    showError(contentArea, () => renderChapterDetail(container, chapterId, activeTab));
    return;
  }

  // Update chapter title in header
  const titleEl = header.querySelector('#chapter-title');
  titleEl.innerHTML = `
    <p class="text-xs text-red-200 font-medium">Bab ${chapterData.chapter.id}</p>
    <h1 class="text-base sm:text-lg font-bold leading-tight truncate">${chapterData.chapter.title}</h1>
  `;

  // ── Tab switching logic ───────────────────────────────────────────────────
  let activeTabKey = currentTab;

  function activateTab(key) {
    // Update button classes
    for (const tab of TABS) {
      const btn = tabButtons[tab.key];
      const isActive = tab.key === key;
      btn.className = buildTabClass(isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }

    activeTabKey = key;

    // Update URL hash without triggering full re-render
    const newHash = `#/chapter/${chapterId}/${key}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }

    // Render module content
    const tab = TABS.find(t => t.key === key);
    contentArea.innerHTML = '';
    tab.render(contentArea, chapterData);
  }

  // Attach click listeners to tabs
  for (const tab of TABS) {
    tabButtons[tab.key].addEventListener('click', () => activateTab(tab.key));
  }

  // Render initial tab
  activateTab(activeTabKey);
}

/**
 * Kembalikan class Tailwind untuk tombol tab.
 *
 * @param {boolean} isActive
 * @returns {string}
 */
function buildTabClass(isActive) {
  const base = [
    'shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-400',
    'whitespace-nowrap',
  ].join(' ');

  if (isActive) {
    return `${base} border-red-600 text-red-600`;
  }
  return `${base} border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300`;
}

/**
 * Tampilkan indikator loading di dalam container.
 *
 * @param {HTMLElement} container
 */
function showLoading(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-gray-500">
      <svg class="animate-spin h-8 w-8 mb-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <p>Memuat data bab...</p>
    </div>
  `;
}

/**
 * Tampilkan pesan error dengan tombol "Coba Lagi".
 *
 * @param {HTMLElement} container
 * @param {Function} onRetry - Callback saat tombol "Coba Lagi" diklik
 */
function showError(container, onRetry) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-base font-medium mb-4">Gagal memuat data bab.</p>
      <button
        id="retry-btn"
        class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        Coba Lagi
      </button>
    </div>
  `;
  container.querySelector('#retry-btn').addEventListener('click', onRetry);
}

export { renderChapterDetail };
