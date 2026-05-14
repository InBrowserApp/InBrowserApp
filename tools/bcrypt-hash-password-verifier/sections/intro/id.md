## Apa Fungsinya

Verifikasi apakah kata sandi teks biasa cocok dengan hash kata sandi bcrypt. Ini berguna saat Anda men-debug kode login, memeriksa catatan pengguna yang diimpor, atau memastikan migrasi kata sandi mempertahankan kompatibilitas hash.

## Input yang Diterima

Tempel hash bcrypt standar seperti `$2b$10$...` dan masukkan kandidat kata sandi yang ingin Anda uji. Alat verifikasi ini menerima prefiks `$2a$`, `$2b$`, dan `$2y$` dengan nilai cost dari `04` hingga `31`.

## Membaca Hasil

Hasil yang cocok berarti bcrypt menerima kata sandi untuk hash tersebut, termasuk salt dan cost yang tertanam dalam string hash. Ketidakcocokan berarti kata sandi tidak lolos verifikasi; itu tidak membuktikan bahwa hash itu sendiri tidak aman. Kesalahan hash tidak valid biasanya berarti prefiks, cost, panjang, atau karakter base64 bcrypt tidak sesuai format.

## Catatan Privasi dan Keamanan

- Verifikasi berjalan secara lokal di browser Anda.
- Kata sandi dan hash tidak disimpan di penyimpanan lokal.
- bcrypt dirancang untuk penyimpanan kata sandi, bukan checksum file untuk tujuan umum.
- Gunakan alat ini untuk debugging dan validasi, bukan sebagai satu-satunya audit atas sistem autentikasi produksi.
