## Apa itu xxHash (XXH3 64)?

XXH3 adalah algoritma xxHash modern yang dirancang untuk kecepatan sangat tinggi dan distribusi yang sangat baik. XXH3 64 menghasilkan nilai hash 64-bit (8-byte), biasanya ditampilkan sebagai string heksadesimal sepanjang 16 karakter. Hash ini bersifat nonkriptografis dan mendukung seed opsional untuk menghasilkan hash yang dapat direproduksi.

**Karakteristik utama:**

- **Sangat cepat**: Dioptimalkan untuk kinerja pada masukan besar
- **Deterministik**: Masukan dan seed yang sama selalu menghasilkan hash yang sama
- **Nonkriptografis**: Tidak cocok untuk tujuan keamanan
- **Distribusi yang baik**: Cocok untuk tabel hash dan pengindeksan
- **Menggunakan seed**: Seed opsional untuk memvariasikan keluaran hash

**Penggunaan umum:**

- Tabel hash dan struktur data
- Pemeriksaan integritas file (di luar konteks keamanan)
- Deduplikasi dan pemotongan data menjadi bagian-bagian
- Kunci cache dan pengindeksan basis data
- Alur pemrosesan data berkapasitas tinggi
