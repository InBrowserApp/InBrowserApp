## Apakah cap jari kunci awam SSH?

Cap jari kunci awam SSH ialah digest ringkas bagi blob kunci awam. Ia memberi
anda nilai padat untuk dibandingkan sebelum mempercayai kunci dalam
`authorized_keys`, inventori pelayan, atau aliran kerja deployment.

OpenSSH lazimnya memaparkan cap jari SHA-256 seperti `SHA256:...`. Dokumentasi
lama dan sesetengah audit masih menggunakan cap jari MD5 yang dipisahkan dengan
titik bertindih. Alat ini memaparkan kedua-duanya supaya anda boleh memadankan
output SSH moden dan rekod lama tanpa menghantar kunci ke mana-mana.

Tampal satu kunci awam, beberapa baris `authorized_keys`, atau blok kunci awam
SSH2. Penghurai melangkau komen dan pilihan authorized_keys, membaca blob kunci
SSH sebenar, dan mengira cap jari secara setempat dalam pelayar anda.

- Sahkan bahawa kunci awam yang disalin sepadan dengan cap jari yang dikongsi
  oleh rakan sepasukan.
- Bandingkan entri `authorized_keys` dengan senarai akses pelayan.
- Periksa jenis kunci, saiz kunci, lengkung, dan komen sebelum menyalin cap
  jari.
