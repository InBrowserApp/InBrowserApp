## Apakah penukaran JWK ↔ PEM?

JWK (JSON Web Key) ialah bahan kunci berbentuk JSON yang digunakan oleh JOSE/JWT, endpoint JWKS, serta konfigurasi serverless atau pelayar. Ia mudah dibaca oleh perisian, tetapi kurang diterima oleh CLI dan infrastruktur yang mengharapkan fail kunci.

PEM membalut data kunci DER dengan label BEGIN/END, iaitu format yang biasanya diminta oleh OpenSSL, alat TLS, gateway API dan banyak SDK.

Penukar ini menghubungkan kedua-dua format secara setempat dalam pelayar anda. Ia mengendalikan bekas kunci RSA, EC (P-256/384/521) dan OKP, membolehkan anda memilih PEM awam SPKI atau peribadi PKCS8 apabila bermula daripada JWK, dan boleh menukar blok PEM yang disokong kembali kepada JWK JSON yang kemas atau padat.

Gunakan output awam apabila anda hanya memerlukan pengesahan atau pengedaran. Penukaran peribadi memaparkan bahan kunci peribadi pada skrin dan dalam muat turun, jadi anggap hasilnya sebagai rahsia dan tutup tab selepas selesai.

- Pindahkan kunci antara konfigurasi JWKS/JSON dan fail PEM gaya OpenSSL.
- Ekstrak kunci awam sebelum berkongsi dengan pengesah JWT, gateway atau klien.
- Tukar secara setempat tanpa memuat naik bahan kunci ke pelayan.
