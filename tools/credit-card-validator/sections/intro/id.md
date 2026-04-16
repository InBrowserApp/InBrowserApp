## Apa itu Validasi Kartu Kredit?

Validasi kartu kredit adalah proses untuk memeriksa apakah nomor kartu berpotensi valid sebelum memproses transaksi. Menggunakan algoritma Luhn dan identifikasi merek kartu untuk memverifikasi format.

### Algoritma Luhn

Algoritma Luhn (juga dikenal sebagai Mod 10) adalah formula checksum yang digunakan untuk memvalidasi nomor identifikasi. Begini cara kerjanya:

1. Mulai dari digit paling kanan, gandakan setiap digit kedua
2. Jika penggandaan menghasilkan angka lebih dari 9, kurangi 9 dari hasil
3. Jumlahkan semua digit. Jika total habis dibagi 10, nomor valid

### Merek Kartu yang Didukung

Merek kartu diidentifikasi oleh BIN (Nomor Identifikasi Bank) atau IIN (Nomor Identifikasi Penerbit), yang merupakan digit pertama dari nomor kartu.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
