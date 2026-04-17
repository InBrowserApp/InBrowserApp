## Apa itu xxHash (XXH64)?

xxHash adalah algoritma hash non-kriptografi yang sangat cepat yang berfokus pada kecepatan dan kinerja sambil mempertahankan properti distribusi yang baik. XXH64 adalah varian 64-bit yang menghasilkan nilai hash 64-bit (8-byte), biasanya ditampilkan sebagai angka heksadesimal 16 karakter.

**Karakteristik utama:**

- **Sangat cepat**: Dioptimalkan untuk kecepatan, jauh lebih cepat dari fungsi hash kriptografi
- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Distribusi baik**: Memberikan distribusi hash yang sangat baik untuk tabel hash
- **Non-kriptografi**: Tidak cocok untuk tujuan keamanan, dirancang untuk kinerja
- **Output lebih besar**: Hash 64-bit memberikan resistensi tabrakan yang lebih baik daripada varian 32-bit
- **Dioptimalkan platform**: Menggunakan instruksi SIMD saat tersedia untuk kecepatan maksimum

**Penggunaan umum:**

- Tabel hash dan struktur data
- Pemeriksaan integritas file (non-keamanan)
- Deduplikasi data
- Checksum untuk transmisi data
- Aplikasi kritis kinerja
- Pengindeksan database
- Generasi kunci cache
