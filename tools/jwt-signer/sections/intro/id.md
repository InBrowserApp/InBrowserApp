## Apa itu penandatangan JWT?

Penandatangan JWT membuat JSON Web Token compact dengan menserialisasi header dan payload, lalu menandatanganinya dengan secret atau kunci privat. Hasilnya adalah token tiga bagian `header.payload.signature` yang digunakan oleh banyak sistem API, OAuth, dan sesi.

## Kapan menggunakan alat ini

- Buat token uji lokal untuk pengembangan API, lingkungan staging, dan demo.
- Bandingkan bagaimana algoritme yang berbeda mengubah header dan signature token.
- Tambahkan klaim seperti `sub`, `iss`, `aud`, `exp`, `iat`, `scope`, atau field aplikasi kustom tanpa menulis skrip sementara.
- Buat token dengan secret bersama HMAC atau dengan kunci privat RSA/ECDSA dalam bentuk PKCS#8 PEM atau JWK.

## Apa yang perlu diperiksa sebelum menggunakan token yang ditandatangani

- Cocokkan algoritme dengan jenis kunci: `HS*` menggunakan secret bersama, `RS*` dan `PS*` menggunakan kunci privat RSA, dan `ES*` menggunakan kunci privat EC.
- Tambahkan klaim kedaluwarsa dan audience saat layanan penerima mengharapkannya.
- Jauhkan kunci privat produksi dari browser dan mesin bersama. Alat ini berjalan secara lokal, tetapi tidak dapat melindungi kunci dari perangkat yang sudah disusupi.
- Ingat bahwa penandatanganan bukan enkripsi. Siapa pun yang menerima token dapat mendekode header dan payload.
