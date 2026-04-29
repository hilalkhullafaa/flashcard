import { fetchChapters, fetchAllChaptersData } from '../data.js';
import { searchVocabAndPatterns } from '../utils.js';
import { progressTracker } from '../modules/progress.js';

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

async function renderChapterList(container) {
  container.innerHTML = '';

  // ── Header ────────────────────────────────────────────────────────────────
  const header = document.createElement('header');
  header.className = 'bg-slate-800 border-b border-slate-700 py-5 px-4';
  header.innerHTML = `
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-2xl font-bold text-white tracking-tight">みんなの日本語</h1>
      <p class="text-slate-400 text-sm mt-1">Flashcard Interaktif</p>
    </div>
  `;
  container.appendChild(header);

  // ── Main ──────────────────────────────────────────────────────────────────
  const main = document.createElement('main');
  main.className = 'max-w-2xl mx-auto px-4 py-5';
  container.appendChild(main);

  // ── Progress Statistics ───────────────────────────────────────────────────
  const progressSection = document.createElement('div');
  progressSection.id = 'progress-section';
  progressSection.className = 'mb-5';
  main.appendChild(progressSection);

  // ── Search ────────────────────────────────────────────────────────────────
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'mb-5';
  searchWrapper.innerHTML = `
    <div class="relative">
      <span class="absolute inset-y-0 left-3 flex items-center text-slate-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input id="search-input" type="search" placeholder="Cari kosakata atau pola kalimat..."
        class="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        autocomplete="off" />
    </div>
  `;
  main.appendChild(searchWrapper);

  // ── Search results area ───────────────────────────────────────────────────
  const searchResultsArea = document.createElement('div');
  searchResultsArea.id = 'search-results-area';
  searchResultsArea.className = 'hidden';
  main.appendChild(searchResultsArea);

  // ── Chapter list area ─────────────────────────────────────────────────────
  const chapterListArea = document.createElement('div');
  chapterListArea.id = 'chapter-list-area';
  main.appendChild(chapterListArea);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = document.createElement('footer');
  footer.className = 'mt-10 py-4 text-center text-xs text-slate-600 border-t border-slate-800';
  footer.innerHTML = `&copy; ${new Date().getFullYear()} HILKA. All rights reserved.`;
  container.appendChild(footer);

  // ── Loading ───────────────────────────────────────────────────────────────
  chapterListArea.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-slate-500">
      <svg class="animate-spin h-7 w-7 mb-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <p class="text-sm">Memuat daftar bab...</p>
    </div>
  `;

  const chapters = await fetchChapters();
  if (!chapters) { renderChapterError(chapterListArea, container); return; }

  // Fetch all chapters data and render progress statistics
  const allChaptersData = await fetchAllChaptersData();
  
  // Set chapters data in progress tracker for kanji text lookup
  progressTracker.setChaptersData(allChaptersData);
  
  renderProgressStats(progressSection, allChaptersData);

  renderChapterCards(chapterListArea, chapters);

  // ── Search logic ──────────────────────────────────────────────────────────
  const searchInput = container.querySelector('#search-input');
  const handleSearch = debounce(async (query) => {
    if (!query.trim()) {
      searchResultsArea.classList.add('hidden');
      searchResultsArea.innerHTML = '';
      chapterListArea.classList.remove('hidden');
      return;
    }
    chapterListArea.classList.add('hidden');
    searchResultsArea.classList.remove('hidden');
    searchResultsArea.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-slate-500">
        <svg class="animate-spin h-6 w-6 mb-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="text-sm">Mencari...</p>
      </div>
    `;
    const allData = await fetchAllChaptersData();
    const results = searchVocabAndPatterns(allData, query);
    renderSearchResults(searchResultsArea, results, query);
  }, 300);

  searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
}

function renderProgressStats(container, allChaptersData) {
  try {
    // Validate input
    if (!Array.isArray(allChaptersData)) {
      console.error('Invalid allChaptersData: not an array', allChaptersData);
      container.innerHTML = '';
      return;
    }

    if (allChaptersData.length === 0) {
      console.warn('No chapter data available for progress statistics');
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
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-300">Kanji</span>
            <span class="text-xs font-semibold text-slate-300">${stats.kanji.memorized} / ${stats.kanji.total} (${stats.kanji.percentage}%)</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div class="bg-green-500 h-full rounded-full transition-all duration-300" style="width: ${stats.kanji.percentage}%"></div>
          </div>
        </div>

        <!-- View Details Button -->
        <button id="view-progress-details-btn" type="button" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Lihat Detail Progress
        </button>
      </div>
    `;

    // Add click handler for view details button
    const viewDetailsBtn = container.querySelector('#view-progress-details-btn');
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', () => {
        window.location.hash = '#/progress';
      });
    }
  } catch (error) {
    console.error('Error rendering progress stats:', error);
    container.innerHTML = '';
  }
}

function renderChapterCards(container, chapters) {
  container.innerHTML = '';

  const heading = document.createElement('p');
  heading.className = 'text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3';
  heading.textContent = 'Pilih Bab';
  container.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'flex flex-col gap-2';

  for (const chapter of chapters) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = [
      'flex items-center gap-4 w-full px-4 py-3 rounded-xl',
      'bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-750',
      'text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500',
    ].join(' ');

    btn.innerHTML = `
      <span class="shrink-0 w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
        ${chapter.id}
      </span>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate">${chapter.title}</p>
        <p class="text-xs text-slate-400 truncate">${chapter.titleId}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    `;

    btn.addEventListener('click', () => { window.location.hash = `#/chapter/${chapter.id}`; });
    list.appendChild(btn);
  }

  container.appendChild(list);
}

function renderChapterError(container, rootContainer) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-slate-500">
      <p class="text-sm font-medium mb-4">Gagal memuat daftar bab.</p>
      <button id="retry-btn" class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
        Coba Lagi
      </button>
    </div>
  `;
  container.querySelector('#retry-btn').addEventListener('click', () => renderChapterList(rootContainer));
}

function renderSearchResults(container, results, query) {
  container.innerHTML = '';

  const heading = document.createElement('p');
  heading.className = 'text-xs text-slate-500 mb-4';
  heading.textContent = `Hasil pencarian untuk "${query}"`;
  container.appendChild(heading);

  if (results.length === 0) {
    container.innerHTML += `<p class="text-center text-slate-500 py-10 text-sm">Tidak ada hasil untuk kata kunci tersebut.</p>`;
    return;
  }

  const vocabResults = results.filter(r => r.type === 'vocab');
  const patternResults = results.filter(r => r.type === 'pattern');

  if (vocabResults.length > 0) {
    container.appendChild(createSectionHeader('Kosakata', vocabResults.length));
    const list = document.createElement('div');
    list.className = 'flex flex-col gap-2 mb-5';
    for (const r of vocabResults) list.appendChild(createVocabResultCard(r));
    container.appendChild(list);
  }

  if (patternResults.length > 0) {
    container.appendChild(createSectionHeader('Pola Kalimat', patternResults.length));
    const list = document.createElement('div');
    list.className = 'flex flex-col gap-2 mb-5';
    for (const r of patternResults) list.appendChild(createPatternResultCard(r));
    container.appendChild(list);
  }
}

function createSectionHeader(title, count) {
  const el = document.createElement('div');
  el.className = 'flex items-center gap-2 mb-2';
  el.innerHTML = `
    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide">${title}</h3>
    <span class="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">${count}</span>
  `;
  return el;
}

function createVocabResultCard(result) {
  const { chapterId, item } = result;
  const vocab = item;
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'w-full flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-indigo-500 text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const jp = vocab.kanji ? `${vocab.kanji}（${vocab.kana}）` : vocab.kana;
  card.innerHTML = `
    <span class="shrink-0 w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold text-xs">${chapterId}</span>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-white">${jp}</p>
      <p class="text-xs text-slate-400">${vocab.romaji} — ${vocab.meaning}</p>
    </div>
  `;
  card.addEventListener('click', () => { window.location.hash = `#/chapter/${chapterId}/kotoba`; });
  return card;
}

function createPatternResultCard(result) {
  const { chapterId, item } = result;
  const pattern = item;
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'w-full flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-purple-500 text-left transition-all focus:outline-none focus:ring-2 focus:ring-purple-500';
  card.innerHTML = `
    <span class="shrink-0 w-8 h-8 rounded-lg bg-purple-900 flex items-center justify-center text-purple-300 font-bold text-xs">${chapterId}</span>
    <div class="min-w-0">
      <p class="text-sm font-semibold text-white">${pattern.pattern}</p>
      <p class="text-xs text-slate-400 line-clamp-2">${pattern.explanation}</p>
    </div>
  `;
  card.addEventListener('click', () => { window.location.hash = `#/chapter/${chapterId}/pola`; });
  return card;
}

export { renderChapterList };
