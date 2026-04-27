const wordClassColors = {
  'nomina':         'bg-blue-900/50 text-blue-300',
  'verba-I':        'bg-green-900/50 text-green-300',
  'verba-II':       'bg-emerald-900/50 text-emerald-300',
  'verba-III':      'bg-teal-900/50 text-teal-300',
  'verba-i':        'bg-green-900/50 text-green-300',
  'verba-ru':       'bg-emerald-900/50 text-emerald-300',
  'verba-ireguler': 'bg-teal-900/50 text-teal-300',
  'adjektiva-i':    'bg-purple-900/50 text-purple-300',
  'adjektiva-na':   'bg-violet-900/50 text-violet-300',
  'adverbia':       'bg-yellow-900/50 text-yellow-300',
  'partikel':       'bg-orange-900/50 text-orange-300',
  'konjungsi':      'bg-pink-900/50 text-pink-300',
  'ekspresi':       'bg-rose-900/50 text-rose-300',
  'rentaishi':      'bg-cyan-900/50 text-cyan-300',
  'prefiks':        'bg-slate-700 text-slate-300',
  'sufiks':         'bg-slate-700 text-slate-300',
};

function hasKanji(str) {
  if (!str || str === '') return false;
  // Kanji range: CJK Unified Ideographs
  return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(str);
}

function buildVocabCard(vocab) {
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
  return card;
}

function buildSectionHeader(title, count, iconClass, colorClass) {
  const header = document.createElement('div');
  header.className = `flex items-center gap-2 mt-4 mb-2`;

  const icon = document.createElement('span');
  icon.className = `text-lg ${colorClass}`;
  icon.textContent = iconClass;
  header.appendChild(icon);

  const label = document.createElement('h3');
  label.className = `text-sm font-semibold ${colorClass}`;
  label.textContent = `${title}`;
  header.appendChild(label);

  const countBadge = document.createElement('span');
  countBadge.className = 'ml-auto text-xs text-slate-500';
  countBadge.textContent = `${count} kata`;
  header.appendChild(countBadge);

  return header;
}

function renderKotoba(container, chapterData) {
  container.innerHTML = '';

  if (!chapterData || typeof chapterData !== 'object') {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Gagal memuat data kosakata.</p>`;
    return;
  }

  const vocabulary = chapterData?.vocabulary;

  if (!Array.isArray(vocabulary)) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Data kosakata tidak valid.</p>`;
    return;
  }

  if (vocabulary.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center py-12 text-sm">Kosakata untuk bab ini belum tersedia.</p>`;
    return;
  }

  const sorted = [...vocabulary].sort((a, b) => a.order - b.order);

  // Pisahkan: ada kanji vs tidak ada kanji
  const withKanji = sorted.filter(v => hasKanji(v.kanji));
  const withoutKanji = sorted.filter(v => !hasKanji(v.kanji));

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col gap-2';

  // Seksi: Kosakata Berkanji
  if (withKanji.length > 0) {
    wrapper.appendChild(buildSectionHeader('Kosakata Berkanji', withKanji.length, '漢', 'text-amber-400'));
    const divider1 = document.createElement('div');
    divider1.className = 'border-t border-amber-900/40 mb-2';
    wrapper.appendChild(divider1);

    for (const vocab of withKanji) {
      wrapper.appendChild(buildVocabCard(vocab));
    }
  }

  // Seksi: Kosakata Tanpa Kanji
  if (withoutKanji.length > 0) {
    wrapper.appendChild(buildSectionHeader('Kosakata Tanpa Kanji', withoutKanji.length, 'あ', 'text-sky-400'));
    const divider2 = document.createElement('div');
    divider2.className = 'border-t border-sky-900/40 mb-2';
    wrapper.appendChild(divider2);

    for (const vocab of withoutKanji) {
      wrapper.appendChild(buildVocabCard(vocab));
    }
  }

  container.appendChild(wrapper);
}

export { renderKotoba };
