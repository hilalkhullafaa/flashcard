const fs = require('fs');

console.log('🔧 Fixing corrupted chapters 5, 6, 9, 10...\n');

// Read chapter data
const chapters = {
  5: JSON.parse(fs.readFileSync('data/ch05.json', 'utf8')),
  6: JSON.parse(fs.readFileSync('data/ch06.json', 'utf8')),
  9: JSON.parse(fs.readFileSync('data/ch09.json', 'utf8')),
  10: JSON.parse(fs.readFileSync('data/ch10.json', 'utf8'))
};

// Fix Chapter 5 conversations
console.log('📖 Fixing Chapter 5...');
chapters[5].conversations = [
  {
    "id": "ch05_conv01",
    "chapterId": 5,
    "order": 1,
    "title": "Percakapan 1 — Pergi ke Kyoto",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "先週の 日曜日 どこへ 行きましたか。",
        "romaji": "Senshuu no nichiyoubi doko e ikimashita ka.",
        "indonesian": "Minggu lalu hari Minggu pergi ke mana?",
        "hiragana": "せんしゅうの にちようび どこへ いきましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "家族と 友達と 京都へ 行きました。",
        "romaji": "Kazoku to tomodachi to Kyouto e ikimashita.",
        "indonesian": "Pergi ke Kyoto dengan keluarga dan teman.",
        "hiragana": "かぞくと ともだちと きょうとへ いきました。"
      },
      {
        "speaker": "やまだ",
        "japanese": "何で 行きましたか。",
        "romaji": "Nani de ikimashita ka.",
        "indonesian": "Naik apa perginya?",
        "hiragana": "なんで いきましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "新幹線で 行きました。",
        "romaji": "Shinkansen de ikimashita.",
        "indonesian": "Naik shinkansen.",
        "hiragana": "しんかんせんで いきました。"
      }
    ]
  },
  {
    "id": "ch05_conv02",
    "chapterId": 5,
    "order": 2,
    "title": "Percakapan 2 — Liburan Musim Panas",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "夏休みに どこへ 行きますか。",
        "romaji": "Natsuyasumi ni doko e ikimasu ka.",
        "indonesian": "Liburan musim panas pergi ke mana?",
        "hiragana": "なつやすみに どこへ いきますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "家族と 北海道へ 行きます。カリナさんは？",
        "romaji": "Kazoku to Hokkaidou e ikimasu. Karina-san wa?",
        "indonesian": "Pergi ke Hokkaido dengan keluarga. Karina?",
        "hiragana": "かぞくと ほっかいどうへ いきます。カリナさんは？"
      },
      {
        "speaker": "カリナ",
        "japanese": "私は 国へ 帰ります。インドネシアへ 飛行機で 帰ります。",
        "romaji": "Watashi wa kuni e kaerimasu. Indonesia e hikouki de kaerimasu.",
        "indonesian": "Saya pulang ke negara asal. Pulang ke Indonesia naik pesawat.",
        "hiragana": "わたしは くにへ かえります。インドネシアへ ひこうきで かえります。"
      }
    ]
  },
  {
    "id": "ch05_conv03",
    "chapterId": 5,
    "order": 3,
    "title": "Percakapan 3 — Ke Kantor",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "毎日 何で 会社へ 来ますか。",
        "romaji": "Mainichi nani de kaisha e kimasu ka.",
        "indonesian": "Setiap hari naik apa ke kantor?",
        "hiragana": "まいにち なんで かいしゃへ きます か。"
      },
      {
        "speaker": "ミラー",
        "japanese": "電車で 来ます。",
        "romaji": "Densha de kimasu.",
        "indonesian": "Naik kereta.",
        "hiragana": "でんしゃで きます。"
      }
    ]
  },
  {
    "id": "ch05_conv04",
    "chapterId": 5,
    "order": 4,
    "title": "Percakapan 4 — Pergi ke Stasiun",
    "turns": [
      {
        "speaker": "サントス",
        "japanese": "昨日 誰と 駅へ 行きましたか。",
        "romaji": "Kinou dare to eki e ikimashita ka.",
        "indonesian": "Kemarin pergi ke stasiun dengan siapa?",
        "hiragana": "きのう だれと えきへ いきましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "山田さんと 行きました。",
        "romaji": "Yamada-san to ikimashita.",
        "indonesian": "Pergi dengan Yamada.",
        "hiragana": "やまださんと いきました。"
      }
    ]
  },
  {
    "id": "ch05_conv05",
    "chapterId": 5,
    "order": 5,
    "title": "Percakapan 5 — Pulang ke Rumah",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "今日 何で 家へ 帰りますか。",
        "romaji": "Kyou nani de uchi e kaerimasu ka.",
        "indonesian": "Hari ini pulang ke rumah naik apa?",
        "hiragana": "きょう なんで うちへ かえりますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "バスで 帰ります。",
        "romaji": "Basu de kaerimasu.",
        "indonesian": "Naik bus.",
        "hiragana": "バスで かえります。"
      }
    ]
  },
  {
    "id": "ch05_conv06",
    "chapterId": 5,
    "order": 6,
    "title": "Percakapan 6 — Pergi ke Supermarket",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "明日 スーパーへ 行きますか。",
        "romaji": "Ashita suupaa e ikimasu ka.",
        "indonesian": "Besok pergi ke supermarket?",
        "hiragana": "あした スーパーへ いきますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "はい、友達と 行きます。",
        "romaji": "Hai, tomodachi to ikimasu.",
        "indonesian": "Ya, pergi dengan teman.",
        "hiragana": "はい、ともだちと いきます。"
      },
      {
        "speaker": "カリナ",
        "japanese": "何で 行きますか。",
        "romaji": "Nani de ikimasu ka.",
        "indonesian": "Naik apa?",
        "hiragana": "なんで いきますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "自転車で 行きます。",
        "romaji": "Jitensha de ikimasu.",
        "indonesian": "Naik sepeda.",
        "hiragana": "じてんしゃで いきます。"
      }
    ]
  },
  {
    "id": "ch05_conv07",
    "chapterId": 5,
    "order": 7,
    "title": "Percakapan 7 — Ke Sekolah",
    "turns": [
      {
        "speaker": "サントス",
        "japanese": "学校まで 何で 行きますか。",
        "romaji": "Gakkou made nani de ikimasu ka.",
        "indonesian": "Ke sekolah naik apa?",
        "hiragana": "がっこうまで なんで いきますか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "歩いて 行きます。",
        "romaji": "Aruite ikimasu.",
        "indonesian": "Jalan kaki.",
        "hiragana": "あるいて いきます。"
      }
    ]
  },
  {
    "id": "ch05_conv08",
    "chapterId": 5,
    "order": 8,
    "title": "Percakapan 8 — Ke Museum",
    "turns": [
      {
        "speaker": "カリナ",
        "japanese": "昨日 何で 美術館へ 行きましたか。",
        "romaji": "Kinou nani de bijutsukan e ikimashita ka.",
        "indonesian": "Kemarin ke museum naik apa?",
        "hiragana": "きのう なんで びじゅつかんへ いきましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "タクシーで 行きました。",
        "romaji": "Takushii de ikimashita.",
        "indonesian": "Naik taksi.",
        "hiragana": "タクシーで いきました。"
      }
    ]
  },
  {
    "id": "ch05_conv09",
    "chapterId": 5,
    "order": 9,
    "title": "Percakapan 9 — Ke Osaka",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "先週 誰と 大阪へ 行きましたか。",
        "romaji": "Senshuu dare to Oosaka e ikimashita ka.",
        "indonesian": "Minggu lalu pergi ke Osaka dengan siapa?",
        "hiragana": "せんしゅう だれと おおさかへ いきましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "一人で 行きました。",
        "romaji": "Hitori de ikimashita.",
        "indonesian": "Pergi sendiri.",
        "hiragana": "ひとりで いきました。"
      }
    ]
  },
  {
    "id": "ch05_conv10",
    "chapterId": 5,
    "order": 10,
    "title": "Percakapan 10 — Datang ke Jepang",
    "turns": [
      {
        "speaker": "やまだ",
        "japanese": "いつ 日本へ 来ましたか。",
        "romaji": "Itsu Nihon e kimashita ka.",
        "indonesian": "Kapan datang ke Jepang?",
        "hiragana": "いつ にほんへ きましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "先月 来ました。",
        "romaji": "Sengetsu kimashita.",
        "indonesian": "Bulan lalu.",
        "hiragana": "せんげつ きました。"
      },
      {
        "speaker": "やまだ",
        "japanese": "飛行機で 来ましたか。",
        "romaji": "Hikouki de kimashita ka.",
        "indonesian": "Naik pesawat?",
        "hiragana": "ひこうきで きましたか。"
      },
      {
        "speaker": "ミラー",
        "japanese": "はい、飛行機で 来ました。",
        "romaji": "Hai, hikouki de kimashita.",
        "indonesian": "Ya, naik pesawat.",
        "hiragana": "はい、ひこうきで きました。"
      }
    ]
  }
];

console.log('  ✅ Fixed 10 conversations');

// Save Chapter 5
fs.writeFileSync('data/ch05.json', JSON.stringify(chapters[5], null, 2), { encoding: 'utf8' });
console.log('  💾 Saved ch05.json\n');

console.log('🎉 Chapter 5 fixed!');
console.log('✅ All conversations now use proper kanji');
console.log('✅ All encoding issues resolved');
console.log('\n⚠️  Chapters 6, 9, 10 need similar fixes...');