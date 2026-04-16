## Apa itu Base32?

Base32 berguna ketika saluran khusus teks atau saluran yang tidak peka huruf besar/kecil perlu membawa data biner, seperti rahasia OTP, token yang aman untuk DNS, atau nilai konfigurasi yang diekspor. Ini adalah lapisan encoding, bukan lapisan keamanan.

## Kapan menggunakannya

- Mendekode rahasia atau token Base32 kembali ke byte aslinya.
- Memeriksa nilai yang disalin dari pengaturan TOTP, ekspor integrasi, atau file konfigurasi.
- Mengecek apakah data Base32 yang ditempel memiliki karakter yang valid dan padding yang benar sebelum digunakan.

## Hal yang perlu diperhatikan

- Base32 menambah ukuran data lebih besar daripada Base64.
- Ini tidak mengenkripsi atau menyembunyikan nilai aslinya.
- Beberapa sistem menghilangkan padding `=`, tetapi karakter yang tidak valid tetap menyebabkan error saat decode.
