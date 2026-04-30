## Apa itu konversi JWK ↔ PEM?

JWK (JSON Web Key) adalah material kunci berbentuk JSON yang digunakan oleh JOSE/JWT, endpoint JWKS, serta konfigurasi serverless atau browser. Format ini mudah dibaca software, tetapi kurang diterima oleh CLI dan infrastruktur yang mengharapkan file kunci.

PEM membungkus data kunci DER dengan label BEGIN/END, format yang biasanya diminta oleh OpenSSL, alat TLS, API gateway, dan banyak SDK.

Konverter ini menjembatani kedua format secara lokal di browser Anda. Konverter menangani kontainer kunci RSA, EC (P-256/384/521), dan OKP, memungkinkan Anda memilih PEM publik SPKI atau privat PKCS8 saat mulai dari JWK, dan dapat mengubah blok PEM yang didukung kembali menjadi JWK JSON rapi atau ringkas.

Gunakan output publik saat Anda hanya memerlukan verifikasi atau distribusi. Konversi privat menampilkan material kunci privat di layar dan dalam unduhan, jadi perlakukan hasilnya sebagai rahasia dan tutup tab setelah selesai.

- Pindahkan kunci antara konfigurasi JWKS/JSON dan file PEM bergaya OpenSSL.
- Ekstrak kunci publik sebelum membagikannya ke verifier JWT, gateway, atau client.
- Konversi secara lokal tanpa mengunggah material kunci ke server.
