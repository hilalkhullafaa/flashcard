const fs = require('fs');

console.log('=== UPDATING CHAPTER 6 WITH MINNA NO NIHONGO CONTENT ===\n');

// Read current Chapter 6 data
const ch06 = JSON.parse(fs.readFileSync('data/ch06.json', 'utf8'));

// Backup original file
fs.writeFileSync('data/ch06.json.backup-minna-update', JSON.stringify(ch06, null, 2));
console.log('✅ Backup created: data/ch06.json.backup-minna-update\n');

// Update conversations with Minna no Nihongo Chapter 6 content
// Chapter 6 focuses on: を particle, で particle (location), もう/まだ patterns
ch06.conversations = [
  {
    "id": "ch06_conv01",
    "chapterId": 6,
    "order": 1,
    "title": "Percakapan 1 — Sarapan Pagi",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "ミラーさんは まいあさ なにを たべますか。",
        "romaji": "Miraa-san wa maiasa nani o tabemasu ka.",
        "indonesian": "Tuan Miller, setiap pagi makan apa?",
        "hiragana": "ミラーさんは まいあさ なにを たべますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "パンと たまごを たべます。それから、ぎゅうにゅうを のみます。",
        "romaji": "Pan to tamago o tabemasu. Sorekara, gyuunyuu o nomimasu.",
        "indonesian": "Saya makan roti dan telur. Kemudian, minum susu.",
        "hiragana": "パンと たまごを たべます。それから、ぎゅうにゅうを のみます。"
      },
      {
        "speaker": "やまだ",
        "japanese": "私は ごはんと さかなを たべます。",
        "romaji": "Watashi wa gohan to sakana o tabemasu.",
        "indonesian": "Saya makan nasi dan ikan.",
        "hiragana": "わたしは ごはんと さかなを たべます。"
      }
    ]
  },
  {
    "id": "ch06_conv02",
    "chapterId": 6,
    "order": 2,
    "title": "Percakapan 2 — Sudah Makan Siang?",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "もう ひるごはんを たべましたか。",
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
        "japanese": "じゃ、いっしょに たべませんか。",
        "romaji": "Ja, issho ni tabemasen ka.",
        "indonesian": "Kalau begitu, mau makan bersama?",
        "hiragana": "じゃ、いっしょに たべませんか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "ええ、いいですね。",
        "romaji": "Ee, ii desu ne.",
        "indonesian": "Ya, bagus.",
        "hiragana": "ええ、いいですね。"
      }
    ]
  },
  {
    "id": "ch06_conv03",
    "chapterId": 6,
    "order": 3,
    "title": "Percakapan 3 — Di Toko",
    "turns": [
      {
        "speaker": "ミラー",
        "japanese": "きのう みせで なにを かいましたか。",
        "romaji": "Kinou mise de nani o kaimashita ka.",
        "indonesian": "Kemarin beli apa di toko?",
        "hiragana": "きのう みせで なにを かいましたか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "やさいと くだものを かいました。",
        "romaji": "Yasai to kudamono o kaimashita.",
        "indonesian": "Beli sayur dan buah.",
        "hiragana": "やさいと くだものを かいました。"
      },
      {
        "speaker": "ミラー",
        "japanese": "なにを かいましたか。",
        "romaji": "Nani o kaimashita ka.",
        "indonesian": "Beli apa?",
        "hiragana": "なにを かいましたか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "トマトと りんごを かいました。",
        "romaji": "Tomato to ringo o kaimashita.",
        "indonesian": "Beli tomat dan apel.",
        "hiragana": "トマトと りんごを かいました。"
      }
    ]
  },
  {
    "id": "ch06_conv04",
    "chapterId": 6,
    "order": 4,
    "title": "Percakapan 4 — Minum Apa",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "まいあさ なにを のみますか。",
        "romaji": "Maiasa nani o nomimasu ka.",
        "indonesian": "Setiap pagi minum apa?",
        "hiragana": "まいあさ なにを のみますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "おちゃを のみます。",
        "romaji": "Ocha o nomimasu.",
        "indonesian": "Minum teh.",
        "hiragana": "おちゃを のみます。"
      },
      {
        "speaker": "やまだ",
        "japanese": "こうちゃですか。",
        "romaji": "Koucha desu ka.",
        "indonesian": "Teh hitam?",
        "hiragana": "こうちゃですか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "いいえ、おちゃです。",
        "romaji": "Iie, ocha desu.",
        "indonesian": "Tidak, teh hijau.",
        "hiragana": "いいえ、おちゃです。"
      }
    ]
  },
  {
    "id": "ch06_conv05",
    "chapterId": 6,
    "order": 5,
    "title": "Percakapan 5 — Menulis Surat",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "なにを かきますか。",
        "romaji": "Nani o kakimasu ka.",
        "indonesian": "Menulis apa?",
        "hiragana": "なにを かきますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "てがみを かきます。",
        "romaji": "Tegami o kakimasu.",
        "indonesian": "Menulis surat.",
        "hiragana": "てがみを かきます。"
      },
      {
        "speaker": "カリナ",
        "japanese": "だれに かきますか。",
        "romaji": "Dare ni kakimasu ka.",
        "indonesian": "Untuk siapa?",
        "hiragana": "だれに かきますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "ともだちに かきます。",
        "romaji": "Tomodachi ni kakimasu.",
        "indonesian": "Untuk teman.",
        "hiragana": "ともだちに かきます。"
      }
    ]
  },
  {
    "id": "ch06_conv06",
    "chapterId": 6,
    "order": 6,
    "title": "Percakapan 6 — Mengambil Foto",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "きのう なにを しましたか。",
        "romaji": "Kinou nani o shimashita ka.",
        "indonesian": "Kemarin melakukan apa?",
        "hiragana": "きのう なにを しましたか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "にわで しゃしんを とりました。",
        "romaji": "Niwa de shashin o torimashita.",
        "indonesian": "Mengambil foto di halaman.",
        "hiragana": "にわで しゃしんを とりました。"
      },
      {
        "speaker": "やまだ",
        "japanese": "なにの しゃしんですか。",
        "romaji": "Nani no shashin desu ka.",
        "indonesian": "Foto apa?",
        "hiragana": "なにの しゃしんですか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "はなの しゃしんです。",
        "romaji": "Hana no shashin desu.",
        "indonesian": "Foto bunga.",
        "hiragana": "はなの しゃしんです。"
      }
    ]
  },
  {
    "id": "ch06_conv07",
    "chapterId": 6,
    "order": 7,
    "title": "Percakapan 7 — Sudah Mengerjakan PR?",
    "turns": [
      {
        "speaker": "ミラー",
        "japanese": "もう しゅくだいを しましたか。",
        "romaji": "Mou shukudai o shimashita ka.",
        "indonesian": "Sudah mengerjakan PR?",
        "hiragana": "もう しゅくだいを しましたか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "いいえ、まだです。",
        "romaji": "Iie, mada desu.",
        "indonesian": "Belum.",
        "hiragana": "いいえ、まだです。"
      },
      {
        "speaker": "ミラー",
        "japanese": "じゃ、いっしょに しませんか。",
        "romaji": "Ja, issho ni shimasen ka.",
        "indonesian": "Kalau begitu, mau mengerjakan bersama?",
        "hiragana": "じゃ、いっしょに しませんか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "ええ、いいですね。",
        "romaji": "Ee, ii desu ne.",
        "indonesian": "Ya, bagus.",
        "hiragana": "ええ、いいですね。"
      }
    ]
  },
  {
    "id": "ch06_conv08",
    "chapterId": 6,
    "order": 8,
    "title": "Percakapan 8 — Bermain Tenis",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "あした なにを しますか。",
        "romaji": "Ashita nani o shimasu ka.",
        "indonesian": "Besok melakukan apa?",
        "hiragana": "あした なにを しますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "テニスを します。",
        "romaji": "Tenisu o shimasu.",
        "indonesian": "Bermain tenis.",
        "hiragana": "テニスを します。"
      },
      {
        "speaker": "やまだ",
        "japanese": "どこで しますか。",
        "romaji": "Doko de shimasu ka.",
        "indonesian": "Di mana?",
        "hiragana": "どこで しますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "こうえんで します。",
        "romaji": "Kouen de shimasu.",
        "indonesian": "Di taman.",
        "hiragana": "こうえんで します。"
      }
    ]
  },
  {
    "id": "ch06_conv09",
    "chapterId": 6,
    "order": 9,
    "title": "Percakapan 9 — Bertemu Teman",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "きのう だれに あいましたか。",
        "romaji": "Kinou dare ni aimashita ka.",
        "indonesian": "Kemarin bertemu siapa?",
        "hiragana": "きのう だれに あいましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "ともだちに あいました。",
        "romaji": "Tomodachi ni aimashita.",
        "indonesian": "Bertemu teman.",
        "hiragana": "ともだちに あいました。"
      },
      {
        "speaker": "カリナ",
        "japanese": "どこで あいましたか。",
        "romaji": "Doko de aimashita ka.",
        "indonesian": "Bertemu di mana?",
        "hiragana": "どこで あいましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "えきで あいました。",
        "romaji": "Eki de aimashita.",
        "indonesian": "Bertemu di stasiun.",
        "hiragana": "えきで あいました。"
      }
    ]
  },
  {
    "id": "ch06_conv10",
    "chapterId": 6,
    "order": 10,
    "title": "Percakapan 10 — Makan Malam",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "ゆうべ なにを たべましたか。",
        "romaji": "Yuube nani o tabemashita ka.",
        "indonesian": "Tadi malam makan apa?",
        "hiragana": "ゆうべ なにを たべましたか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "さかなと やさいを たべました。",
        "romaji": "Sakana to yasai o tabemashita.",
        "indonesian": "Makan ikan dan sayur.",
        "hiragana": "さかなと やさいを たべました。"
      },
      {
        "speaker": "やまだ",
        "japanese": "おいしかったですか。",
        "romaji": "Oishikatta desu ka.",
        "indonesian": "Enak?",
        "hiragana": "おいしかったですか。"
      },
      {
        "speaker": "カリナ",
        "japanese": "はい、とても おいしかったです。",
        "romaji": "Hai, totemo oishikatta desu.",
        "indonesian": "Ya, sangat enak.",
        "hiragana": "はい、とても おいしかったです。"
      }
    ]
  }
];

// Update grammar with Minna no Nihongo Chapter 6 content
ch06.grammar = [
  {
    "id": "ch06_g01",
    "chapterId": 6,
    "order": 1,
    "title": "Partikel を (wo) — Penanda Objek Langsung",
    "explanation": "Partikel を (dibaca 'o') digunakan untuk menandai objek langsung dari verba transitif — yaitu benda atau orang yang menerima aksi dari verba. Dalam bahasa Indonesia, objek langsung biasanya tidak memerlukan preposisi khusus.",
    "examples": [
      {
        "japanese": "私は まいあさ パンを たべます。",
        "romaji": "Watashi wa maiasa pan o tabemasu.",
        "indonesian": "Saya makan roti setiap pagi."
      },
      {
        "japanese": "ぎゅうにゅうを のみます。",
        "romaji": "Gyuunyuu o nomimasu.",
        "indonesian": "Saya minum susu."
      },
      {
        "japanese": "てがみを かきます。",
        "romaji": "Tegami o kakimasu.",
        "indonesian": "Saya menulis surat."
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
        "japanese": "みせで やさいを かいます。",
        "romaji": "Mise de yasai o kaimasu.",
        "indonesian": "Saya membeli sayur di toko."
      },
      {
        "japanese": "にわで しゃしんを とります。",
        "romaji": "Niwa de shashin o torimasu.",
        "indonesian": "Saya mengambil foto di halaman."
      },
      {
        "japanese": "こうえんで テニスを します。",
        "romaji": "Kouen de tenisu o shimasu.",
        "indonesian": "Saya bermain tenis di taman."
      }
    ]
  },
  {
    "id": "ch06_g03",
    "chapterId": 6,
    "order": 3,
    "title": "Pola もう V ました / まだです",
    "explanation": "Pola ini digunakan untuk menanyakan dan menjawab apakah suatu tindakan sudah dilakukan atau belum. もう (mou) berarti 'sudah', digunakan dalam pertanyaan もう V ましたか dan jawaban positif はい、もう V ました. Untuk jawaban negatif 'belum', digunakan いいえ、まだです.",
    "examples": [
      {
        "japanese": "もう ばんごはんを たべましたか。 — はい、もう たべました。",
        "romaji": "Mou bangohan o tabemashita ka. — Hai, mou tabemashita.",
        "indonesian": "Sudahkah makan malam? — Ya, sudah makan."
      },
      {
        "japanese": "もう しゅくだいを しましたか。 — いいえ、まだです。",
        "romaji": "Mou shukudai o shimashita ka. — Iie, mada desu.",
        "indonesian": "Sudahkah mengerjakan PR? — Belum."
      }
    ]
  },
  {
    "id": "ch06_g04",
    "chapterId": 6,
    "order": 4,
    "title": "Partikel に — Penanda Penerima Aksi",
    "explanation": "Partikel に digunakan untuk menandai penerima aksi dari verba seperti あいます (bertemu), かきます (menulis untuk), でんわします (menelepon). Dalam konteks ini, に menunjukkan kepada siapa aksi ditujukan.",
    "examples": [
      {
        "japanese": "ともだちに あいます。",
        "romaji": "Tomodachi ni aimasu.",
        "indonesian": "Saya bertemu teman."
      },
      {
        "japanese": "ともだちに てがみを かきます。",
        "romaji": "Tomodachi ni tegami o kakimasu.",
        "indonesian": "Saya menulis surat untuk teman."
      }
    ]
  }
];

// Update patterns with Minna no Nihongo Chapter 6 content
ch06.patterns = [
  {
    "id": "ch06_p01",
    "chapterId": 6,
    "order": 1,
    "pattern": "N を V",
    "explanation": "Partikel を (wo/o) menandai objek langsung dari suatu tindakan. Digunakan sebelum verba transitif untuk menunjukkan apa yang menjadi objek dari tindakan tersebut.",
    "examples": [
      {
        "japanese": "私は まいあさ パンを たべます。",
        "romaji": "Watashi wa maiasa pan o tabemasu.",
        "indonesian": "Saya makan roti setiap pagi."
      },
      {
        "japanese": "ぎゅうにゅうを のみます。",
        "romaji": "Gyuunyuu o nomimasu.",
        "indonesian": "Saya minum susu."
      },
      {
        "japanese": "しゃしんを とります。",
        "romaji": "Shashin o torimasu.",
        "indonesian": "Saya mengambil foto."
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
        "japanese": "みせで やさいを かいます。",
        "romaji": "Mise de yasai o kaimasu.",
        "indonesian": "Saya membeli sayur di toko."
      },
      {
        "japanese": "にわで しゃしんを とります。",
        "romaji": "Niwa de shashin o torimasu.",
        "indonesian": "Saya mengambil foto di halaman."
      },
      {
        "japanese": "こうえんで テニスを します。",
        "romaji": "Kouen de tenisu o shimasu.",
        "indonesian": "Saya bermain tenis di taman."
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
        "japanese": "もう ばんごはんを たべましたか。",
        "romaji": "Mou bangohan o tabemashita ka.",
        "indonesian": "Sudahkah makan malam?"
      },
      {
        "japanese": "もう しゅくだいを しましたか。",
        "romaji": "Mou shukudai o shimashita ka.",
        "indonesian": "Sudahkah mengerjakan PR?"
      }
    ]
  },
  {
    "id": "ch06_p04",
    "chapterId": 6,
    "order": 4,
    "pattern": "N に V",
    "explanation": "Partikel に menandai penerima aksi untuk verba seperti あいます (bertemu), かきます (menulis untuk). Menunjukkan kepada siapa aksi ditujukan.",
    "examples": [
      {
        "japanese": "ともだちに あいます。",
        "romaji": "Tomodachi ni aimasu.",
        "indonesian": "Saya bertemu teman."
      },
      {
        "japanese": "ともだちに てがみを かきます。",
        "romaji": "Tomodachi ni tegami o kakimasu.",
        "indonesian": "Saya menulis surat untuk teman."
      }
    ]
  },
  {
    "id": "ch06_p05",
    "chapterId": 6,
    "order": 5,
    "pattern": "N と N を V",
    "explanation": "Partikel と menghubungkan dua nomina dengan arti 'dan'. Digunakan untuk menyebutkan beberapa objek yang menerima aksi yang sama.",
    "examples": [
      {
        "japanese": "パンと たまごを たべます。",
        "romaji": "Pan to tamago o tabemasu.",
        "indonesian": "Saya makan roti dan telur."
      },
      {
        "japanese": "やさいと くだものを かいます。",
        "romaji": "Yasai to kudamono o kaimasu.",
        "indonesian": "Saya membeli sayur dan buah."
      }
    ]
  }
];

// Keep existing quiz (will be updated separately if needed)
console.log('✅ Conversations updated: 10 conversations');
console.log('✅ Grammar updated: 4 grammar points');
console.log('✅ Patterns updated: 5 patterns');
console.log('✅ Quiz: keeping existing 50 questions\n');

// Write updated data
fs.writeFileSync('data/ch06.json', JSON.stringify(ch06, null, 2));

console.log('✅ Chapter 6 updated successfully!');
console.log('\n=== SUMMARY ===');
console.log('- Conversations: 10 (aligned with Minna no Nihongo)');
console.log('- Grammar: 4 points (を, で, もう/まだ, に)');
console.log('- Patterns: 5 patterns');
console.log('- Vocabulary: 77 entries (unchanged)');
console.log('- Quiz: 50 questions (unchanged)');
console.log('\nBackup file: data/ch06.json.backup-minna-update');
