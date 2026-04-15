## Apa itu validasi email?

Validasi email memeriksa apakah sebuah alamat mengikuti aturan sintaks umum untuk bagian lokal, tanda `@`, label domain, dan top-level domain. Ini berguna untuk pengujian formulir, merapikan data contoh, dan menangkap salah ketik yang jelas sebelum dikirim.

### Apa yang diperiksa validator ini

- Satu `@` yang memisahkan bagian lokal dan domain
- Batas panjang untuk seluruh alamat, bagian lokal, dan domain
- Karakter yang diizinkan, posisi titik, aturan tanda hubung, dan struktur TLD
- Hasil ternormalisasi dengan domain huruf kecil untuk memudahkan perbandingan

### Contoh

- Valid: `name@example.com`
- Valid: `first.last+news@example.co.uk`
- Tidak valid: `name..dots@example.com`
- Tidak valid: `user@-example.com`

Domain internasional harus dimasukkan dalam bentuk Punycode ASCII, misalnya `user@xn--bcher-kva.example`.

### Apa yang tidak diperiksa alat ini

- Apakah kotak surat benar-benar ada atau bisa menerima email
- Pemeriksaan DNS, MX, SMTP, atau penyedia email sekali pakai
- Apakah sebuah situs akan menerima alamat itu menurut aturan bisnisnya sendiri
