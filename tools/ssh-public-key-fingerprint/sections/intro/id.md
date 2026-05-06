## Apa itu sidik jari kunci publik SSH?

Sidik jari kunci publik SSH adalah digest singkat dari blob kunci publik. Nilai ringkas ini dapat dibandingkan sebelum Anda memercayai kunci di `authorized_keys`, inventaris server, atau alur kerja deployment.

OpenSSH biasanya menampilkan sidik jari SHA-256 seperti `SHA256:...`. Dokumentasi lama dan beberapa audit masih menggunakan sidik jari MD5 yang dipisahkan titik dua. Alat ini menampilkan keduanya agar Anda dapat mencocokkan output SSH modern dan catatan lama tanpa mengirim kunci ke mana pun.

Tempel satu kunci publik, beberapa baris `authorized_keys`, atau blok kunci publik SSH2. Parser melewati komentar dan opsi authorized_keys, membaca blob kunci SSH yang sebenarnya, lalu menghitung sidik jari secara lokal di browser Anda.

- Verifikasi bahwa kunci publik yang disalin cocok dengan sidik jari yang dibagikan oleh rekan tim.
- Bandingkan entri `authorized_keys` dengan daftar akses server.
- Periksa jenis kunci, ukuran kunci, kurva, dan komentar sebelum menyalin sidik jari.
