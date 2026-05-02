# Chapter 8 & 10 Materials Fix Report

**Date**: May 3, 2026  
**Issue**: Corrupted characters (?) in grammar and pattern explanations  
**Status**: ✅ **FIXED**

---

## Issues Found

### Chapter 8 - 牛乳を 1本 ください
**Location**: Grammar and Patterns sections  
**Problem**: Corrupted Japanese characters displayed as `?` symbols

**Affected Fields**:
1. Grammar #3 explanation (N を ください)
2. Pattern #1 explanation (N を N ください)
3. Pattern #2 explanation (N は いくらですか)
4. Pattern #3 explanation (N を N まい／ほん／さつ ください)

### Chapter 10 - 日本語が 話せます
**Location**: Grammar and Patterns sections  
**Problem**: Corrupted Japanese characters displayed as `?` symbols

**Affected Fields**:
1. Grammar #1 explanation (Partikel が)
2. Grammar #2 explanation (Bentuk Potensial)
3. Grammar #3 explanation (Adjektiva-na: じょうず・へた・とくい)
4. Pattern #1 explanation (N が できます)
5. Pattern #2 explanation (N が じょうずです)
6. Pattern #3 explanation (N が わかります)

---

## Fixes Applied

### Chapter 8 Corrections

#### Grammar #3: Pola N を ください
**Before**: `Pola N ?? くだ?? digunakan untuk meminta...`  
**After**: `Pola N を ください digunakan untuk meminta atau memesan sesuatu secara sopan. ください berasal dari verba くださる (bentuk hormat dari くれる) dan berarti 'tolong berikan'. Pola ini sangat umum digunakan di toko, restoran, atau saat meminta sesuatu kepada orang lain. Untuk permintaan yang lebih formal, dapat menggunakan おねがいします sebagai pengganti ください.`

#### Pattern #1: N を N ください
**Before**: `Pola untuk meminta sesuatu dalam jumlah tertentu. Kata penggolong (counter) diletakkan setelah jumlah dan sebelum くだ??.`  
**After**: `Pola untuk meminta sesuatu dalam jumlah tertentu. Kata penggolong (counter) diletakkan setelah jumlah dan sebelum ください. Digunakan saat berbelanja atau memesan.`

#### Pattern #2: N は いくらですか
**Before**: `Pola untuk menanyakan harga suatu barang. ?く?? (ikura) berarti 'berapa harga'.`  
**After**: `Pola untuk menanyakan harga suatu barang. いくら (ikura) berarti 'berapa harga'. Digunakan saat berbelanja.`

#### Pattern #3: N を N まい／ほん／さつ ください
**Before**: `Pola permintaan dengan kata penggolong spesifik. ま? untuk benda tipis/datar...`  
**After**: `Pola permintaan dengan kata penggolong spesifik. まい untuk benda tipis/datar (kertas, tiket), ほん untuk benda panjang/silindris (botol, pensil), さつ untuk buku/majalah.`

---

### Chapter 10 Corrections

#### Grammar #1: Partikel が
**Before**: `Dalam bahasa Jepang, verba kemampuan seperti できま? (bisa) dan verba pemahaman seperti ????ま? (mengerti) menggunakan partikel ?, bukan ??...`  
**After**: `Dalam bahasa Jepang, verba kemampuan seperti できます (bisa) dan verba pemahaman seperti わかります (mengerti) menggunakan partikel が, bukan を, untuk menandai objeknya. Ini berbeda dari verba aksi biasa yang menggunakan を. Pola ini juga berlaku untuk adjektiva kemampuan seperti じょうず dan へた.`

#### Grammar #2: Bentuk Potensial
**Before**: `Bentuk potensial menyatakan kemampuan atau kemungkinan melakukan sesuatu. Untuk verba ??? (suru), bentuk potensialnya adalah できま? (dekimasu)...`  
**After**: `Bentuk potensial menyatakan kemampuan atau kemungkinan melakukan sesuatu. Untuk verba する (suru), bentuk potensialnya adalah できます (dekimasu). できます juga dapat digunakan secara mandiri dengan nomina + が untuk menyatakan kemampuan umum. Untuk menyatakan 'tidak bisa', gunakan できません.`

#### Grammar #3: Adjektiva-na
**Before**: `Ketiga kata ini adalah adjektiva-na yang menyatakan tingkat kemampuan. ????? (jouzu) berarti pandai/mahir secara umum, へ? (heta) berarti tidak pandai...`  
**After**: `Ketiga kata ini adalah adjektiva-na yang menyatakan tingkat kemampuan. じょうず (jouzu) berarti pandai/mahir secara umum, へた (heta) berarti tidak pandai/kurang mahir, dan とくい (tokui) berarti pandai dalam bidang tertentu yang disukai. Saat memodifikasi nomina, tambahkan な sebelum nomina. Saat menjadi predikat, gunakan です.`

#### Pattern #1: N が できます
**Before**: `Pola untuk menyatakan kemampuan melakukan sesuatu. Partikel ? (ga) menandai hal yang bisa dilakukan. できま? (dekimasu) berarti 'bisa/mampu'...`  
**After**: `Pola untuk menyatakan kemampuan melakukan sesuatu. Partikel が (ga) menandai hal yang bisa dilakukan. できます (dekimasu) berarti 'bisa/mampu'. Dapat dimodifikasi dengan すこし (sedikit) atau ぜんぜんできません (sama sekali tidak bisa).`

#### Pattern #2: N が じょうずです
**Before**: `Pola untuk menyatakan bahwa seseorang pandai atau mahir dalam sesuatu. ????? (jouzu) adalah adjektiva-na...`  
**After**: `Pola untuk menyatakan bahwa seseorang pandai atau mahir dalam sesuatu. じょうず (jouzu) adalah adjektiva-na yang berarti 'pandai/mahir'. Kebalikannya adalah へた (heta) yang berarti 'tidak pandai'.`

#### Pattern #3: N が わかります
**Before**: `Pola untuk menyatakan bahwa seseorang mengerti atau memahami sesuatu. ????ま? (wakarimasu) berarti 'mengerti/memahami'...`  
**After**: `Pola untuk menyatakan bahwa seseorang mengerti atau memahami sesuatu. わかります (wakarimasu) berarti 'mengerti/memahami'. Partikel が menandai hal yang dimengerti.`

---

## Verification Results

### Quality Check Status
✅ **Chapter 8**: NO ISSUES FOUND - Chapter is clean!  
✅ **Chapter 10**: NO ISSUES FOUND - Chapter is clean!

### Characters Fixed
- **を** (particle wo) - restored in all instances
- **ください** (kudasai) - restored in all instances
- **いくら** (ikura) - restored
- **まい** (mai) - restored
- **ほん** (hon) - restored
- **さつ** (satsu) - restored
- **できます** (dekimasu) - restored in all instances
- **わかります** (wakarimasu) - restored
- **が** (particle ga) - restored in all instances
- **する** (suru) - restored
- **できません** (dekimasen) - restored
- **じょうず** (jouzu) - restored in all instances
- **へた** (heta) - restored in all instances
- **とくい** (tokui) - restored
- **です** (desu) - restored
- **すこし** (sukoshi) - restored
- **ぜんぜん** (zenzen) - restored
- **おねがいします** (onegaishimasu) - restored

---

## Summary

**Total Corrupted Fields**: 10  
**Chapter 8**: 4 explanations fixed  
**Chapter 10**: 6 explanations fixed  

**Status**: ✅ All corrupted characters have been successfully restored  
**Data Integrity**: ✅ Maintained - no vocabulary modifications  
**Textbook Alignment**: ✅ All explanations now accurately reflect Minna no Nihongo 1 standards

---

## Next Steps

1. ✅ Verify all chapters 1-10 are corruption-free
2. ✅ Run comprehensive quality check
3. ✅ Update spec completion status
4. ✅ Ready for production use

---

**Fix Script**: `fix-ch8-ch10-materials.cjs`  
**Verification**: `comprehensive-quality-check.cjs`  
**Report Generated**: May 3, 2026
