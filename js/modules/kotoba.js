/**
 * Modul Kotoba — daftar kosakata per bab.
 */

/** @type {Record<string, string>} Warna badge per kelas kata */
const wordClassColors = {
  'nomina':           'bg-blue-100 text-blue-800',
  'verba-i':          'bg-green-100 text-green-800',
  'verba-ru':         'bg-emerald-100 text-emerald-800',
  'verba-ireguler':   'bg-teal-100 text-teal-800',
  'adjektiva-i':      'bg-purple-100 text-purple-800',
  'adjektiva-na':     'bg-violet-100 text-violet-800',
  'adverbia':         'bg-yellow-100 text-yellow-800',
  'partikel':         'bg-orange-100 text-orange-800',
  'konjungsi':        'bg-pink-100 text-pink-800',
  'ekspresi':         'bg-rose-100 text-rose-800',
  'prefiks':          'bg-gray-100 text-gray-700',
  'sufiks':           'bg-slate-100 text-slate-700',
};

/**
 * Render daftar kosakata ke dalam container.
 *
 * @param {HTMLElement} container
 * @param {import('../data.js').ChapterData} chapterData
 */
function renderKotoba(container, chapterData) {
  container.innerHTML = '';

  const vocabulary = chapterData?.vocabulary;

  if (!vocabulary || vocabulary.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-12">Kosakata untuk bab ini belum tersedia.</p>
    `;
    return;
  }

  const sorted = [...vocabulary].sort((a, b) => a.order - b.order);

  const list = document.createElement('div');
  list.className = 'space-y-3';

  for (const vocab of sorted) {
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3';

    // Left: Japanese text block
    const textBlock = document.createElement('div');
    textBlock.className = 'flex-1 min-w-0 overflow-hidden';

    if (vocab.kanji && vocab.kanji !== '') {
      const kanji = document.createElement('p');
      kanji.className = 'text-2xl font-bold text-gray-900 leading-tight';
      kanji.textContent = vocab.kanji;
      textBlock.appendChild(kanji);
    }

    const kana = document.createElement('p');
    kana.className = vocab.kanji && vocab.kanji !== ''
      ? 'text-base text-gray-600 mt-0.5'
      : 'text-2xl font-bold text-gray-900 leading-tight';
    kana.textContent = vocab.kana;
    textBlock.appendChild(kana);

    const romaji = document.createElement('p');
    romaji.className = 'text-sm text-gray-400 italic mt-0.5';
    romaji.textContent = vocab.romaji;
    textBlock.appendChild(romaji);

    card.appendChild(textBlock);

    // Right: badge + meaning
    const rightBlock = document.createElement('div');
    rightBlock.className = 'flex flex-col items-end gap-2 shrink-0';

    const badgeColor = wordClassColors[vocab.wordClass] || 'bg-gray-100 text-gray-700';
    const badge = document.createElement('span');
    badge.className = `text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`;
    badge.textContent = vocab.wordClass;
    rightBlock.appendChild(badge);

    const meaning = document.createElement('p');
    meaning.className = 'text-sm text-gray-700 text-right max-w-[120px] break-words';
    meaning.textContent = vocab.meaning;
    rightBlock.appendChild(meaning);

    card.appendChild(rightBlock);
    list.appendChild(card);
  }

  container.appendChild(list);
}

export { renderKotoba };
