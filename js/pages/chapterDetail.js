import { fetchChapterData } from '../data.js';
import { renderKotoba } from '../modules/kotoba.js';
import { renderPattern } from '../modules/pattern.js';
import { renderGrammar } from '../modules/grammar.js';
import { renderFlashcard } from '../modules/flashcard.js';
import { renderQuiz } from '../modules/quiz.js';

const TABS = [
  { key: 'kotoba',    label: 'Kotoba',       render: renderKotoba    },
  { key: 'pola',      label: 'Pola Kalimat', render: renderPattern   },
  { key: 'materi',    label: 'Materi',       render: renderGrammar   },
  { key: 'flashcard', label: 'Flashcard',    render: renderFlashcard },
  { key: 'kuis',      label: 'Kuis',         render: renderQuiz      },
];

async function renderChapterDetail(container, chapterId, activeTab) {
  if (!chapterId || chapterId < 1 || chapterId > 25) {
    window.location.hash = '#/';
    return;
  }

  const currentTab = TABS.find(t => t.key === activeTab) ? activeTab : 'kotoba';
  container.innerHTML = '';

  // ── Header ────────────────────────────────────────────────────────────────
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-20 bg-slate-900 border-b border-slate-700';
  header.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
      <button id="back-btn" type="button"
        class="flex items-center gap-1 text-slate-400 hover:text-white text-sm font-medium transition-colors shrink-0 focus:outline-none"
        aria-label="Kembali">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden sm:inline text-xs">Daftar Bab</span>
      </button>
      <div id="chapter-title" class="flex-1 min-w-0">
        <div class="h-4 w-40 bg-slate-700 rounded animate-pulse"></div>
      </div>
    </div>
  `;
  container.appendChild(header);
  header.querySelector('#back-btn').addEventListener('click', () => { window.location.hash = '#/'; });

  // ── Tab bar ───────────────────────────────────────────────────────────────
  const tabBar = document.createElement('nav');
  tabBar.className = 'sticky top-[52px] z-10 bg-slate-900 border-b border-slate-700';

  const tabList = document.createElement('div');
  tabList.className = 'max-w-2xl mx-auto px-4 flex overflow-x-auto scrollbar-hide';

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

  // ── Content area ──────────────────────────────────────────────────────────
  const contentArea = document.createElement('main');
  contentArea.className = 'max-w-2xl mx-auto px-4 py-5';
  container.appendChild(contentArea);

  showLoading(contentArea);

  const chapterData = await fetchChapterData(chapterId);
  if (!chapterData) {
    showError(contentArea, () => renderChapterDetail(container, chapterId, activeTab));
    return;
  }

  // Update title
  header.querySelector('#chapter-title').innerHTML = `
    <p class="text-xs text-slate-500">Bab ${chapterData.chapter.id}</p>
    <h1 class="text-sm font-bold text-white truncate">${chapterData.chapter.title}</h1>
  `;

  // ── Tab switching ─────────────────────────────────────────────────────────
  function activateTab(key) {
    for (const tab of TABS) {
      const btn = tabButtons[tab.key];
      const isActive = tab.key === key;
      btn.className = buildTabClass(isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
    const newHash = `#/chapter/${chapterId}/${key}`;
    if (window.location.hash !== newHash) history.replaceState(null, '', newHash);
    const tab = TABS.find(t => t.key === key);
    contentArea.innerHTML = '';
    tab.render(contentArea, chapterData);
  }

  for (const tab of TABS) {
    tabButtons[tab.key].addEventListener('click', () => activateTab(tab.key));
  }

  activateTab(currentTab);
}

function buildTabClass(isActive) {
  const base = 'shrink-0 px-4 py-3 text-xs font-medium border-b-2 transition-colors duration-150 focus:outline-none whitespace-nowrap';
  return isActive
    ? `${base} border-indigo-500 text-indigo-400`
    : `${base} border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600`;
}

function showLoading(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-slate-500">
      <svg class="animate-spin h-7 w-7 mb-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <p class="text-sm">Memuat data bab...</p>
    </div>
  `;
}

function showError(container, onRetry) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 text-slate-500">
      <p class="text-sm font-medium mb-4">Gagal memuat data bab.</p>
      <button id="retry-btn" class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
        Coba Lagi
      </button>
    </div>
  `;
  container.querySelector('#retry-btn').addEventListener('click', onRetry);
}

export { renderChapterDetail };
