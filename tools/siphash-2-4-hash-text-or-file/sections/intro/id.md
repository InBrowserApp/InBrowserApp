## Apa itu SipHash-2-4?

SipHash-2-4 adalah fungsi hash berkunci yang cepat, dirancang untuk pesan pendek dan perlindungan tabel hash. Fungsi ini menggunakan kunci rahasia 128-bit dan menghasilkan output 64-bit, biasanya ditampilkan sebagai nilai heksadesimal 16 karakter.

## Kapan menggunakannya

- Lindungi tabel hash sisi server dari serangan hash-flooding ketika kunci tetap privat.
- Buat checksum berkunci yang deterministik untuk kunci cache, sharding, atau tabel pencarian internal.
- Bandingkan cuplikan teks atau file dengan kunci yang sama ketika autentikasi kriptografis tidak diperlukan.

## Format kunci

Masukkan kunci sebagai tepat 16 byte data heksadesimal, seperti `0x000102030405060708090a0b0c0d0e0f`. Prefiks `0x` bersifat opsional, dan alat ini menerima spasi, titik dua, tanda hubung, dan garis bawah agar kunci panjang lebih mudah dibaca.

## Catatan keamanan

SipHash-2-4 bukan pengganti HMAC, tanda tangan digital, atau hashing kata sandi. Gunakan untuk alur kerja tabel hash berkunci dan checksum, bukan untuk membuktikan autentisitas antar sistem yang membutuhkan jaminan keamanan kriptografis.
