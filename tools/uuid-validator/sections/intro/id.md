## Apa Itu Validator UUID?

Validator UUID memeriksa apakah sebuah pengenal ditulis dalam bentuk UUID standar 36 karakter, seperti `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Ini berguna saat Anda perlu memverifikasi ID yang disalin dari log, API, database, fixture pengujian, atau input pengguna sebelum mengandalkannya dalam kode.

### Input yang Didukung

Alat ini memvalidasi teks UUID kanonis dengan lima grup heksadesimal dalam susunan `8-4-4-4-12`. Huruf besar diterima dan dinormalisasi menjadi huruf kecil. UUID nil (`00000000-0000-0000-0000-000000000000`) dan UUID max (`ffffffff-ffff-ffff-ffff-ffffffffffff`) diperlakukan sebagai nilai khusus yang valid.

### Detail Validasi

Untuk UUID standar, validator memeriksa nibble versi dan bit varian. Versi 1 sampai 8 dikenali, mencakup UUID RFC 4122 lama dan susunan RFC 9562 yang lebih baru seperti UUID v6, v7, dan v8. Panel hasil juga memecah UUID menjadi lima segmennya sehingga Anda dapat memeriksa byte persis yang sedang divalidasi.

### Privasi

Validasi berjalan sepenuhnya di browser Anda. UUID yang Anda tempel tidak diunggah, sehingga alat ini aman digunakan dengan pengenal internal, kunci database, dan contoh log produksi yang harus tetap lokal.
