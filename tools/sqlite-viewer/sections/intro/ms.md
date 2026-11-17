## Periksa fail SQLite secara setempat

Buka pangkalan data SQLite 3 untuk melayari jadual dan paparannya, memeriksa takrif lajur, indeks, kunci asing dan pernyataan CREATE, atau menjalankan pertanyaan SQL baca sahaja. Cuba pangkalan data contoh untuk menerokai ruang kerja tanpa memilih fail. Fail dan pertanyaan kekal dalam pelayar anda dan tidak disimpan secara automatik.

## Jalankan pertanyaan dan eksport hasil

Pilih jadual untuk melihat pratonton barisnya. Edit SQL dan gunakan **Jalankan pertanyaan** atau **Ctrl/⌘ + Enter** untuk menjalankan satu pernyataan SELECT, WITH atau EXPLAIN. Had hasil mengehadkan bilangan baris yang dimuatkan; penomboran halaman memaparkan 50 baris pada satu masa. Pertanyaan juga boleh dihentikan apabila mencapai had hasil 5 MiB atau selepas 10 saat. Pembatalan memastikan antara muka kekal responsif dan memuatkan semula petikan pangkalan data pada pertanyaan seterusnya.

Eksport CSV dan JSON mengandungi hasil yang dimuatkan, termasuk baris pada halaman lain. JSON menyimpan nama lajur dan tatasusunan baris secara berasingan, mengekalkan nama pendua dan nilai NULL. Integer SQLite menjadi rentetan perpuluhan tepat dan BLOB menjadi objek dengan nilai perenambelasan `$blob`. CSV menggunakan medan kosong untuk NULL, mengapit aksara khas dengan tanda petikan dan menambah apostrof di hadapan teks yang menyerupai formula untuk penggunaan hamparan yang lebih selamat.

## Pangkalan data yang disokong dan had

Buka fail `.db`, `.sqlite` atau `.sqlite3` yang tidak disulitkan sehingga 50 MiB. Fail asal tidak pernah diubah. Alat ini memuatkan petikan dalam memori, jadi penggunaan memori boleh melebihi saiz fail. Fail iringan WAL dan journal tidak diimport; cipta salinan bersih yang telah melalui titik semak menggunakan aplikasi pangkalan data anda sebelum membukanya di sini. Pangkalan data disulitkan, sambungan SQLite tersuai dan penyuntingan pangkalan data tidak disokong.
