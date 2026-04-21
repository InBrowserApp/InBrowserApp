## Apa itu MurmurHash3 (x86 32-bit)?

MurmurHash3 adalah algoritma hash non-kriptografi yang sangat cepat yang berfokus pada kecepatan dan kinerja sambil mempertahankan properti distribusi yang baik. MurmurHash3 x86 32-bit adalah varian 32-bit yang menghasilkan nilai hash 32-bit (4-byte), biasanya ditampilkan sebagai angka heksadesimal 8 karakter.

**Karakteristik utama:**
- **Sangat cepat**: Dioptimalkan untuk kecepatan, jauh lebih cepat dari fungsi hash kriptografi
- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Distribusi baik**: Memberikan distribusi hash yang sangat baik untuk tabel hash
- **Non-kriptografi**: Tidak cocok untuk tujuan keamanan, dirancang untuk kinerja
- **Output kecil**: Hash 32-bit memberikan representasi yang kompak
- **Dioptimalkan platform**: Menggunakan instruksi SIMD saat tersedia untuk kecepatan maksimum

**Penggunaan umum:**
- Tabel hash dan struktur data
- Pemeriksaan integritas file (non-keamanan)
- Deduplikasi data
- Checksum untuk transmisi data
- Aplikasi kritis kinerja
- Pengindeksan database
- Generasi kunci cache
