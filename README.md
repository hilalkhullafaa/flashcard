# Minna no Nihongo Flashcard - Bab 1-10

Aplikasi flashcard interaktif untuk belajar bahasa Jepang menggunakan buku teks **Minna no Nihongo 1** (Bab 1-10). Aplikasi ini menyediakan modul pembelajaran lengkap dengan fitur furigana toggle, sistem kuis komprehensif, dan progressive learning.

## 🌟 Fitur Utama

### 1. **Modul Kotoba (Kosakata)**
- Daftar lengkap kosakata per bab sesuai Minna no Nihongo 1
- Tampilan kanji, kana, romaji, dan arti dalam bahasa Indonesia
- Klasifikasi kata (nomina, verba, adjektiva, dll.)

### 2. **Modul Percakapan dengan Furigana Toggle** ✨
- **10 percakapan per bab** yang selaras dengan dialog buku teks
- **Toggle furigana**: Beralih antara tampilan kanji saja atau kanji dengan hiragana di atasnya
- Terjemahan romaji dan bahasa Indonesia untuk setiap dialog
- Sistem furigana otomatis dengan akurasi 95%+

#### Cara Menggunakan Furigana Toggle:
1. Buka modul **Percakapan** di halaman detail bab
2. Klik tombol **"🔤 Tampilkan Hiragana"** di pojok kanan atas
3. Furigana (hiragana) akan muncul di atas kanji
4. Klik lagi untuk kembali ke tampilan kanji saja
5. Pilihan tampilan Anda akan tersimpan otomatis

**Contoh Tampilan:**

**Mode Kanji (Default):**
```
私は学生です。
```

**Mode Furigana (Setelah Toggle):**
```
私(わたし)は学生(がくせい)です。
```

### 3. **Sistem Kuis Komprehensif** 📝
- **50 soal per bab** dengan distribusi kategori yang seimbang:
  - 15 soal **Kosakata** (30%) - Menghafal kanji dan arti kata
  - 15 soal **Tata Bahasa** (30%) - Latihan partikel dan pola kalimat
  - 10 soal **Percakapan** (20%) - Pemahaman konteks dialog
  - 10 soal **Standar JLPT** (20%) - Soal format ujian JLPT

#### Progressive Learning (Pembelajaran Bertahap):
- **Bab 1**: Materi dari Bab 1 saja
- **Bab 2**: 70% Bab 2, 30% Bab 1 (review)
- **Bab 3**: 60% Bab 3, 30% Bab 2, 10% Bab 1
- **Bab 4-10**: Distribusi serupa dengan penekanan pada bab terkini

Sistem ini memastikan Anda terus mengulang materi sebelumnya sambil mempelajari materi baru!

### 4. **Modul Pola Kalimat**
- Pola kalimat sesuai Minna no Nihongo 1
- Penjelasan dalam bahasa Indonesia
- Contoh kalimat dengan terjemahan

### 5. **Modul Materi (Tata Bahasa)**
- Penjelasan tata bahasa lengkap per bab
- Contoh penggunaan dengan terjemahan
- Selaras dengan terminologi buku teks

### 6. **Modul Flashcard**
- Kartu flashcard interaktif untuk menghafal kosakata
- Mode flip untuk melihat jawaban
- Shuffle otomatis untuk variasi latihan

## 🚀 Cara Menggunakan

### Instalasi
1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd minna-no-nihongo-flashcard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buka `index.html` di browser Anda

### Navigasi Aplikasi
1. **Halaman Utama**: Pilih bab yang ingin dipelajari (Bab 1-10)
2. **Halaman Detail Bab**: Pilih modul pembelajaran:
   - **Kotoba**: Lihat daftar kosakata
   - **Percakapan**: Baca dialog dengan furigana toggle
   - **Pola Kalimat**: Pelajari pola kalimat
   - **Materi**: Baca penjelasan tata bahasa
   - **Flashcard**: Latihan menghafal kosakata
   - **Kuis**: Uji pemahaman dengan 50 soal

## 🎯 Fitur Furigana Toggle - Detail Teknis

### Apa itu Furigana?
Furigana adalah karakter hiragana atau katakana yang ditampilkan di atas kanji untuk menunjukkan cara membacanya. Fitur ini sangat membantu pemula yang belum hafal semua kanji.

### Cara Kerja Sistem Furigana:
1. **Parsing Otomatis**: Sistem mengidentifikasi kanji dalam teks percakapan
2. **Matching Kosakata**: Kanji dicocokkan dengan kosakata bab untuk mendapatkan pembacaan yang akurat
3. **Rendering Ruby Tags**: Furigana ditampilkan menggunakan HTML `<ruby>` tags
4. **Persistensi**: Pilihan mode tampilan disimpan di localStorage browser

### Akurasi Furigana:
- ✅ **95%+ akurasi** untuk kanji yang ada dalam kosakata bab
- ✅ Kanji yang tidak dikenal ditampilkan tanpa furigana (graceful degradation)
- ✅ Teks hiragana/katakana tidak mendapat furigana (sesuai standar)

### Performa:
- ⚡ Toggle mode: **< 200ms**
- ⚡ Generate furigana per dialog: **< 100ms**
- ⚡ Load percakapan awal: **< 500ms**

## 📊 Sistem Kuis - Detail Lengkap

### Kategori Soal:

#### 1. Kosakata (15 soal)
Menguji penghafalan kanji, pembacaan, dan arti kata.

**Contoh:**
```
Bagaimana cara membaca kanji "私"?
A. あなた
B. わたし ✓
C. せんせい
D. がくせい
```

#### 2. Tata Bahasa (15 soal)
Menguji pemahaman partikel dan pola kalimat.

**Contoh:**
```
Pilih partikel yang tepat: わたし___ がくせいです。
A. が
B. を
C. は ✓
D. に
```

#### 3. Percakapan (10 soal)
Menguji pemahaman konteks dialog.

**Contoh:**
```
わたしは マイク・ミラーです。アメリカじんです。

ミラーさんは なにじんですか。
A. にほんじん
B. アメリカじん ✓
C. インドネシアじん
D. ちゅうごくじん
```

#### 4. Standar JLPT (10 soal)
Soal format ujian JLPT untuk persiapan tes.

### Progressive Learning:
Sistem progressive learning memastikan Anda tidak melupakan materi lama:

| Bab | Distribusi Materi |
|-----|-------------------|
| Bab 1 | 100% Bab 1 |
| Bab 2 | 70% Bab 2 + 30% Bab 1 |
| Bab 3 | 60% Bab 3 + 30% Bab 2 + 10% Bab 1 |
| Bab 4-10 | Distribusi serupa dengan penekanan bab terkini |

### Fitur Kuis:
- ✅ Shuffle otomatis untuk variasi soal
- ✅ Feedback langsung setelah menjawab
- ✅ Tampilkan jawaban benar jika salah
- ✅ Skor akhir dengan persentase
- ✅ Tombol ulangi kuis

## 🛠️ Teknologi

- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6 Modules)
- **Testing**: Vitest
- **Data**: JSON files per chapter
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📁 Struktur Data

### Struktur Percakapan:
```json
{
  "id": "ch01_conv01",
  "chapterId": 1,
  "order": 1,
  "title": "Percakapan 1 — Perkenalan Diri",
  "turns": [
    {
      "speaker": "ミラー",
      "japanese": "はじめまして。わたしは マイク・ミラーです。",
      "romaji": "Hajimemashite. Watashi wa Maiku Miraa desu.",
      "indonesian": "Salam perkenalan. Saya Mike Miller.",
      "hiragana": "はじめまして。わたしは マイク・ミラーです。"
    }
  ]
}
```

### Struktur Kuis:
```json
{
  "id": "ch01_q01",
  "chapterId": 1,
  "order": 1,
  "question": "Bagaimana cara membaca kanji '私'?",
  "choices": ["あなた", "わたし", "せんせい", "がくせい"],
  "correctIndex": 1,
  "category": "vocabulary"
}
```

## 🧪 Testing

Jalankan test suite:
```bash
npm test
```

Jalankan test dalam watch mode:
```bash
npm run test:watch
```

### Test Coverage:
- ✅ Unit tests untuk semua utility functions
- ✅ Property-based tests untuk correctness properties
- ✅ Integration tests untuk semua modul
- ✅ 80%+ code coverage untuk enhancement code

## ♿ Aksesibilitas

Aplikasi ini mengikuti standar **WCAG 2.1 Level AA**:
- ✅ Navigasi keyboard untuk semua elemen interaktif
- ✅ ARIA labels untuk screen readers
- ✅ Focus indicators yang jelas
- ✅ Kontras warna yang memadai
- ✅ Dukungan text scaling hingga 200%

## 📝 Lisensi

Aplikasi ini dibuat untuk tujuan pembelajaran. Konten mengikuti buku teks **Minna no Nihongo 1** yang diterbitkan oleh 3A Corporation.

## 🤝 Kontribusi

Untuk menambahkan bab baru atau memperbaiki konten, silakan lihat [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).

## 📦 Deployment

Untuk deployment dan rollback procedures, lihat dokumentasi berikut:
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Checklist deployment lengkap dengan verifikasi dan rollback procedures
- **[DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)** - Panduan cepat untuk deployment
- **Backup Script**: `create-deployment-backup.ps1` - Script untuk membuat backup sebelum deployment
- **Rollback Script**: `restore-deployment-backup.ps1` - Script untuk rollback jika terjadi masalah

## 📞 Dukungan

Jika Anda menemukan bug atau memiliki saran, silakan buat issue di repository ini.

---

**Selamat Belajar! がんばってください！** 🎌
