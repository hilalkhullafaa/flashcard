const fs = require('fs');

console.log('=== COMPREHENSIVE CORRUPTION FIX FOR CHAPTERS 6, 8, 9, 10 ===\n');

// Read all chapter files
const ch06 = JSON.parse(fs.readFileSync('data/ch06.json', 'utf8'));
const ch08 = JSON.parse(fs.readFileSync('data/ch08.json', 'utf8'));
const ch09 = JSON.parse(fs.readFileSync('data/ch09.json', 'utf8'));
const ch10 = JSON.parse(fs.readFileSync('data/ch10.json', 'utf8'));

let totalFixed = 0;

// ============================================================================
// CHAPTER 6 FIXES (28 issues)
// ============================================================================
console.log('Fixing Chapter 6 (28 issues)...');

// Fix conversation 1
ch06.conversations[0].title = "Percakapan 1 — Kegiatan Sehari-hari";
ch06.conversations[0].turns[0].speaker = "やまだ";
ch06.conversations[0].turns[0].japanese = "ミラーさんは まいあさ なにを たべますか。";
ch06.conversations[0].turns[0].hiragana = "ミラーさんは まいあさ なにを たべますか。";

ch06.conversations[0].turns[1].japanese = "パンと たまごを たべます。コーヒーも のみます。やまださんは？";
ch06.conversations[0].turns[1].hiragana = "パンと たまごを たべます。コーヒーも のみます。やまださんは？";

ch06.conversations[0].turns[2].speaker = "やまだ";
ch06.conversations[0].turns[2].japanese = "私は ごはんと みそしるを たべます。";
ch06.conversations[0].turns[2].hiragana = "わたしは ごはんと みそしるを たべます。";

// Fix conversation 2
ch06.conversations[1].title = "Percakapan 2 — Sudah Makan?";
ch06.conversations[1].turns[0].japanese = "もう ひるごはんを たべましたか。";
ch06.conversations[1].turns[0].hiragana = "もう ひるごはんを たべましたか。";

ch06.conversations[1].turns[1].japanese = "いいえ、まだです。カリナさんは？";
ch06.conversations[1].turns[1].hiragana = "いいえ、まだです。カリナさんは？";

ch06.conversations[1].turns[2].japanese = "私も まだです。いっしょに しょくどうへ いきませんか。";
ch06.conversations[1].turns[2].hiragana = "わたしも まだです。いっしょに しょくどうへ いきませんか。";

ch06.conversations[1].turns[3].japanese = "いいですね。いきましょう。";
ch06.conversations[1].turns[3].hiragana = "いいですね。いきましょう。";

// Fix grammar examples
ch06.grammar[0].examples[0].japanese = "私は まいあさ パンを たべます。";
ch06.grammar[0].examples[1].japanese = "コーヒーを のみます。";

ch06.grammar[1].title = "Partikel で — Tempat Kegiatan";
ch06.grammar[1].examples[0].japanese = "うちで テレビを みます。";
ch06.grammar[1].examples[1].japanese = "としょかんで ほんを よみます。";

ch06.grammar[2].title = "Pola もう V ました / まだ V ていません";
ch06.grammar[2].examples[0].japanese = "もう ばんごはんを たべましたか。 — はい、もう たべました。";
ch06.grammar[2].examples[1].japanese = "もう しゅくだいを しましたか。 — いいえ、まだ していません。";

// Fix pattern examples
ch06.patterns[0].examples[0].japanese = "私は まいあさ パンを たべます。";
ch06.patterns[0].examples[1].japanese = "コーヒーを のみます。";

ch06.patterns[1].examples[0].japanese = "うちで テレビを みます。";
ch06.patterns[1].examples[1].japanese = "としょかんで ほんを よみます。";

ch06.patterns[2].pattern = "もう V ました";
ch06.patterns[2].examples[0].japanese = "もう ばんごはんを たべましたか。";
ch06.patterns[2].examples[1].japanese = "もう しゅくだいを しましたか。";

ch06.patterns[3].pattern = "まだ V ていません";
ch06.patterns[3].examples[0].japanese = "まだ たべていません。";
ch06.patterns[3].examples[1].japanese = "まだ しゅくだいを していません。";

totalFixed += 28;
console.log('✓ Chapter 6: Fixed 28 issues');

// ============================================================================
// CHAPTER 8 FIXES (17 issues)
// ============================================================================
console.log('Fixing Chapter 8 (17 issues)...');

// Fix chapter title
ch08.chapter.title = "牛乳を 1本 ください";

// Fix grammar examples
ch08.grammar[0].examples[0].japanese = "牛乳を 1本 ください。";
ch08.grammar[0].examples[1].japanese = "きってを 5まい ください。";

ch08.grammar[1].examples[0].japanese = "りんごを みっつ ください。";
ch08.grammar[1].examples[1].japanese = "たまごが ふたつ あります。";

ch08.grammar[2].title = "Pola N を ください — Meminta Sesuatu";
ch08.grammar[2].examples[0].japanese = "みずを ください。";
ch08.grammar[2].examples[1].japanese = "この ざっしを 2さつ ください。";

// Fix pattern examples
ch08.patterns[0].pattern = "N を N ください";
ch08.patterns[0].examples[0].japanese = "牛乳を 1本 ください。";
ch08.patterns[0].examples[1].japanese = "りんごを みっつ ください。";

ch08.patterns[1].pattern = "N は いくらですか";
ch08.patterns[1].examples[0].japanese = "この りんごは いくらですか。";
ch08.patterns[1].examples[1].japanese = "この ほんは いくらですか。";

ch08.patterns[2].pattern = "N を N まい／ほん／さつ ください";
ch08.patterns[2].examples[0].japanese = "きってを 5まい ください。";
ch08.patterns[2].examples[1].japanese = "ざっしを 2さつ ください。";

totalFixed += 17;
console.log('✓ Chapter 8: Fixed 17 issues');

// ============================================================================
// CHAPTER 9 FIXES (1 issue)
// ============================================================================
console.log('Fixing Chapter 9 (1 issue)...');

// Fix grammar example
ch09.grammar[1].examples[1].japanese = "日本の お正月は 1月です。";

totalFixed += 1;
console.log('✓ Chapter 9: Fixed 1 issue');

// ============================================================================
// CHAPTER 10 FIXES (26 issues)
// ============================================================================
console.log('Fixing Chapter 10 (26 issues)...');

// Fix chapter title
ch10.chapter.title = "日本語が 話せます";

// Fix conversation 1
ch10.conversations[0].turns[0].speaker = "やまだ";
ch10.conversations[0].turns[0].japanese = "ミラーさんは 日本語が じょうずですね。";
ch10.conversations[0].turns[0].hiragana = "ミラーさんは にほんごが じょうずですね。";

ch10.conversations[0].turns[1].japanese = "いいえ、まだまだです。すこし はなせますが、かんじは あまり わかりません。";
ch10.conversations[0].turns[1].hiragana = "いいえ、まだまだです。すこし はなせますが、かんじは あまり わかりません。";

ch10.conversations[0].turns[2].speaker = "やまだ";
ch10.conversations[0].turns[2].japanese = "ひらがなと カタカナは よめますか。";
ch10.conversations[0].turns[2].hiragana = "ひらがなと カタカナは よめますか。";

ch10.conversations[0].turns[3].japanese = "はい、よめます。でも かくのは むずかしいです。";
ch10.conversations[0].turns[3].hiragana = "はい、よめます。でも かくのは むずかしいです。";

// Fix conversation 2
ch10.conversations[1].turns[0].japanese = "ミラーさんは ピアノが できますか。";
ch10.conversations[1].turns[0].hiragana = "ミラーさんは ピアノが できますか。";

ch10.conversations[1].turns[1].japanese = "はい、すこし できます。カリナさんは？";
ch10.conversations[1].turns[1].hiragana = "はい、すこし できます。カリナさんは？";

ch10.conversations[1].turns[2].japanese = "私は ギターが すこし ひけます。でも うたは にがてです。";
ch10.conversations[1].turns[2].hiragana = "わたしは ギターが すこし ひけます。でも うたは にがてです。";

// Fix grammar examples
ch10.grammar[0].examples[0].japanese = "日本語が わかります。";
ch10.grammar[0].examples[1].japanese = "運転が できます。";

ch10.grammar[1].examples[0].japanese = "日本語が すこし はなせます。";
ch10.grammar[1].examples[1].japanese = "ピアノが できます。";

ch10.grammar[2].title = "Adjektiva-na: じょうず・へた・とくい";
ch10.grammar[2].examples[0].japanese = "ミラーさんは 日本語が じょうずです。";
ch10.grammar[2].examples[1].japanese = "私は 料理が とくいです。";

// Fix pattern examples
ch10.patterns[0].pattern = "N が できます";
ch10.patterns[0].examples[0].japanese = "日本語が すこし はなせます。";
ch10.patterns[0].examples[1].japanese = "運転が できます。";

ch10.patterns[1].pattern = "N が じょうずです";
ch10.patterns[1].examples[0].japanese = "ミラーさんは 日本語が じょうずです。";
ch10.patterns[1].examples[1].japanese = "私は 料理が じょうずです。";

ch10.patterns[2].pattern = "N が わかります";
ch10.patterns[2].examples[0].japanese = "漢字が すこし わかります。";
ch10.patterns[2].examples[1].japanese = "英語が わかりますか。";

totalFixed += 26;
console.log('✓ Chapter 10: Fixed 26 issues');

// ============================================================================
// SAVE ALL FILES
// ============================================================================
console.log('\nSaving fixed files...');

fs.writeFileSync('data/ch06.json', JSON.stringify(ch06, null, 2), 'utf8');
console.log('✓ Saved ch06.json');

fs.writeFileSync('data/ch08.json', JSON.stringify(ch08, null, 2), 'utf8');
console.log('✓ Saved ch08.json');

fs.writeFileSync('data/ch09.json', JSON.stringify(ch09, null, 2), 'utf8');
console.log('✓ Saved ch09.json');

fs.writeFileSync('data/ch10.json', JSON.stringify(ch10, null, 2), 'utf8');
console.log('✓ Saved ch10.json');

console.log('\n=== SUMMARY ===');
console.log(`Total issues fixed: ${totalFixed}`);
console.log('All corruption issues have been resolved!');
console.log('\nPlease run comprehensive-quality-check.cjs again to verify.');
