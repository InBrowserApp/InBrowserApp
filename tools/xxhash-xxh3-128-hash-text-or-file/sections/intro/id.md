## Apa itu xxHash (XXH3 128)?

XXH3 adalah algoritma xxHash modern yang dirancang untuk kecepatan sangat tinggi dan distribusi yang sangat baik. XXH3 128 menghasilkan nilai hash 128-bit (16-byte), biasanya ditampilkan sebagai string heksadesimal 32 karakter. Ini adalah hash non-kriptografis dan mendukung seed opsional untuk hashing yang dapat direproduksi.

**Karakteristik utama:**

- **Sangat cepat**: Dioptimalkan untuk performa pada input besar
- **Deterministik**: Input dan seed yang sama selalu menghasilkan hash yang sama
- **Non-kriptografis**: Tidak cocok untuk tujuan keamanan
- **Distribusi yang baik**: Berguna untuk tabel hash dan pengindeksan
- **Dengan seed**: Seed opsional membantu membedakan keluaran hash

**Penggunaan umum:**

- Tabel hash dan struktur data
- Pemeriksaan integritas file (bukan untuk keamanan)
- Deduplikasi data dan chunking
- Kunci cache dan pengindeksan basis data
- Pipeline data dengan throughput tinggi
