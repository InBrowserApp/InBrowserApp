## Terokai pangkalan data SQLite dalam pelayar anda

Buka pangkalan data SQLite 3 untuk melayari jadual dan paparan, memeriksa lajur, indeks, kunci asing dan pernyataan CREATE, atau menjalankan pertanyaan SQL baca sahaja. Cuba pangkalan data contoh untuk menerokai ruang kerja. Fail anda diproses secara setempat dan tidak pernah diubah.

## Jalankan pertanyaan dan eksport hasil

Pilih jadual atau paparan untuk memuatkan barisnya, kemudian edit SQL untuk menapis, mengisih atau menggabungkan data. Jalankan satu pernyataan SELECT, WITH atau EXPLAIN dengan **Jalankan pertanyaan** atau **Ctrl/⌘ + Enter**. Klik sel untuk memeriksa dan menyalin nilai penuhnya.

Pilih had hasil 100, 1,000 atau 10,000 baris dan layari hasil 50 baris pada satu masa. Pertanyaan mempunyai had masa 10 saat dan had saiz hasil 5 MiB. Eksport CSV dan JSON merangkumi semua baris yang dimuatkan daripada semua halaman.

JSON menggunakan nama lajur dan tatasusunan baris yang berasingan untuk mengekalkan nama pendua dan nilai NULL. Integer ialah rentetan perpuluhan tepat dan BLOB mengandungi nilai perenambelasan `$blob`. CSV merangkumi baris pengepala, menggunakan medan kosong untuk NULL dan menambah apostrof di hadapan teks yang menyerupai formula.

## Fail SQLite yang disokong

Buka fail `.db`, `.sqlite` atau `.sqlite3` yang tidak disulitkan sehingga 50 MiB. Untuk pangkalan data yang menggunakan WAL, cipta salinan yang telah melalui titik semak sebelum membukanya; fail iringan WAL dan journal tidak dimuatkan. Sambungan SQLite tersuai tidak disokong. Fail dan pertanyaan tidak disimpan secara automatik.
