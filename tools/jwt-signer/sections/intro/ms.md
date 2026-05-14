## Apakah itu penandatangan JWT?

Penandatangan JWT mencipta JSON Web Token padat dengan mensirikan pengepala dan muatan, kemudian menandatanganinya dengan rahsia atau kunci peribadi. Hasilnya ialah token tiga bahagian `header.payload.signature` yang digunakan oleh banyak sistem API, OAuth, dan sesi.

## Bila menggunakan alat ini

- Cipta token ujian setempat untuk pembangunan API, persekitaran staging, dan demo.
- Bandingkan cara algoritma berbeza mengubah pengepala dan tandatangan token.
- Tambah tuntutan seperti `sub`, `iss`, `aud`, `exp`, `iat`, `scope`, atau medan aplikasi tersuai tanpa menulis skrip sementara.
- Jana token dengan rahsia dikongsi HMAC atau dengan kunci peribadi RSA/ECDSA dalam bentuk PKCS#8 PEM atau JWK.

## Perkara yang perlu disemak sebelum menggunakan token bertandatangan

- Padankan algoritma dengan jenis kunci: `HS*` menggunakan rahsia dikongsi, `RS*` dan `PS*` menggunakan kunci peribadi RSA, dan `ES*` menggunakan kunci peribadi EC.
- Tambah tuntutan tamat tempoh dan audiens apabila perkhidmatan penerima menjangkakannya.
- Jauhkan kunci peribadi produksi daripada pelayar dan mesin yang dikongsi. Alat ini berjalan secara setempat, tetapi ia tidak dapat melindungi kunci daripada peranti yang sudah dikompromi.
- Ingat bahawa penandatanganan bukan penyulitan. Sesiapa yang menerima token boleh menyahkod pengepala dan muatan.
