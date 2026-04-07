## Apa itu Base64?

Base64 berguna ketika sebuah saluran berbasis teks perlu membawa muatan yang ramah biner, seperti badan email, blob JSON, atau data URL kecil. Ini adalah lapisan encoding, bukan lapisan keamanan.

## Kapan menggunakannya

- Debugging cepat saat sebuah API mengembalikan atau mengharapkan string Base64.
- Mengonversi teks peramban ke format transportasi yang aman untuk log atau muatan.
- Memeriksa apakah blob Base64 yang ditempel ter-decode menjadi konten yang Anda harapkan.

## Yang perlu diingat

- Base64 meningkatkan ukuran sekitar sepertiga.
- Ia tidak mengenkripsi atau menyembunyikan nilai aslinya.
- Padding yang tidak valid atau salin-tempel yang rusak biasanya muncul sebagai kesalahan decoding.
