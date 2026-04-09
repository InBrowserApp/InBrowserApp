## Apa Itu SQL Formatter & Linter?

SQL Formatter & Linter memformat semula pertanyaan SQL dalam pelayar anda dan menyemaknya pada masa yang sama untuk satu set isu berimpak tinggi yang kecil. Ia berguna apabila anda mahu susun atur pertanyaan yang lebih kemas, penggunaan huruf kata kunci yang konsisten, dan maklum balas pantas tentang corak berisiko seperti `SELECT *` atau pernyataan `UPDATE` tanpa klausa `WHERE`.

## Bila Perlu Digunakan

Gunakan alat ini apabila anda menyemak SQL yang ditaip sendiri, membersihkan pertanyaan yang ditampal sebelum berkongsi, atau membandingkan pemformatan merentas dialek SQL yang berbeza. Ia sesuai untuk semakan pertanyaan ad hoc, pembersihan pull request, dan pemformatan hanya dalam pelayar tanpa menghantar SQL anda ke pelayan.

## Apa Yang Disemak

Penulisan semula ini mengekalkan pemformat dan linter sebagai komponen berasingan tetapi diselaraskan. Pemformatan menggunakan `sql-formatter` dengan pilihan susun atur yang peka terhadap dialek, manakala lint menonjolkan ralat parsing, titik koma yang tiada, penggunaan `SELECT *` yang luas, pengubahsuaian yang tidak selamat, baris yang terlalu panjang, dan penyimpangan huruf kata kunci.
