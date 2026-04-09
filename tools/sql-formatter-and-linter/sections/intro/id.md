## Apa Itu SQL Formatter & Linter?

SQL Formatter & Linter memformat ulang kueri SQL di browser Anda dan sekaligus memeriksanya untuk sekumpulan kecil masalah yang bernilai tinggi. Ini berguna saat Anda ingin tata letak kueri yang lebih rapi, kapitalisasi kata kunci yang konsisten, dan umpan balik cepat tentang pola berisiko seperti `SELECT *` atau pernyataan `UPDATE` tanpa klausa `WHERE`.

## Kapan Menggunakannya

Gunakan alat ini saat Anda meninjau SQL yang ditulis manual, merapikan kueri yang ditempel sebelum dibagikan, atau membandingkan format di berbagai dialek SQL. Alat ini cocok untuk peninjauan kueri ad hoc, pembersihan pull request, dan pemformatan hanya di browser tanpa mengirim SQL Anda ke server.

## Apa yang Diperiksa

Rewrite ini memisahkan formatter dan linter, tetapi tetap membuatnya bekerja selaras. Pemformatan menggunakan `sql-formatter` dengan opsi tata letak yang peka terhadap dialek, sementara linting menampilkan kesalahan parse, titik koma yang hilang, penggunaan `SELECT *` yang terlalu luas, mutation yang tidak aman, baris yang terlalu panjang, dan penyimpangan huruf kata kunci.
