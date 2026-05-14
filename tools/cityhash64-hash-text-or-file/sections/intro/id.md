## Apa itu CityHash64?

CityHash64 adalah algoritma hash non-kriptografi cepat dari Google yang menghasilkan nilai 64-bit (8-byte). Algoritma ini berguna saat Anda memerlukan sidik jari yang ringkas dan deterministik untuk teks atau file, dan kecepatan lebih penting daripada keamanan kriptografi.

**Karakteristik utama:**

- **Cepat dan deterministik**: Input dan seed yang sama selalu menghasilkan hash 64-bit yang sama
- **Non-kriptografi**: Jangan gunakan CityHash64 untuk kata sandi, tanda tangan, token, atau pemeriksaan integritas anti-perubahan
- **Mendukung seed**: Biarkan seed kosong untuk CityHash64 standar, atau masukkan seed desimal atau heksadesimal `0x` saat Anda memerlukan ruang hash terpisah dengan seed
- **Pemrosesan lokal**: Teks dan file di-hash di browser; file yang diunggah tidak dikirim ke server
- **Beberapa encoding**: Hasil ditampilkan sebagai nilai heksadesimal, Base64, desimal, dan biner

**Penggunaan umum:**

- Tabel hash dan struktur data
- Sidik jari file non-keamanan
- Deduplikasi dan pengelompokan data
- Kunci cache dan kunci sharding
- Fixture regresi untuk sistem yang sudah menggunakan CityHash64
- Pengindeksan database
