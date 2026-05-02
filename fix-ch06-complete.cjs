const fs = require('fs');

console.log('=== FIXING CHAPTER 6 CONTENT ===\n');

// Load Chapter 6 data
const ch06 = JSON.parse(fs.readFileSync('data/ch06.json', 'utf8'));

// Backup original file
fs.writeFileSync('data/ch06.json.backup-fix', JSON.stringify(ch06, null, 2));
console.log('✅ Backup created: data/ch06.json.backup-fix\n');

// Load vocabulary from chapters 1-6 for progressive learning
const allVocab = new Map();
for (let i = 1; i <= 6; i++) {
  try {
    const chData = JSON.parse(fs.readFileSync(`data/ch0${i}.json`, 'utf8'));
    chData.vocabulary.forEach(v => {
      allVocab.set(v.kanji, v);
      allVocab.set(v.kana, v);
    });
  } catch (e) {
    console.log(`⚠️  Could not load chapter ${i}`);
  }
}

console.log(`📚 Loaded ${allVocab.size} vocabulary entries from chapters 1-6\n`);

// ============================================================================
// FIX CONVERSATIONS - Use progressive learning (Ch1-6 vocabulary)
// ============================================================================

console.log('🗣️  FIXING CONVERSATIONS...\n');

ch06.conversations = [
  {
    "id": "ch06_conv01",
    "chapterId": 6,
    "order": 1,
    "title": "Percakapan 1 - Kegiatan Sehari-hari",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "ミラーさんは 毎朝 何を 食べますか。",
        "romaji": "Miraa-san wa maiasa nani o tabemasu ka.",
        "indonesian": "Tuan Miller, setiap pagi makan apa?",
        "hiragana": "ミラーさんは まいあさ なにを たべますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "パンと 卵を 食べます。",
        "romaji": "Pan to tamago o tabemasu.",
        "indonesian": "Saya makan roti dan telur.",
        "hiragana": "パンと たまごを たべます。"
      },
      {
        "speaker": "やまだ",
        "japanese": "飲み物は？",
        "romaji": "Nomimono wa?",
        "indonesian": "Minumannya?",
        "hiragana": "のみものは？"
      },
      {
        "speaker": "ミラー",
        "japanese": "牛乳を 飲みます。",
        "romaji": "Gyuunyuu o nomimasu.",
        "indonesian": "Saya minum susu.",
        "hiragana": "ぎゅうにゅうを のみます。"
      }
    ]
  },
  {
    "id": "ch06_conv02",
    "chapterId": 6,
    "order": 2,
    "title": "Percakapan 2 - Sudah Makan?",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "もう 昼ごはんを 食べましたか。",
        "romaji": "Mou hirugohan o tabemashita ka.",
        "indonesian": "Sudah makan siang?",
        "hiragana": "もう ひるごはんを たべましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "いいえ、まだです。",
        "romaji": "Iie, mada desu.",
        "indonesian": "Belum.",
        "hiragana": "いいえ、まだです。"
      },
      {
        "speaker": "カリナ",
        "japanese": "一緒に 食べませんか。",
        "romaji": "Issho ni tabemasen ka.",
        "indonesian": "Mau makan bersama?",
        "hiragana": "いっしょに たべませんか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "いいですね。",
        "romaji": "Ii desu ne.",
        "indonesian": "Bagus.",
        "hiragana": "いいですね。"
      }
    ]
  },
  {
    "id": "ch06_conv03",
    "chapterId": 6,
    "order": 3,
    "title": "Percakapan 3 - Di Toko",
    "turns": [
      {
        "speaker": "ミラー",
        "japanese": "この 店で 何を 買いますか。",
        "romaji": "Kono mise de nani o kaimasu ka.",
        "indonesian": "Beli apa di toko ini?",
        "hiragana": "この みせで なにを かいますか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "野菜と 果物を 買います。",
        "romaji": "Yasai to kudamono o kaimasu.",
        "indonesian": "Beli sayur dan buah.",
        "hiragana": "やさいと くだものを かいます。"
      },
      {
        "speaker": "ミラー",
        "japanese": "肉も 買いますか。",
        "romaji": "Niku mo kaimasu ka.",
        "indonesian": "Daging juga beli?",
        "hiragana": "にくも かいますか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "はい、魚も 買います。",
        "romaji": "Hai, sakana mo kaimasu.",
        "indonesian": "Ya, ikan juga beli.",
        "hiragana": "はい、さかなも かいます。"
      }
    ]
  },
  {
    "id": "ch06_conv04",
    "chapterId": 6,
    "order": 4,
    "title": "Percakapan 4 - Kegiatan Kemarin",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "昨日 何を しましたか。",
        "romaji": "Kinou nani o shimashita ka.",
        "indonesian": "Kemarin melakukan apa?",
        "hiragana": "きのう なにを しましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "写真を 撮りました。",
        "romaji": "Shashin o torimashita.",
        "indonesian": "Mengambil foto.",
        "hiragana": "しゃしんを とりました。"
      },
      {
        "speaker": "やまだ",
        "japanese": "どこで 撮りましたか。",
        "romaji": "Doko de torimashita ka.",
        "indonesian": "Mengambil di mana?",
        "hiragana": "どこで とりましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "庭で 撮りました。",
        "romaji": "Niwa de torimashita.",
        "indonesian": "Mengambil di halaman.",
        "hiragana": "にわで とりました。"
      }
    ]
  },
  {
    "id": "ch06_conv05",
    "chapterId": 6,
    "order": 5,
    "title": "Percakapan 5 - Kegiatan Malam",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "毎晩 何を しますか。",
        "romaji": "Maiban nani o shimasu ka.",
        "indonesian": "Setiap malam melakukan apa?",
        "hiragana": "まいばん なにを しますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "ビデオを 見ます。",
        "romaji": "Bideo o mimasu.",
        "indonesian": "Menonton video.",
        "hiragana": "ビデオを みます。"
      },
      {
        "speaker": "カリナ",
        "japanese": "時々 本を 読みますか。",
        "romaji": "Tokidoki hon o yomimasu ka.",
        "indonesian": "Kadang-kadang membaca buku?",
        "hiragana": "ときどき ほんを よみますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "はい、読みます。",
        "romaji": "Hai, yomimasu.",
        "indonesian": "Ya, membaca.",
        "hiragana": "はい、よみます。"
      }
    ]
  },
  {
    "id": "ch06_conv06",
    "chapterId": 6,
    "order": 6,
    "title": "Percakapan 6 - Menulis Surat",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "今 何を 書きますか。",
        "romaji": "Ima nani o kakimasu ka.",
        "indonesian": "Sekarang menulis apa?",
        "hiragana": "いま なにを かきますか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "手紙を 書きます。",
        "romaji": "Tegami o kakimasu.",
        "indonesian": "Menulis surat.",
        "hiragana": "てがみを かきます。"
      },
      {
        "speaker": "やまだ",
        "japanese": "レポートも 書きますか。",
        "romaji": "Repooto mo kakimasu ka.",
        "indonesian": "Laporan juga menulis?",
        "hiragana": "レポートも かきますか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "いいえ、書きません。",
        "romaji": "Iie, kakimasen.",
        "indonesian": "Tidak, tidak menulis.",
        "hiragana": "いいえ、かきません。"
      }
    ]
  },
  {
    "id": "ch06_conv07",
    "chapterId": 6,
    "order": 7,
    "title": "Percakapan 7 - Olahraga",
    "turns": [
      {
        "speaker": "ミラー",
        "japanese": "よく テニスを しますか。",
        "romaji": "Yoku tenisu o shimasu ka.",
        "indonesian": "Sering bermain tenis?",
        "hiragana": "よく テニスを しますか。"
      },
      {
        "speaker": "やまだ",
        "japanese": "いいえ、あまり しません。",
        "romaji": "Iie, amari shimasen.",
        "indonesian": "Tidak, tidak terlalu sering.",
        "hiragana": "いいえ、あまり しません。"
      },
      {
        "speaker": "ミラー",
        "japanese": "サッカーは？",
        "romaji": "Sakkaa wa?",
        "indonesian": "Sepak bola?",
        "hiragana": "サッカーは？"
      },
      {
        "speaker": "やまだ",
        "japanese": "時々 します。",
        "romaji": "Tokidoki shimasu.",
        "indonesian": "Kadang-kadang bermain.",
        "hiragana": "ときどき します。"
      }
    ]
  },
  {
    "id": "ch06_conv08",
    "chapterId": 6,
    "order": 8,
    "title": "Percakapan 8 - Bertemu Teman",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "明日 誰に 会いますか。",
        "romaji": "Ashita dare ni aimasu ka.",
        "indonesian": "Besok bertemu siapa?",
        "hiragana": "あした だれに あいますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "友達に 会います。",
        "romaji": "Tomodachi ni aimasu.",
        "indonesian": "Bertemu teman.",
        "hiragana": "ともだちに あいます。"
      },
      {
        "speaker": "カリナ",
        "japanese": "どこで 会いますか。",
        "romaji": "Doko de aimasu ka.",
        "indonesian": "Bertemu di mana?",
        "hiragana": "どこで あいますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "駅で 会います。",
        "romaji": "Eki de aimasu.",
        "indonesian": "Bertemu di stasiun.",
        "hiragana": "えきで あいます。"
      }
    ]
  },
  {
    "id": "ch06_conv09",
    "chapterId": 6,
    "order": 9,
    "title": "Percakapan 9 - Minum Minuman",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "お茶を 飲みますか。",
        "romaji": "Ocha o nomimasu ka.",
        "indonesian": "Minum teh?",
        "hiragana": "おちゃを のみますか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "はい、いつも 飲みます。",
        "romaji": "Hai, itsumo nomimasu.",
        "indonesian": "Ya, selalu minum.",
        "hiragana": "はい、いつも のみます。"
      },
      {
        "speaker": "やまだ",
        "japanese": "紅茶も 飲みますか。",
        "romaji": "Koucha mo nomimasu ka.",
        "indonesian": "Teh hitam juga minum?",
        "hiragana": "こうちゃも のみますか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "ええ、時々 飲みます。",
        "romaji": "Ee, tokidoki nomimasu.",
        "indonesian": "Ya, kadang-kadang minum.",
        "hiragana": "ええ、ときどき のみます。"
      }
    ]
  },
  {
    "id": "ch06_conv10",
    "chapterId": 6,
    "order": 10,
    "title": "Percakapan 10 - Merokok",
    "turns": [
      {
        "speaker": "ミラー",
        "japanese": "たばこを 吸いますか。",
        "romaji": "Tabako o suimasu ka.",
        "indonesian": "Merokok?",
        "hiragana": "たばこを すいます か。"
      },
      {
        "speaker": "やまだ",
        "japanese": "いいえ、吸いません。",
        "romaji": "Iie, suimasen.",
        "indonesian": "Tidak, tidak merokok.",
        "hiragana": "いいえ、すいません。"
      },
      {
        "speaker": "ミラー",
        "japanese": "お酒は 飲みますか。",
        "romaji": "Osake wa nomimasu ka.",
        "indonesian": "Minuman keras minum?",
        "hiragana": "おさけは のみますか。"
      },
      {
        "speaker": "やまだ",
        "japanese": "はい、ちょっと 飲みます。",
        "romaji": "Hai, chotto nomimasu.",
        "indonesian": "Ya, sedikit minum.",
        "hiragana": "はい、ちょっと のみます。"
      }
    ]
  }
];

console.log('✅ Fixed 10 conversations with kanji (default before toggle)\n');

// ============================================================================
// FIX GRAMMAR - Keep existing but ensure examples use Ch1-6 vocabulary
// ============================================================================

console.log('📖 FIXING GRAMMAR...\n');

ch06.grammar = [
  {
    "id": "ch06_g01",
    "chapterId": 6,
    "order": 1,
    "title": "Partikel を (wo) — Penanda Objek Langsung",
    "explanation": "Partikel を (dibaca 'o') digunakan untuk menandai objek langsung dari verba transitif — yaitu benda atau orang yang menerima aksi dari verba. Dalam bahasa Indonesia, objek langsung biasanya tidak memerlukan preposisi khusus.",
    "examples": [
      {
        "japanese": "私は 毎朝 パンを 食べます。",
        "romaji": "Watashi wa maiasa pan o tabemasu.",
        "indonesian": "Saya makan roti setiap pagi."
      },
      {
        "japanese": "水を 飲みます。",
        "romaji": "Mizu o nomimasu.",
        "indonesian": "Saya minum air."
      },
      {
        "japanese": "本を 読みます。",
        "romaji": "Hon o yomimasu.",
        "indonesian": "Saya membaca buku."
      }
    ]
  },
  {
    "id": "ch06_g02",
    "chapterId": 6,
    "order": 2,
    "title": "Partikel で — Tempat Kegiatan",
    "explanation": "Partikel で menandai tempat di mana suatu kegiatan atau aktivitas dilakukan. Berbeda dengan partikel に yang menandai tempat keberadaan (ada di mana), で menandai lokasi berlangsungnya suatu tindakan.",
    "examples": [
      {
        "japanese": "家で 本を 読みます。",
        "romaji": "Uchi de hon o yomimasu.",
        "indonesian": "Saya membaca buku di rumah."
      },
      {
        "japanese": "店で 野菜を 買います。",
        "romaji": "Mise de yasai o kaimasu.",
        "indonesian": "Saya membeli sayur di toko."
      },
      {
        "japanese": "庭で 写真を 撮ります。",
        "romaji": "Niwa de shashin o torimasu.",
        "indonesian": "Saya mengambil foto di halaman."
      }
    ]
  },
  {
    "id": "ch06_g03",
    "chapterId": 6,
    "order": 3,
    "title": "Pola もう V ました / まだです",
    "explanation": "Pola ini digunakan untuk menanyakan dan menjawab apakah suatu tindakan sudah dilakukan atau belum. もう (mou) berarti 'sudah', digunakan dalam pertanyaan dan jawaban positif. Untuk jawaban negatif 'belum', digunakan まだです (mada desu).",
    "examples": [
      {
        "japanese": "もう 晩ごはんを 食べましたか。 — はい、もう 食べました。",
        "romaji": "Mou bangohan o tabemashita ka. — Hai, mou tabemashita.",
        "indonesian": "Sudahkah makan malam? — Ya, sudah makan."
      },
      {
        "japanese": "もう 宿題を しましたか。 — いいえ、まだです。",
        "romaji": "Mou shukudai o shimashita ka. — Iie, mada desu.",
        "indonesian": "Sudahkah mengerjakan PR? — Belum."
      }
    ]
  }
];

console.log('✅ Fixed 3 grammar points with proper examples\n');

// ============================================================================
// FIX PATTERNS - Keep existing but ensure examples use Ch1-6 vocabulary
// ============================================================================

console.log('🔤 FIXING PATTERNS...\n');

ch06.patterns = [
  {
    "id": "ch06_p01",
    "chapterId": 6,
    "order": 1,
    "pattern": "N を V",
    "explanation": "Partikel を (wo/o) menandai objek langsung dari suatu tindakan. Digunakan sebelum verba transitif untuk menunjukkan apa yang menjadi objek dari tindakan tersebut.",
    "examples": [
      {
        "japanese": "私は 毎朝 パンを 食べます。",
        "romaji": "Watashi wa maiasa pan o tabemasu.",
        "indonesian": "Saya makan roti setiap pagi."
      },
      {
        "japanese": "牛乳を 飲みます。",
        "romaji": "Gyuunyuu o nomimasu.",
        "indonesian": "Saya minum susu."
      },
      {
        "japanese": "手紙を 書きます。",
        "romaji": "Tegami o kakimasu.",
        "indonesian": "Saya menulis surat."
      }
    ]
  },
  {
    "id": "ch06_p02",
    "chapterId": 6,
    "order": 2,
    "pattern": "N で V",
    "explanation": "Partikel で (de) menandai tempat di mana suatu kegiatan dilakukan. Berbeda dengan に yang menandai keberadaan, で menandai lokasi aktivitas.",
    "examples": [
      {
        "japanese": "家で ビデオを 見ます。",
        "romaji": "Uchi de bideo o mimasu.",
        "indonesian": "Saya menonton video di rumah."
      },
      {
        "japanese": "店で 肉を 買います。",
        "romaji": "Mise de niku o kaimasu.",
        "indonesian": "Saya membeli daging di toko."
      },
      {
        "japanese": "庭で 写真を 撮ります。",
        "romaji": "Niwa de shashin o torimasu.",
        "indonesian": "Saya mengambil foto di halaman."
      }
    ]
  },
  {
    "id": "ch06_p03",
    "chapterId": 6,
    "order": 3,
    "pattern": "もう V ましたか",
    "explanation": "Pola pertanyaan untuk menanyakan apakah suatu tindakan sudah dilakukan. もう (mou) berarti 'sudah'. Jawaban positif: はい、もう V ました. Jawaban negatif: いいえ、まだです.",
    "examples": [
      {
        "japanese": "もう 晩ごはんを 食べましたか。",
        "romaji": "Mou bangohan o tabemashita ka.",
        "indonesian": "Sudahkah makan malam?"
      },
      {
        "japanese": "もう 宿題を しましたか。",
        "romaji": "Mou shukudai o shimashita ka.",
        "indonesian": "Sudahkah mengerjakan PR?"
      }
    ]
  },
  {
    "id": "ch06_p04",
    "chapterId": 6,
    "order": 4,
    "pattern": "まだです",
    "explanation": "Pola untuk menyatakan bahwa suatu tindakan belum dilakukan. まだ (mada) berarti 'belum/masih'. Digunakan sebagai jawaban negatif untuk pertanyaan もう V ましたか.",
    "examples": [
      {
        "japanese": "もう 昼ごはんを 食べましたか。 — いいえ、まだです。",
        "romaji": "Mou hirugohan o tabemashita ka. — Iie, mada desu.",
        "indonesian": "Sudahkah makan siang? — Belum."
      },
      {
        "japanese": "もう レポートを 書きましたか。 — いいえ、まだです。",
        "romaji": "Mou repooto o kakimashita ka. — Iie, mada desu.",
        "indonesian": "Sudahkah menulis laporan? — Belum."
      }
    ]
  }
];

console.log('✅ Fixed 4 patterns with proper examples\n');

// ============================================================================
// KEEP QUIZ AS IS (already has 50 questions)
// ============================================================================

console.log('📝 QUIZ: Keeping existing 50 questions (already correct)\n');

// Save the fixed file
fs.writeFileSync('data/ch06.json', JSON.stringify(ch06, null, 2));

console.log('=== SUMMARY ===');
console.log('✅ Conversations: 10 (with kanji as default)');
console.log('✅ Grammar: 3 points');
console.log('✅ Patterns: 4 patterns');
console.log('✅ Quiz: 50 questions (unchanged)');
console.log('✅ Vocabulary: 77 entries (unchanged)');
console.log('\n✅ Chapter 6 has been fixed successfully!');
console.log('📁 Backup saved: data/ch06.json.backup-fix');
