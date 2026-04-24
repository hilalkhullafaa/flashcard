/**
 * Modul Flashcard — kartu bolak-balik interaktif untuk menghafal kosakata.
 */

import { shuffleArray, getNextIndex, getPrevIndex } from '../utils.js';

/**
 * Render modul flashcard ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderFlashcard(container, chapterData) {
  container.innerHTML = '';

  const vocabulary = chapterData?.vocabulary;

  if (!vocabulary || vocabulary.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Kosakata untuk bab ini belum tersedia.</p>
    `;
    return;
  }

  // Local state
  let cards = [...vocabulary].sort((a, b) => a.order - b.order);
  let currentIndex = 0;
  let isFlipped = false;

  // ── Build UI ──────────────────────────────────────────────────────────────

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-center gap-6';

  // Card
  const cardEl = document.createElement('div');
  cardEl.className = [
    'w-full max-w-sm min-h-48 rounded-2xl border-2 border-gray-200 shadow-md',
    'bg-white flex flex-col items-center justify-center gap-2 p-8',
    'cursor-pointer select-none transition-all duration-200 hover:shadow-lg active:scale-95',
  ].join(' ');
  cardEl.setAttribute('role', 'button');
  cardEl.setAttribute('tabindex', '0');
  wrapper.appendChild(cardEl);

  // Position indicator
  const indicator = document.createElement('p');
  indicator.className = 'text-sm text-gray-400 font-medium';
  wrapper.appendChild(indicator);

  // Buttons row
  const btnRow = document.createElement('div');
  btnRow.className = 'flex gap-3';

  const btnPrev = document.createElement('button');
  btnPrev.className = 'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors';
  btnPrev.textContent = '← Sebelumnya';

  const btnNext = document.createElement('button');
  btnNext.className = 'px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors';
  btnNext.textContent = 'Berikutnya →';

  const btnShuffle = document.createElement('button');
  btnShuffle.className = 'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors';
  btnShuffle.textContent = '🔀 Acak';

  btnRow.appendChild(btnPrev);
  btnRow.appendChild(btnNext);
  btnRow.appendChild(btnShuffle);
  wrapper.appendChild(btnRow);

  container.appendChild(wrapper);

  // ── Render helpers ────────────────────────────────────────────────────────

  function updateCard() {
    const vocab = cards[currentIndex];
    cardEl.innerHTML = '';

    if (!isFlipped) {
      // Front: kanji (if exists) + kana
      if (vocab.kanji && vocab.kanji !== '') {
        const kanjiEl = document.createElement('p');
        kanjiEl.className = 'text-4xl font-bold text-gray-900 text-center';
        kanjiEl.textContent = vocab.kanji;
        cardEl.appendChild(kanjiEl);
      }
      const kanaEl = document.createElement('p');
      kanaEl.className = vocab.kanji && vocab.kanji !== ''
        ? 'text-xl text-gray-500 text-center'
        : 'text-4xl font-bold text-gray-900 text-center';
      kanaEl.textContent = vocab.kana;
      cardEl.appendChild(kanaEl);

      const hint = document.createElement('p');
      hint.className = 'text-xs text-gray-300 mt-4';
      hint.textContent = 'Ketuk untuk melihat arti';
      cardEl.appendChild(hint);
    } else {
      // Back: romaji + meaning
      const romajiEl = document.createElement('p');
      romajiEl.className = 'text-lg text-gray-400 italic text-center';
      romajiEl.textContent = vocab.romaji;
      cardEl.appendChild(romajiEl);

      const meaningEl = document.createElement('p');
      meaningEl.className = 'text-2xl font-bold text-indigo-700 text-center';
      meaningEl.textContent = vocab.meaning;
      cardEl.appendChild(meaningEl);
    }

    indicator.textContent = `${currentIndex + 1} / ${cards.length}`;
  }

  // ── Event listeners ───────────────────────────────────────────────────────

  cardEl.addEventListener('click', () => {
    isFlipped = !isFlipped;
    updateCard();
  });

  cardEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isFlipped = !isFlipped;
      updateCard();
    }
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
}

export { renderFlashcard };
