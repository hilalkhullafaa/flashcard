const fs = require('fs');
const path = require('path');

console.log('🔧 Reconstructing corrupted chapters 6, 8, 10...\n');

// Read Chapter 7 as clean template
const ch07 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'ch07.json'), 'utf8'));

// Chapter 6 reconstruction
function reconstructChapter6() {
  console.log('=== Reconstructing Chapter 6 ===');
  
  const ch06 = {
    "chapter": {
      "id": 6,
      "title": "毎朝 6時に 起きます",
      "titleRomaji": "Maiasa rokuji ni okimasu",
      "titleId": "Saya bangun jam 6 setiap pagi"
    },
    "vocabulary": [
      {"id": "ch06_001", "chapterId": 6, "order": 1, "kanji": "食べます", "kana": "たべます", "romaji": "tabemasu", "wordClass": "verba", "meaning": "makan"},
      {"id": "ch06_002", "chapterId": 6, "order": 2, "kanji": "飲みます", "kana": "のみます", "romaji": "nomimasu", "wordClass": "verba", "meaning": "minum"},
      {"id": "ch06_003", "chapterId": 6, "order": 3, "kanji": "見ます", "kana": "みます", "romaji": "mimasu", "wordClass": "verba", "meaning": "melihat, menonton"},
      {"id": "ch06_004", "chapterId": 6, "order": 4, "kanji": "聞きます", "kana": "ききます", "romaji": "kikimasu", "wordClass": "verba", "meaning": "mendengar"},
      {"id": "ch06_005", "chapterId": 6, "order": 5, "kanji": "読みます", "kana": "よみます", "romaji": "yomimasu", "wordClass": "verba", "meaning": "membaca"},
      {"id": "ch06_006", "chapterId": 6, "order": 6, "kanji": "書きます", "kana": "かきます", "romaji": "kakimasu", "wordClass": "verba", "meaning": "menulis"},
      {"id": "ch06_007", "chapterId": 6, "order": 7, "kanji": "買います", "kana": "かいます", "romaji": "kaimasu", "wordClass": "verba", "meaning": "membeli"},
      {"id": "ch06_008", "chapterId": 6, "order": 8, "kanji": "撮ります", "kana": "とります", "romaji": "torimasu", "wordClass": "verba", "meaning": "mengambil (foto)"},
      {"id": "ch06_009", "chapterId": 6, "order": 9, "kanji": "します", "kana": "します", "romaji": "shimasu", "wordClass": "verba", "meaning": "melakukan"},
      {"id": "ch06_010", "chapterId": 6, "order": 10, "kanji": "会います", "kana": "あいます", "romaji": "aimasu", "wordClass": "verba", "meaning": "bertemu"}
    ],
    "conversations": [
      {
        "id": "ch06_conv01",
        "chapterId": 6,
        "order": 1,
        "title": "Percakapan 1 — Sarapan Pagi",
        "turns": [
          {"speaker": "山田", "japanese": "ミラーさんは 毎朝 何を 食べますか。", "romaji": "Miraa-san wa maiasa nani o tabemasu ka.", "indonesian": "Tuan Miller, setiap pagi makan apa?", "hiragana": "ミラーさんは まいあさ なにを たべますか。"},
          {"speaker": "ミラー", "japanese": "パンと 卵を 食べます。コーヒーも 飲みます。", "romaji": "Pan to tamago o tabemasu. Koohii mo nomimasu.", "indonesian": "Saya makan roti dan telur. Minum kopi juga.", "hiragana": "パンと たまごを たべます。コーヒーも のみます。"}
        ]
      },
      {
        "id": "ch06_conv02",
        "chapterId": 6,
        "order": 2,
        "title": "Percakapan 2 — Sudah Makan?",
        "turns": [
          {"speaker": "カリナ", "japanese": "もう 昼ごはんを 食べましたか。", "romaji": "Mou hirugohan o tabemashita ka.", "indonesian": "Sudah makan siang?", "hiragana": "もう ひるごはんを たべましたか。"},
          {"speaker": "ミラー", "japanese": "いいえ、まだです。", "romaji": "Iie, mada desu.", "indonesian": "Belum.", "hiragana": "いいえ、まだです。"}
        ]
      }
    ],
    "grammar": [
      {
        "id": "ch06_g01",
        "chapterId": 6,
        "order": 1,
        "title": "Partikel を — Penanda Objek",
        "explanation": "Partikel を (dibaca 'o') menandai objek langsung dari verba transitif.",
        "examples": [
          {"japanese": "パンを 食べます。", "romaji": "Pan o tabemasu.", "indonesian": "Makan roti."},
          {"japanese": "コーヒーを 飲みます。", "romaji": "Koohii o nomimasu.", "indonesian": "Minum kopi."}
        ]
      }
    ],
    "patterns": [
      {
        "id": "ch06_p01",
        "chapterId": 6,
        "order": 1,
        "pattern": "N を V",
        "explanation": "Partikel を menandai objek langsung.",
        "examples": [
          {"japanese": "本を 読みます。", "romaji": "Hon o yomimasu.", "indonesian": "Membaca buku."}
        ]
      }
    ],
    "quiz": []
  };
  
  fs.writeFileSync(path.join(__dirname, 'data', 'ch06.json'), JSON.stringify(ch06, null, 2), 'utf8');
  console.log('✓ Chapter 6 reconstructed\n');
}

// Chapter 8 reconstruction
function reconstructChapter8() {
  console.log('=== Reconstructing Chapter 8 ===');
  
  const ch08 = {
    "chapter": {
      "id": 8,
      "title": "そろそろ 失礼します",
      "titleRomaji": "Sorosoro shitsurei shimasu",
      "titleId": "Saya permisi dulu"
    },
    "vocabulary": [
      {"id": "ch08_001", "chapterId": 8, "order": 1, "kanji": "ハンサム", "kana": "ハンサム", "romaji": "hansamu", "wordClass": "adjektiva-na", "meaning": "tampan"},
      {"id": "ch08_002", "chapterId": 8, "order": 2, "kanji": "きれい", "kana": "きれい", "romaji": "kirei", "wordClass": "adjektiva-na", "meaning": "cantik, bersih"},
      {"id": "ch08_003", "chapterId": 8, "order": 3, "kanji": "静か", "kana": "しずか", "romaji": "shizuka", "wordClass": "adjektiva-na", "meaning": "tenang"},
      {"id": "ch08_004", "chapterId": 8, "order": 4, "kanji": "にぎやか", "kana": "にぎやか", "romaji": "nigiyaka", "wordClass": "adjektiva-na", "meaning": "ramai"},
      {"id": "ch08_005", "chapterId": 8, "order": 5, "kanji": "有名", "kana": "ゆうめい", "romaji": "yuumei", "wordClass": "adjektiva-na", "meaning": "terkenal"}
    ],
    "conversations": [
      {
        "id": "ch08_conv01",
        "chapterId": 8,
        "order": 1,
        "title": "Percakapan 1 — Kota yang Ramai",
        "turns": [
          {"speaker": "山田", "japanese": "東京は どんな 町ですか。", "romaji": "Toukyou wa donna machi desu ka.", "indonesian": "Tokyo kota seperti apa?", "hiragana": "とうきょうは どんな まちですか。"},
          {"speaker": "ミラー", "japanese": "にぎやかな 町です。", "romaji": "Nigiyaka na machi desu.", "indonesian": "Kota yang ramai.", "hiragana": "にぎやかな まちです。"}
        ]
      }
    ],
    "grammar": [
      {
        "id": "ch08_g01",
        "chapterId": 8,
        "order": 1,
        "title": "Adjektiva-na",
        "explanation": "Adjektiva-na menggunakan な sebelum nomina.",
        "examples": [
          {"japanese": "きれいな 花です。", "romaji": "Kirei na hana desu.", "indonesian": "Bunga yang cantik."}
        ]
      }
    ],
    "patterns": [
      {
        "id": "ch08_p01",
        "chapterId": 8,
        "order": 1,
        "pattern": "Adj-na な N",
        "explanation": "Adjektiva-na + な + nomina",
        "examples": [
          {"japanese": "静かな 部屋", "romaji": "Shizuka na heya", "indonesian": "Kamar yang tenang"}
        ]
      }
    ],
    "quiz": []
  };
  
  fs.writeFileSync(path.join(__dirname, 'data', 'ch08.json'), JSON.stringify(ch08, null, 2), 'utf8');
  console.log('✓ Chapter 8 reconstructed\n');
}

// Chapter 10 reconstruction
function reconstructChapter10() {
  console.log('=== Reconstructing Chapter 10 ===');
  
  const ch10 = {
    "chapter": {
      "id": 10,
      "title": "あそこに コンビニが あります",
      "titleRomaji": "Asoko ni konbini ga arimasu",
      "titleId": "Di sana ada minimarket"
    },
    "vocabulary": [
      {"id": "ch10_001", "chapterId": 10, "order": 1, "kanji": "あります", "kana": "あります", "romaji": "arimasu", "wordClass": "verba", "meaning": "ada (benda mati)"},
      {"id": "ch10_002", "chapterId": 10, "order": 2, "kanji": "います", "kana": "います", "romaji": "imasu", "wordClass": "verba", "meaning": "ada (makhluk hidup)"},
      {"id": "ch10_003", "chapterId": 10, "order": 3, "kanji": "いろいろ", "kana": "いろいろ", "romaji": "iroiro", "wordClass": "adjektiva-na", "meaning": "bermacam-macam"},
      {"id": "ch10_004", "chapterId": 10, "order": 4, "kanji": "男の人", "kana": "おとこのひと", "romaji": "otoko no hito", "wordClass": "nomina", "meaning": "laki-laki"},
      {"id": "ch10_005", "chapterId": 10, "order": 5, "kanji": "女の人", "kana": "おんなのひと", "romaji": "onna no hito", "wordClass": "nomina", "meaning": "perempuan"}
    ],
    "conversations": [
      {
        "id": "ch10_conv01",
        "chapterId": 10,
        "order": 1,
        "title": "Percakapan 1 — Ada Minimarket",
        "turns": [
          {"speaker": "山田", "japanese": "あそこに 何が ありますか。", "romaji": "Asoko ni nani ga arimasu ka.", "indonesian": "Di sana ada apa?", "hiragana": "あそこに なにが ありますか。"},
          {"speaker": "ミラー", "japanese": "コンビニが あります。", "romaji": "Konbini ga arimasu.", "indonesian": "Ada minimarket.", "hiragana": "コンビニが あります。"}
        ]
      }
    ],
    "grammar": [
      {
        "id": "ch10_g01",
        "chapterId": 10,
        "order": 1,
        "title": "Partikel が — Keberadaan",
        "explanation": "Partikel が menandai subjek dalam kalimat keberadaan.",
        "examples": [
          {"japanese": "机の 上に 本が あります。", "romaji": "Tsukue no ue ni hon ga arimasu.", "indonesian": "Di atas meja ada buku."}
        ]
      }
    ],
    "patterns": [
      {
        "id": "ch10_p01",
        "chapterId": 10,
        "order": 1,
        "pattern": "N に N が あります/います",
        "explanation": "Menyatakan keberadaan benda atau orang di suatu tempat.",
        "examples": [
          {"japanese": "部屋に 人が います。", "romaji": "Heya ni hito ga imasu.", "indonesian": "Di kamar ada orang."}
        ]
      }
    ],
    "quiz": []
  };
  
  fs.writeFileSync(path.join(__dirname, 'data', 'ch10.json'), JSON.stringify(ch10, null, 2), 'utf8');
  console.log('✓ Chapter 10 reconstructed\n');
}

// Execute reconstruction
reconstructChapter6();
reconstructChapter8();
reconstructChapter10();

console.log('✅ All chapters reconstructed!');
console.log('\nVerifying JSON validity...');

['ch06', 'ch08', 'ch10'].forEach(ch => {
  try {
    JSON.parse(fs.readFileSync(path.join(__dirname, 'data', ch + '.json'), 'utf8'));
    console.log(`${ch}: ✅ Valid JSON`);
  } catch (e) {
    console.log(`${ch}: ❌ ${e.message}`);
  }
});
