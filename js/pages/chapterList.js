import { fetchChapters, fetchAllChaptersData } from '../data.js';
import { searchVocabAndPatterns } from '../utils.js';

/**
 * Debounce helper — menunda eksekusi fungsi hingga setelah `delay` ms berlalu
 * sejak pemanggilan terakhir.
 *
 * @param {Function} fn
 * @param {number} delay - Delay dalam milidetik
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Render halaman daftar bab beserta kotak pencarian global.
 *
 * @param {HTMLElement} container - Elemen DOM tempat halaman dirender
 */
async function renderChapterList(container) {
  container.innerHTML = '';

  // ── Header ──────────────────────────────────────────────────────────────
  const header = document.createElement('header');
  header.className = 'bg-red-600 text-white py-6 px-4 shadow-md';
  header.innerHTML = `
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold tracking-tight">Minna no Nihongo 1 Flashcard</h1>
      <p class="text-red-100 text-sm mt-1">Belajar bahasa Jepang dari buku Minna no Nihongo 1</p>
    </div>
  `;
  container.appendChild(header);

  // ── Main wrapper ─────────────────────────────────────────────────────────
  const main = document.createElement('main');
  main.className = 'max-w-5xl mx-auto px-4 py-6';
  container.appendChild(main);

  // ── Search box ───────────────────────────────────────────────────────────
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'mb-6';
  searchWrapper.innerHTML = `
    <div class="relative">
      <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        id="search-input"
        type="search"
        placeholder="Cari kosakata atau pola kalimat..."
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-gray-800 bg-white"
        autocomplete="off"
      />
    </div>
  `;
  main.appendChild(searchWrapper);

  // ── Search results area (hidden by default) ───────────────────────────────
  const searchResultsArea = document.createElement('div');
  searchResultsArea.id = 'search-results-area';
  searchResultsArea.className = 'hidden';
  main.appendChild(searchResultsArea);

  // ── Chapter list area ─────────────────────────────────────────────────────
  const chapterListArea = document.createElement('div');
  chapterListArea.id = 'chapter-list-area';
  main.appendChild(chapterListArea);

  // ── Loading state ─────────────────────────────────────────────────────────
  chapterListArea.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <svg class="animate-spin h-8 w-8 mb-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <p>Memuat daftar bab...</p>
    </div>
  `;

  // ── Fetch chapters ────────────────────────────────────────────────────────
  const chapters = await fetchChapters();

  if (!chapters) {
    renderChapterError(chapterListArea, container);
    return;
  }

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
      <div class="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg class="animate-spin h-6 w-6 mb-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p>Mencari...</p>
      </div>
    `;

    const allData = await fetchAllChaptersData();
    const results = searchVocabAndPatterns(allData, query);

    renderSearchResults(searchResultsArea, results, query);
  }, 300);

  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });
}

/**
 * Render 25 kartu bab ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').Chapter[]} chapters
 */
function renderChapterCards(container, chapters) {
  container.innerHTML = '';

  const heading = document.createElement('h2');
  heading.className = 'text-lg font-semibold text-gray-700 mb-4';
  heading.textContent = 'Pilih Bab';
  container.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4';

  for (const chapter of chapters) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = [
      'flex flex-col items-start p-4 bg-white border border-gray-200 rounded-xl shadow-sm',
      'hover:shadow-md hover:border-red-300 hover:bg-red-50 transition-all duration-150',
      'text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400',
    ].join(' ');

    card.innerHTML = `
      <span class="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
        Bab ${chapter.id}
      </span>
      <span class="text-base font-semibold text-gray-800 leading-snug mb-1">${chapter.title}</span>
      <span class="text-xs text-gray-500 leading-snug">${chapter.titleId}</span>
    `;

    card.addEventListener('click', () => {
      window.location.hash = `#/chapter/${chapter.id}`;
    });

    grid.appendChild(card);
  }

  container.appendChild(grid);
}

/**
 * Render pesan error dengan tombol "Coba Lagi".
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} rootContainer - Container utama untuk re-render saat retry
 */
function renderChapterError(container, rootContainer) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-base font-medium mb-4">Gagal memuat daftar bab.</p>
      <button
        id="retry-btn"
        class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        Coba Lagi
      </button>
    </div>
  `;
  container.querySelector('#retry-btn').addEventListener('click', () => {
    renderChapterList(rootContainer);
  });
}

/**
 * Render hasil pencarian yang dikelompokkan menjadi "Kosakata" dan "Pola Kalimat".
 *
 * @param {HTMLElement} container
 * @param {import('../utils.js').SearchResult[]} results
 * @param {string} query
 */
function renderSearchResults(container, results, query) {
  container.innerHTML = '';

  const heading = document.createElement('p');
  heading.className = 'text-sm text-gray-500 mb-4';
  heading.textContent = `Hasil pencarian untuk "${query}"`;
  container.appendChild(heading);

  if (results.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'flex flex-col items-center justify-center py-12 text-gray-400';
    empty.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-base">Tidak ada hasil untuk kata kunci tersebut.</p>
    `;
    container.appendChild(empty);
    return;
  }

  const vocabResults = results.filter(r => r.type === 'vocab');
  const patternResults = results.filter(r => r.type === 'pattern');

  if (vocabResults.length > 0) {
    container.appendChild(createSectionHeader('Kosakata', vocabResults.length));
    const vocabList = document.createElement('div');
    vocabList.className = 'space-y-2 mb-6';
    for (const result of vocabResults) {
      vocabList.appendChild(createVocabResultCard(result));
    }
    container.appendChild(vocabList);
  }

  if (patternResults.length > 0) {
    container.appendChild(createSectionHeader('Pola Kalimat', patternResults.length));
    const patternList = document.createElement('div');
    patternList.className = 'space-y-2 mb-6';
    for (const result of patternResults) {
      patternList.appendChild(createPatternResultCard(result));
    }
    container.appendChild(patternList);
  }
}

/**
 * Buat elemen header seksi hasil pencarian.
 *
 * @param {string} title
 * @param {number} count
 * @returns {HTMLElement}
 */
function createSectionHeader(title, count) {
  const el = document.createElement('div');
  el.className = 'flex items-center gap-2 mb-3';
  el.innerHTML = `
    <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">${title}</h3>
    <span class="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">${count}</span>
  `;
  return el;
}

/**
 * Buat kartu hasil pencarian kosakata.
 *
 * @param {import('../utils.js').SearchResult} result
 * @returns {HTMLElement}
 */
function createVocabResultCard(result) {
  const { chapterId, item } = result;
  const vocab = /** @type {import('../data.js').VocabEntry} */ (item);

  const card = document.createElement('button');
  card.type = 'button';
  card.className = [
    'w-full flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg',
    'hover:border-red-300 hover:bg-red-50 transition-all duration-150',
    'text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400',
  ].join(' ');

  const japaneseText = vocab.kanji ? `${vocab.kanji}（${vocab.kana}）` : vocab.kana;

  card.innerHTML = `
    <span class="shrink-0 inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5">
      Bab ${chapterId}
    </span>
    <div class="min-w-0">
      <p class="text-base font-semibold text-gray-800">${japaneseText}</p>
      <p class="text-sm text-gray-500">${vocab.romaji} — ${vocab.meaning}</p>
    </div>
  `;

  card.addEventListener('click', () => {
    window.location.hash = `#/chapter/${chapterId}/kotoba`;
  });

  return card;
}

/**
 * Buat kartu hasil pencarian pola kalimat.
 *
 * @param {import('../utils.js').SearchResult} result
 * @returns {HTMLElement}
 */
function createPatternResultCard(result) {
  const { chapterId, item } = result;
  const pattern = /** @type {import('../data.js').SentencePattern} */ (item);

  const card = document.createElement('button');
  card.type = 'button';
  card.className = [
    'w-full flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg',
    'hover:border-blue-300 hover:bg-blue-50 transition-all duration-150',
    'text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400',
  ].join(' ');

  card.innerHTML = `
    <span class="shrink-0 inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5">
      Bab ${chapterId}
    </span>
    <div class="min-w-0">
      <p class="text-base font-semibold text-gray-800">${pattern.pattern}</p>
      <p class="text-sm text-gray-500 line-clamp-2">${pattern.explanation}</p>
    </div>
  `;

  card.addEventListener('click', () => {
    window.location.hash = `#/chapter/${chapterId}/pola`;
  });

  return card;
}

export { renderChapterList };
