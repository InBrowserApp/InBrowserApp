## Apa itu verifikasi Argon2?

Verifikasi Argon2 memeriksa apakah password polos menghasilkan hash Argon2 yang sama dengan hash yang sebelumnya disimpan. Hash yang dienkode berisi varian Argon2, parameter biaya, salt, dan digest, sehingga verifier dapat mengulang pekerjaan yang sama tanpa memerlukan pengaturan terpisah.

## Kapan menggunakan alat ini

- Mengonfirmasi bahwa password yang disalin dan hash Argon2 yang tersimpan memang saling cocok
- Men-debug masalah login atau migrasi saat memindahkan record password antar sistem
- Memeriksa varian dan parameter biaya di dalam hash Argon2 yang dienkode
- Menguji hash yang menggunakan secret sisi server opsional, sering disebut pepper

## Cara memverifikasi dengan aman

1. Tempel password yang ingin Anda periksa.
2. Tempel hash lengkap yang dienkode, misalnya string yang diawali dengan `$argon2id$`.
3. Masukkan secret hanya jika hash asli dibuat dengannya.
4. Jalankan verifikasi dan baca hasil cocok, tidak cocok, atau hash tidak valid.

## Catatan keamanan

Verifikasi terjadi secara lokal di browser Anda, tetapi password dan hash yang ditempel masih dapat tetap berada di memori browser sampai Anda mereset formulir atau menutup tab. Hindari menggunakan kredensial produksi di perangkat bersama. Untuk sistem penyimpanan password baru, Argon2id biasanya menjadi varian Argon2 yang disarankan karena menyeimbangkan ketahanan terhadap side-channel dan GPU.
