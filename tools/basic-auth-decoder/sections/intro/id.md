## Fungsi Alat Ini

Dekode header HTTP Basic Authorization untuk mengekstrak nama pengguna dan kata sandi dari Base64. Berguna untuk debugging dan pengujian API.

## Masukan yang Diterima

Tempelkan sesuatu seperti: Basic dXNlcjpwYXNz
Alat ini juga menerima baris lengkap `Authorization: Basic ...`.

## Catatan

- Base64 hanya mengodekan kredensial; format ini tidak melindunginya.
- Dekoder memisahkan teks pada `:` pertama dan mempertahankan sisanya sebagai kata sandi.
- Semuanya berjalan secara lokal di browser Anda.
