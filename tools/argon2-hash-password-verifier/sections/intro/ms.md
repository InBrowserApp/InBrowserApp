## Apakah pengesahan Argon2?

Pengesahan Argon2 memeriksa sama ada kata laluan biasa menghasilkan hash Argon2 berkod yang sama seperti yang disimpan sebelum ini. Hash berkod mengandungi varian Argon2, parameter kos, salt, dan digest, jadi pengesah boleh mengulangi kerja yang sama tanpa memerlukan tetapan berasingan.

## Bila menggunakan alat ini

- Sahkan bahawa kata laluan yang disalin dan hash Argon2 yang disimpan memang sepadan
- Nyahpepijat isu log masuk atau migrasi apabila memindahkan rekod kata laluan antara sistem
- Periksa varian dan parameter kos dalam hash Argon2 berkod
- Uji hash yang menggunakan secret sebelah pelayan pilihan, yang sering dipanggil pepper

## Cara mengesahkan dengan selamat

1. Tampal kata laluan yang mahu anda periksa.
2. Tampal hash berkod penuh, seperti rentetan yang bermula dengan `$argon2id$`.
3. Masukkan secret hanya jika hash asal dicipta dengannya.
4. Jalankan pengesahan dan baca hasil sepadan, tidak sepadan, atau hash tidak sah.

## Nota keselamatan

Pengesahan berlaku secara setempat dalam pelayar anda, tetapi kata laluan dan hash yang ditampal masih boleh kekal dalam memori pelayar sehingga anda menetapkan semula borang atau menutup tab. Elakkan menggunakan kelayakan produksi pada peranti kongsi. Untuk sistem penyimpanan kata laluan baharu, Argon2id biasanya varian Argon2 yang disyorkan kerana ia mengimbangi rintangan terhadap side-channel dan GPU.
