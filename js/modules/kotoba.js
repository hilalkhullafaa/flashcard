const wordClassColors = {
  'nomina':         'bg-blue-900/50 text-blue-300',
  'verba-i':        'bg-green-900/50 text-green-300',
  'verba-ru':       'bg-emerald-900/50 text-emerald-300',
  'verba-ireguler': 'bg-teal-900/50 text-teal-300',
  'adjektiva-i':    'bg-purple-900/50 text-purple-300',
  'adjektiva-na':   'bg-violet-900/50 text-violet-300',
  'adverbia':       'bg-yellow-900/50 text-yellow-300',
  'partikel':       'bg-orange-900/50 text-orange-300',
  'konjungsi':      'bg-pink-900/50 text-pink-300',
  'ekspresi':       'bg-rose-900/50 text-rose-300',
  'prefiks':        'bg-slate-700 text-slate-300',
  'sufiks':         'bg-slate-700 text-slate-300',
};

function renderKotoba(container, chapterData) {
  container.innerHTML = '';
  
  // Handle missing or invalid chapter data
  if (!chapterData || typeof chapterData !== 'object') {
    console.error('Invalid chapter data provided to renderKotoba');
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

  const sorted = [...vocabulary].sort((a, b) => a.order - b.order);
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-2';

  for (const vocab of sorted) {
    const card = document.createElement('div');
    card.className = 'bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3';

    // Left: Japanese
    const textBlock = document.createElement('div');
    textBlock.className = 'flex-1 min-w-0';

    if (vocab.kanji && vocab.kanji !== '') {
      const k = document.createElement('p');
      k.className = 'text-xl font-bold text-white leading-tight';
      k.textContent = vocab.kanji;
      textBlock.appendChild(k);
    }

    const kana = document.createElement('p');
    kana.className = vocab.kanji && vocab.kanji !== ''
      ? 'text-sm text-slate-400'
      : 'text-xl font-bold text-white leading-tight';
    kana.textContent = vocab.kana;
    textBlock.appendChild(kana);

    const romaji = document.createElement('p');
    romaji.className = 'text-xs text-slate-500 italic';
    romaji.textContent = vocab.romaji;
    textBlock.appendChild(romaji);

    card.appendChild(textBlock);

    // Right: badge + meaning
    const right = document.createElement('div');
    right.className = 'flex flex-col items-end gap-1.5 shrink-0 max-w-[130px]';

    const badgeColor = wordClassColors[vocab.wordClass] || 'bg-slate-700 text-slate-300';
    const badge = document.createElement('span');
    badge.className = `text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`;
    badge.textContent = vocab.wordClass;
    right.appendChild(badge);

    const meaning = document.createElement('p');
    meaning.className = 'text-sm text-slate-300 text-right break-words';
    meaning.textContent = vocab.meaning;
    right.appendChild(meaning);

    card.appendChild(right);
    list.appendChild(card);
  }

  container.appendChild(list);
}

export { renderKotoba };
