const fs = require('fs');
const path = require('path');

// Comprehensive corruption fix for all chapters
const fixes = {
  // Chapter 5 - Patterns
  ch05_patterns: [
    {
      pattern: 'N は N で �?きま�?',
      fixed: 'N は N で 行きます'
    },
    {
      pattern: '�?��?�?は で�??�?�??で �?っ�?�?に �?きま�?�??',
      fixed: '私は 電車で 学校に 行きます。'
    },
    {
      pattern: '�?��?�で �?きに �?きま�?�??',
      fixed: 'バスで 駅に 行きます。'
    },
    {
      pattern: 'N に �?きま�?/きま�?/�?�?�??ま�?',
      fixed: 'N に 行きます/来ます/帰ります'
    },
    {
      pattern: 'Menyatakan arah pergerakan ke suatu tempat. Partikel に (ni) menandai tujuan atau arah. Digunakan dengan verba pergerakan �?きま�?, きま�?, �?�?�??ま�?.',
      fixed: 'Menyatakan arah pergerakan ke suatu tempat. Partikel に (ni) menandai tujuan atau arah. Digunakan dengan verba pergerakan 行きます, 来ます, 帰ります.'
    },
    {
      pattern: 'にほ�??に きま�?�?�??',
      fixed: '日本に 来ました。'
    },
    {
      pattern: '�?ちに �?�?�??ま�?�??',
      fixed: '家に 帰ります。'
    },
    {
      pattern: 'N と �?きま�?',
      fixed: 'N と 行きます'
    },
    {
      pattern: 'と�??だちと �?�?�?�?? みに �?きま�?�??',
      fixed: '友達と 映画を 見に 行きます。'
    },
    {
      pattern: '�?�?くと にほ�??に �?きま�?�?�??',
      fixed: '家族と 日本に 行きました。'
    },
    {
      pattern: '�?つ N に �?きま�?�?',
      fixed: 'いつ N に 行きますか'
    },
    {
      pattern: '�?つ にほ�??に きま�?�?�?�??',
      fixed: 'いつ 日本に 来ましたか。'
    },
    {
      pattern: '�?つ �?ちに �?�?�??ま�?�?�??',
      fixed: 'いつ 家に 帰りますか。'
    }
  ],
  
  // Chapter 5 - Grammar
  ch05_grammar: [
    {
      pattern: 'Partikel で �?? Alat Transportasi',
      fixed: 'Partikel で — Alat Transportasi'
    },
    {
      pattern: 'Partikel で (de) digunakan untuk menandai alat atau cara melakukan sesuatu. Dalam konteks transportasi, で menunjukkan kendaraan yang digunakan untuk bepergian. Pengecualian: berjalan kaki menggunakan ekspresi �?�??�?て (aruite) tanpa partikel で.',
      fixed: 'Partikel で (de) digunakan untuk menandai alat atau cara melakukan sesuatu. Dalam konteks transportasi, で menunjukkan kendaraan yang digunakan untuk bepergian. Pengecualian: berjalan kaki menggunakan ekspresi 歩いて (aruite) tanpa partikel で.'
    },
    {
      pattern: 'で�??�?�??で �?っ�?�?に �?きま�?�??',
      fixed: '電車で 学校に 行きます。'
    },
    {
      pattern: '�?��?��?��?�で び�??�?�?�??に �?きま�?�?�??',
      fixed: 'タクシーで 病院に 行きました。'
    },
    {
      pattern: 'Partikel に �?? Tujuan Pergerakan',
      fixed: 'Partikel に — Tujuan Pergerakan'
    },
    {
      pattern: 'Partikel に (ni) digunakan untuk menandai tujuan atau arah pergerakan ketika digunakan bersama verba pergerakan seperti �?きま�? (pergi), きま�? (datang), dan �?�?�??ま�? (pulang). Partikel に menunjukkan titik akhir dari pergerakan tersebut.',
      fixed: 'Partikel に (ni) digunakan untuk menandai tujuan atau arah pergerakan ketika digunakan bersama verba pergerakan seperti 行きます (pergi), 来ます (datang), dan 帰ります (pulang). Partikel に menunjukkan titik akhir dari pergerakan tersebut.'
    },
    {
      pattern: 'にほ�??に �?きま�?�??',
      fixed: '日本に 行きます。'
    },
    {
      pattern: '�?ちに �?�?�??ま�?�??',
      fixed: '家に 帰ります。'
    },
    {
      pattern: 'Partikel と �?? Bersama Seseorang',
      fixed: 'Partikel と — Bersama Seseorang'
    },
    {
      pattern: 'Partikel と (to) berarti \'bersama\' ketika digunakan dengan orang. Pola \'Orang と �?きま�?\' menyatakan bahwa pembicara pergi bersama orang tersebut. と juga dapat berarti \'dan\' untuk menghubungkan dua nomina.',
      fixed: 'Partikel と (to) berarti \'bersama\' ketika digunakan dengan orang. Pola \'Orang と 行きます\' menyatakan bahwa pembicara pergi bersama orang tersebut. と juga dapat berarti \'dan\' untuk menghubungkan dua nomina.'
    },
    {
      pattern: 'と�??だちと �?きに �?きま�?�??',
      fixed: '友達と 駅に 行きます。'
    },
    {
      pattern: '�?�?くと にほ�??に きま�?�?�??',
      fixed: '家族と 日本に 来ました。'
    }
  ]
};

function fixChapter(chapterNum) {
  const filePath = path.join(__dirname, 'data', `ch${String(chapterNum).padStart(2, '0')}.json`);
  
  console.log(`\n=== Fixing Chapter ${chapterNum} ===`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  
  // Apply all fixes
  const allFixes = [
    ...fixes.ch05_patterns,
    ...fixes.ch05_grammar
  ];
  
  allFixes.forEach(fix => {
    const before = content;
    content = content.split(fix.pattern).join(fix.fixed);
    if (content !== before) {
      fixCount++;
      console.log(`✓ Fixed: ${fix.pattern.substring(0, 50)}...`);
    }
  });
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\nTotal fixes applied: ${fixCount}`);
  console.log(`✓ Chapter ${chapterNum} saved`);
}

// Fix Chapter 5
console.log('Starting comprehensive corruption fix...');
fixChapter(5);

console.log('\n=== Fix Complete ===');
console.log('Run detect-all-corruption.cjs to verify the fixes.');
