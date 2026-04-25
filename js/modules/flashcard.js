import { shuffleArray, getNextIndex, getPrevIndex } from '../utils.js';

function renderFlashcard(container, chapterData) {
  container.innerHTML = '';

  const vocabulary = chapterData?.vocabulary;
  if (!vocabulary || vocabulary.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Kosakata untuk bab ini belum tersedia.</p>`;
    return;
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let cards = [...vocabulary].sort((a, b) => a.order - b.order);
  let currentIndex = 0;
  let isFlipped = false;
  // remembered: Set of vocab IDs yang sudah ditandai "Sudah Ingat"
  const remembered = new Set();

  // ── Layout ────────────────────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center gap-4';

  // Progress bar area
  const progressArea = document.createElement('div');
  progressArea.className = 'w-full max-w-sm';
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

  const btnRemember = document.createElement('button');
  btnRemember.className = 'flex-1 py-2.5 rounded-xl border border-green-700 bg-green-900/30 text-green-400 text-sm font-medium hover:bg-green-900/60 transition-colors';
  btnRemember.textContent = '✓ Sudah Ingat';

  memoryRow.appendChild(btnForget);
  memoryRow.appendChild(btnRemember);
  wrapper.appendChild(memoryRow);

  // ── Tombol navigasi ───────────────────────────────────────────────────────
  const navRow = document.createElement('div');
  navRow.className = 'flex gap-2 w-full max-w-sm';

  const btnPrev = document.createElement('button');
  btnPrev.className = 'flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors';
  btnPrev.textContent = '← Sebelumnya';

  const btnNext = document.createElement('button');
  btnNext.className = 'flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors';
  btnNext.textContent = 'Berikutnya →';

  const btnShuffle = document.createElement('button');
  btnShuffle.className = 'px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors';
  btnShuffle.textContent = '🔀';
  btnShuffle.title = 'Acak';

  navRow.appendChild(btnPrev);
  navRow.appendChild(btnNext);
  navRow.appendChild(btnShuffle);
  wrapper.appendChild(navRow);

  container.appendChild(wrapper);

  // ── Render helpers ────────────────────────────────────────────────────────
  function updateProgress() {
    const total = cards.length;
    const done = remembered.size;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    progressArea.innerHTML = `
      <div class="flex justify-between text-xs text-slate-500 mb-1">
        <span>${done} / ${total} Diingat</span>
        <span>${pct}%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div class="h-full bg-green-500 rounded-full transition-all duration-300" style="width:${pct}%"></div>
      </div>
    `;
  }

  function updateCard() {
    const vocab = cards[currentIndex];
    const isRemembered = remembered.has(vocab.id);
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

      const hint = document.createElement('p');
      hint.className = 'text-xs text-slate-600 mt-3';
      hint.textContent = 'Ketuk untuk melihat arti';
      cardEl.appendChild(hint);
    } else {
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
  cardEl.addEventListener('click', () => { isFlipped = !isFlipped; updateCard(); });
  cardEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isFlipped = !isFlipped; updateCard(); }
  });

  btnRemember.addEventListener('click', () => {
    const id = cards[currentIndex].id;
    remembered.add(id);
    isFlipped = false;
    currentIndex = getNextIndex(currentIndex, cards.length);
    updateCard();
    updateProgress();
  });

  btnForget.addEventListener('click', () => {
    const id = cards[currentIndex].id;
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

  // Initial render
  updateCard();
  updateProgress();
}

export { renderFlashcard };
