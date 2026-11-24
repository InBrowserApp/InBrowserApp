## Cara mengeksport SQLite ke fail SQL

Buka atau seret dan lepaskan fail pangkalan data SQLite 3 seperti `.db`, `.sqlite` atau `.sqlite3`. Alat ini menjana skrip SQL secara automatik. Hidupkan **Skema sahaja** untuk mengeksport struktur tanpa kandungan jadual, kemudian pilih **Muat turun .sql** untuk menyimpan skrip penuh. Cuba pangkalan data contoh untuk melihat hasilnya.

## Kandungan skrip SQL SQLite

Dump SQL ialah skrip teks untuk membina semula pangkalan data. Skrip ini mengandungi pernyataan `CREATE` untuk jadual, indeks, paparan dan pencetus. Eksport penuh turut menyertakan pernyataan `INSERT` untuk baris data. Gunakan skrip ini untuk menyemak perubahan skema dalam Git, menyimpan sandaran yang mudah dibaca atau memindahkan pangkalan data ke persekitaran SQLite lain.

Fail sumber kekal pada peranti anda. Jika pangkalan data menggunakan log tulis dahulu (WAL), eksport salinan pangkalan data yang boleh dibuka secara berasingan. Gunakan aplikasi asal atau perintah sandaran SQLite supaya salinan itu menyertakan perubahan yang telah dikomit dalam log.

## Cara memulihkan pangkalan data daripada skrip SQL

Jalankan perintah berikut untuk mengimport skrip ke dalam pangkalan data SQLite baharu.

```sh
sqlite3 restored.sqlite < database.sql
```

Gantikan `database.sql` dengan nama fail yang dimuat turun. Skrip ini menggunakan sintaks SQLite. Jika pangkalan data menggunakan jadual maya atau sambungan, pulihkannya dalam pemasangan SQLite yang mempunyai modul yang diperlukan.

Untuk melayari jadual atau mengeksport hasil pertanyaan sebagai CSV atau JSON, buka [Pemapar SQLite](../sqlite-viewer/). Untuk membina pangkalan data daripada hamparan, gunakan [Tukar CSV dan Excel kepada SQLite](../csv-excel-to-sqlite/).
