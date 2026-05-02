const fs = require('fs');

console.log('=== FIXING CHAPTER 8 & 10 MATERIALS ===\n');

// Fix Chapter 8
console.log('📖 Fixing Chapter 8...');
const ch8 = JSON.parse(fs.readFileSync('data/ch08.json', 'utf8'));

// Fix grammar explanations
ch8.grammar[2].explanation = "Pola N を ください digunakan untuk meminta atau memesan sesuatu secara sopan. ください berasal dari verba くださる (bentuk hormat dari くれる) dan berarti 'tolong berikan'. Pola ini sangat umum digunakan di toko, restoran, atau saat meminta sesuatu kepada orang lain. Untuk permintaan yang lebih formal, dapat menggunakan おねがいします sebagai pengganti ください.";

// Fix pattern explanations
ch8.patterns[0].explanation = "Pola untuk meminta sesuatu dalam jumlah tertentu. Kata penggolong (counter) diletakkan setelah jumlah dan sebelum ください. Digunakan saat berbelanja atau memesan.";

ch8.patterns[1].explanation = "Pola untuk menanyakan harga suatu barang. いくら (ikura) berarti 'berapa harga'. Digunakan saat berbelanja.";

ch8.patterns[2].explanation = "Pola permintaan dengan kata penggolong spesifik. まい untuk benda tipis/datar (kertas, tiket), ほん untuk benda panjang/silindris (botol, pensil), さつ untuk buku/majalah.";

fs.writeFileSync('data/ch08.json', JSON.stringify(ch8, null, 2), 'utf8');
console.log('✅ Chapter 8 fixed!\n');

// Fix Chapter 10
console.log('📖 Fixing Chapter 10...');
const ch10 = JSON.parse(fs.readFileSync('data/ch10.json', 'utf8'));

// Fix grammar explanations
ch10.grammar[0].explanation = "Dalam bahasa Jepang, verba kemampuan seperti できます (bisa) dan verba pemahaman seperti わかります (mengerti) menggunakan partikel が, bukan を, untuk menandai objeknya. Ini berbeda dari verba aksi biasa yang menggunakan を. Pola ini juga berlaku untuk adjektiva kemampuan seperti じょうず dan へた.";

ch10.grammar[1].explanation = "Bentuk potensial menyatakan kemampuan atau kemungkinan melakukan sesuatu. Untuk verba する (suru), bentuk potensialnya adalah できます (dekimasu). できます juga dapat digunakan secara mandiri dengan nomina + が untuk menyatakan kemampuan umum. Untuk menyatakan 'tidak bisa', gunakan できません.";

ch10.grammar[2].explanation = "Ketiga kata ini adalah adjektiva-na yang menyatakan tingkat kemampuan. じょうず (jouzu) berarti pandai/mahir secara umum, へた (heta) berarti tidak pandai/kurang mahir, dan とくい (tokui) berarti pandai dalam bidang tertentu yang disukai. Saat memodifikasi nomina, tambahkan な sebelum nomina. Saat menjadi predikat, gunakan です.";

// Fix pattern explanations
ch10.patterns[0].explanation = "Pola untuk menyatakan kemampuan melakukan sesuatu. Partikel が (ga) menandai hal yang bisa dilakukan. できます (dekimasu) berarti 'bisa/mampu'. Dapat dimodifikasi dengan すこし (sedikit) atau ぜんぜんできません (sama sekali tidak bisa).";

ch10.patterns[1].explanation = "Pola untuk menyatakan bahwa seseorang pandai atau mahir dalam sesuatu. じょうず (jouzu) adalah adjektiva-na yang berarti 'pandai/mahir'. Kebalikannya adalah へた (heta) yang berarti 'tidak pandai'.";

ch10.patterns[2].explanation = "Pola untuk menyatakan bahwa seseorang mengerti atau memahami sesuatu. わかります (wakarimasu) berarti 'mengerti/memahami'. Partikel が menandai hal yang dimengerti.";

fs.writeFileSync('data/ch10.json', JSON.stringify(ch10, null, 2), 'utf8');
console.log('✅ Chapter 10 fixed!\n');

console.log('=== ALL FIXES COMPLETE ===');
console.log('\n📊 Summary:');
console.log('   Chapter 8: 4 explanations fixed');
console.log('   Chapter 10: 6 explanations fixed');
console.log('   Total: 10 corrupted fields repaired');
