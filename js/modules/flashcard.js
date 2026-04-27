import { shuffleArray, getNextIndex, getPrevIndex } from '../utils.js';
import { progressTracker } from './progress.js';

function renderFlashcard(container, chapterData, options = {}) {
  container.innerHTML = '';

  // Handle missing or invalid chapter data
  if (!chapterData || typeof chapterData !== 'object') {
    console.error('Invalid chapter data provided to renderFlashcard');
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Gagal memuat data kosakata.</p>`;
    return;
  }

  const vocabulary = chapterData?.vocabulary;
  
  // Validate vocabulary array
  if (!Array.isArray(vocabulary)) {
    console.error('Invalid vocabulary data: not an array', vocabulary);
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data kosakata tidak valid.</p>`;
    return;
  }
  
  if (vocabulary.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Kosakata untuk bab ini belum tersedia.</p>`;
    return;
  }

  // ── Mode handling with persistence ────────────────────────────────────────
  const chapterId = chapterData?.chapter?.id;
  const storageKey = `mnn_flashcard_mode_ch${chapterId}`;
  
  // Load persisted mode or use provided mode or default to 'all'
  let mode = options.mode;
  if (!mode && chapterId) {
    try {
      const savedMode = localStorage.getItem(storageKey);
      mode = savedMode || 'all';
    } catch (e) {
      console.warn('Failed to load flashcard mode from localStorage:', e);
      mode = 'all';
    }
  } else if (!mode) {
    mode = 'all';
  }
  
  // Filter vocabulary based on mode
  const allVocabulary = [...vocabulary].sort((a, b) => a.order - b.order);
  const kanjiVocabulary = allVocabulary.filter(v => v.kanji && v.kanji !== '');
  
  // Check for empty kanji vocabulary
  if (mode === 'kanji' && kanjiVocabulary.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center gap-4 py-12">
        <p class="text-slate-500 text-center text-sm">Tidak ada kosakata kanji di bab ini.</p>
        <button id="switchToAllMode" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          Lihat Semua Kosakata
        </button>
      </div>
    `;
    const switchBtn = container.querySelector('#switchToAllMode');
    switchBtn.addEventListener('click', () => {
      renderFlashcard(container, chapterData, { mode: 'all' });
    });
    return;
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let cards = mode === 'kanji' ? kanjiVocabulary : allVocabulary;
  let currentIndex = 0;
  let isFlipped = false;
  // remembered: Set of vocab IDs yang sudah ditandai "Sudah Ingat"
  const remembered = new Set();

  // ── Layout ────────────────────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center gap-4';

  // Mode selector toggle
  const modeSelector = document.createElement('div');
  modeSelector.className = 'flex gap-2 w-full max-w-sm';
  modeSelector.setAttribute('role', 'group');
  modeSelector.setAttribute('aria-label', 'Pilihan mode flashcard');
  
  const btnAllMode = document.createElement('button');
  btnAllMode.className = mode === 'all'
    ? 'flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium transition-colors'
    : 'flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors';
  btnAllMode.textContent = 'Semua Kosakata';
  btnAllMode.setAttribute('aria-label', 'Mode semua kosakata');
  btnAllMode.setAttribute('aria-pressed', mode === 'all' ? 'true' : 'false');
  
  const btnKanjiMode = document.createElement('button');
  btnKanjiMode.className = mode === 'kanji'
    ? 'flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium transition-colors'
    : 'flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors';
  btnKanjiMode.textContent = 'Kanji Saja';
  btnKanjiMode.setAttribute('aria-label', 'Mode kanji saja');
  btnKanjiMode.setAttribute('aria-pressed', mode === 'kanji' ? 'true' : 'false');
  
  modeSelector.appendChild(btnAllMode);
  modeSelector.appendChild(btnKanjiMode);
  wrapper.appendChild(modeSelector);

  // Progress bar area
  const progressArea = document.createElement('div');
  progressArea.className = 'w-full max-w-sm';
  progressArea.setAttribute('role', 'status');
  progressArea.setAttribute('aria-live', 'polite');
  progressArea.setAttribute('aria-label', 'Progress hafalan kosakata');
  wrapper.appendChild(progressArea);

  // Card
  const cardEl = document.createElement('div');
  cardEl.className = [
    'w-full max-w-sm min-h-52 rounded-2xl border border-slate-600',
    'bg-slate-800 flex flex-col items-center justify-center gap-3 p-8',
    'cursor-pointer select-none transition-all duration-200 active:scale-95',
  ].join(' ');
  cardEl.setAttribute('role', 'button');
  cardEl.setAttribute('tabindex', '0');
  wrapper.appendChild(cardEl);

  // Indicator
  const indicator = document.createElement('p');
  indicator.className = 'text-xs text-slate-500 font-medium';
  wrapper.appendChild(indicator);

  // ── Tombol Sudah Ingat / Belum Ingat ─────────────────────────────────────
  const memoryRow = document.createElement('div');
  memoryRow.className = 'flex gap-3 w-full max-w-sm';

  const btnForget = document.createElement('button');
  btnForget.className = 'flex-1 py-2.5 rounded-xl border border-red-700 bg-red-900/30 text-red-400 text-sm font-medium hover:bg-red-900/60 transition-colors';
  btnForget.textContent = '✗ Belum Ingat';
  btnForget.setAttribute('aria-label', 'Tandai belum ingat');

  const btnRemember = document.createElement('button');
  btnRemember.className = 'flex-1 py-2.5 rounded-xl border border-green-700 bg-green-900/30 text-green-400 text-sm font-medium hover:bg-green-900/60 transition-colors';
  btnRemember.textContent = '✓ Sudah Ingat';
  btnRemember.setAttribute('aria-label', 'Tandai sudah ingat');

  memoryRow.appendChild(btnForget);
  memoryRow.appendChild(btnRemember);
  wrapper.appendChild(memoryRow);

  // ── Tombol navigasi ───────────────────────────────────────────────────────
  const navRow = document.createElement('div');
  navRow.className = 'flex gap-2 w-full max-w-sm';

  const btnPrev = document.createElement('button');
  btnPrev.className = 'flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors';
  btnPrev.textContent = '← Sebelumnya';
  btnPrev.setAttribute('aria-label', 'Kartu sebelumnya');

  const btnNext = document.createElement('button');
  btnNext.className = 'flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors';
  btnNext.textContent = 'Berikutnya →';
  btnNext.setAttribute('aria-label', 'Kartu berikutnya');

  const btnShuffle = document.createElement('button');
  btnShuffle.className = 'px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors';
  btnShuffle.textContent = '🔀';
  btnShuffle.title = 'Acak';
  btnShuffle.setAttribute('aria-label', 'Acak urutan kartu');

  navRow.appendChild(btnPrev);
  navRow.appendChild(btnNext);
  navRow.appendChild(btnShuffle);
  wrapper.appendChild(navRow);

  container.appendChild(wrapper);

  // ── Render helpers ────────────────────────────────────────────────────────
  function updateProgress() {
    const total = cards.length;
    
    // Get overall progress from progressTracker
    const memorizedCount = mode === 'kanji' 
      ? cards.filter(v => progressTracker.isKanjiMemorized(v.id)).length
      : cards.filter(v => progressTracker.isVocabMemorized(v.id)).length;
    
    const pct = total > 0 ? Math.round((memorizedCount / total) * 100) : 0;
    
    progressArea.innerHTML = `
      <div class="flex justify-between text-xs text-slate-500 mb-1">
        <span>${memorizedCount} / ${total} Diingat</span>
        <span>${pct}%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div class="h-full bg-green-500 rounded-full transition-all duration-300" style="width:${pct}%"></div>
      </div>
    `;
    
    // Update aria-label for screen readers
    progressArea.setAttribute('aria-label', `Progress hafalan: ${memorizedCount} dari ${total} kosakata diingat, ${pct} persen`);
  }

  function updateCard() {
    const vocab = cards[currentIndex];
    const isRemembered = mode === 'kanji' 
      ? progressTracker.isKanjiMemorized(vocab.id)
      : progressTracker.isVocabMemorized(vocab.id);
    cardEl.innerHTML = '';

    // Remembered badge
    if (isRemembered) {
      const badge = document.createElement('span');
      badge.className = 'absolute top-3 right-3 text-xs bg-green-900/60 text-green-400 px-2 py-0.5 rounded-full';
      badge.textContent = '✓ Ingat';
      cardEl.style.position = 'relative';
      cardEl.appendChild(badge);
    } else {
      cardEl.style.position = 'relative';
    }

    if (!isFlipped) {
      // Front side display logic based on mode
      if (mode === 'kanji') {
        // Kanji mode: show only kanji
        const kanjiEl = document.createElement('p');
        kanjiEl.className = 'text-4xl font-bold text-white text-center';
        kanjiEl.textContent = vocab.kanji;
        cardEl.appendChild(kanjiEl);
      } else {
        // All mode: show kanji (if present) and kana
        if (vocab.kanji && vocab.kanji !== '') {
          const kanjiEl = document.createElement('p');
          kanjiEl.className = 'text-4xl font-bold text-white text-center';
          kanjiEl.textContent = vocab.kanji;
          cardEl.appendChild(kanjiEl);
        }
        const kanaEl = document.createElement('p');
        kanaEl.className = vocab.kanji && vocab.kanji !== ''
          ? 'text-lg text-slate-400 text-center'
          : 'text-4xl font-bold text-white text-center';
        kanaEl.textContent = vocab.kana;
        cardEl.appendChild(kanaEl);
      }

      const hint = document.createElement('p');
      hint.className = 'text-xs text-slate-600 mt-3';
      hint.textContent = 'Ketuk untuk melihat arti';
      cardEl.appendChild(hint);
    } else {
      // Back side: show romaji, meaning, word class for both modes
      if (mode === 'kanji') {
        // In kanji mode, also show kana on back
        const kanaEl = document.createElement('p');
        kanaEl.className = 'text-lg text-slate-400 text-center';
        kanaEl.textContent = vocab.kana;
        cardEl.appendChild(kanaEl);
      }
      
      const romajiEl = document.createElement('p');
      romajiEl.className = 'text-base text-slate-400 italic text-center';
      romajiEl.textContent = vocab.romaji;
      cardEl.appendChild(romajiEl);

      const meaningEl = document.createElement('p');
      meaningEl.className = 'text-2xl font-bold text-indigo-300 text-center';
      meaningEl.textContent = vocab.meaning;
      cardEl.appendChild(meaningEl);

      const wcEl = document.createElement('span');
      wcEl.className = 'text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full mt-1';
      wcEl.textContent = vocab.wordClass;
      cardEl.appendChild(wcEl);
    }

    indicator.textContent = `${currentIndex + 1} / ${cards.length}`;

    // Update tombol ingat
    if (isRemembered) {
      btnRemember.className = 'flex-1 py-2.5 rounded-xl border border-green-500 bg-green-800/50 text-green-300 text-sm font-medium transition-colors';
      btnRemember.textContent = '✓ Sudah Ingat';
    } else {
      btnRemember.className = 'flex-1 py-2.5 rounded-xl border border-green-700 bg-green-900/30 text-green-400 text-sm font-medium hover:bg-green-900/60 transition-colors';
      btnRemember.textContent = '✓ Sudah Ingat';
    }
  }

  // ── Event listeners ───────────────────────────────────────────────────────
  // Mode selector listeners with persistence
  btnAllMode.addEventListener('click', () => {
    if (chapterId) {
      try {
        localStorage.setItem(storageKey, 'all');
      } catch (e) {
        console.warn('Failed to save flashcard mode to localStorage:', e);
      }
    }
    renderFlashcard(container, chapterData, { mode: 'all' });
  });
  
  btnKanjiMode.addEventListener('click', () => {
    if (chapterId) {
      try {
        localStorage.setItem(storageKey, 'kanji');
      } catch (e) {
        console.warn('Failed to save flashcard mode to localStorage:', e);
      }
    }
    renderFlashcard(container, chapterData, { mode: 'kanji' });
  });
  
  cardEl.addEventListener('click', () => { isFlipped = !isFlipped; updateCard(); });
  cardEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isFlipped = !isFlipped; updateCard(); }
  });

  btnRemember.addEventListener('click', () => {
    const id = cards[currentIndex].id;
    // Mark as memorized in progressTracker
    if (mode === 'kanji') {
      progressTracker.markKanjiMemorized(id);
    } else {
      progressTracker.markVocabMemorized(id);
    }
    remembered.add(id);
    isFlipped = false;
    currentIndex = getNextIndex(currentIndex, cards.length);
    updateCard();
    updateProgress();
  });

  btnForget.addEventListener('click', () => {
    const id = cards[currentIndex].id;
    // Mark as forgotten in progressTracker
    if (mode === 'kanji') {
      progressTracker.markKanjiForgotten(id);
    } else {
      progressTracker.markVocabForgotten(id);
    }
    remembered.delete(id);
    isFlipped = false;
    currentIndex = getNextIndex(currentIndex, cards.length);
    updateCard();
    updateProgress();
  });

  btnNext.addEventListener('click', () => {
    currentIndex = getNextIndex(currentIndex, cards.length);
    isFlipped = false;
    updateCard();
  });

  btnPrev.addEventListener('click', () => {
    currentIndex = getPrevIndex(currentIndex, cards.length);
    isFlipped = false;
    updateCard();
  });

  btnShuffle.addEventListener('click', () => {
    cards = shuffleArray(cards);
    currentIndex = 0;
    isFlipped = false;
    updateCard();
  });

  // Keyboard navigation support
  document.addEventListener('keydown', handleKeyboardNav);
  
  function handleKeyboardNav(e) {
    // Only handle if flashcard is visible
    if (!container.contains(cardEl)) {
      document.removeEventListener('keydown', handleKeyboardNav);
      return;
    }
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        btnPrev.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        btnNext.click();
        break;
      case 'r':
      case 'R':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          btnRemember.click();
        }
        break;
      case 'f':
      case 'F':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          btnForget.click();
        }
        break;
    }
  }

  // Initial render
  updateCard();
  updateProgress();
}

export { renderFlashcard };
