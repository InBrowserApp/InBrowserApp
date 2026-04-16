## Apa itu Base32?

Base32 berguna ketika saluran khusus teks atau saluran yang tidak peka huruf besar/kecil perlu membawa data biner, seperti rahasia OTP, token yang aman untuk DNS, atau nilai konfigurasi yang diekspor. Ini adalah lapisan encoding, bukan lapisan keamanan.

## Kapan menggunakannya

- Encode byte, teks, atau file ke Base32 sebelum dikirim lewat kanal yang hanya menerima teks.
- Menyiapkan secret OTP, konfigurasi hasil ekspor, atau blob biner untuk sistem yang mengharapkan input Base32.
- Mengubah byte file mentah menjadi string yang mudah disalin untuk transport, logging, atau input manual.

## Hal yang perlu diperhatikan

- Base32 menambah ukuran data lebih besar daripada Base64.
- Ini tidak mengenkripsi atau menyembunyikan nilai aslinya.
- Beberapa sistem mewajibkan padding `=`, sementara yang lain menerima output tanpa padding, jadi sebaiknya sesuaikan dengan penerima.
