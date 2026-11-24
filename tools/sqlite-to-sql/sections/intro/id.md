## Cara mengekspor SQLite ke file SQL

Buka atau seret dan letakkan file basis data SQLite 3, misalnya `.db`, `.sqlite`, atau `.sqlite3`. Alat ini akan membuat dump SQL secara otomatis. Aktifkan **Skema saja** untuk mengekspor struktur tanpa isi tabel, lalu pilih **Unduh .sql** untuk menyimpan skrip lengkap. Coba basis data contoh untuk melihat hasilnya.

## Isi dump SQL SQLite

Dump SQL adalah skrip teks untuk membuat ulang basis data. Skrip ini berisi pernyataan `CREATE` untuk tabel, indeks, tampilan, dan pemicu. Ekspor lengkap juga menyertakan pernyataan `INSERT` untuk baris data. Gunakan dump SQL untuk meninjau perubahan skema di Git, menyimpan cadangan yang mudah dibaca, atau memindahkan basis data ke lingkungan SQLite lain.

File sumber tetap berada di perangkat Anda. Jika basis data menggunakan log tulis di muka (WAL), ekspor salinan basis data mandiri. Buat salinan melalui aplikasi asal atau perintah pencadangan SQLite agar perubahan yang sudah dikomit dalam log ikut tersalin.

## Cara memulihkan dump SQL

Jalankan perintah berikut untuk mengimpor skrip ke basis data SQLite baru.

```sh
sqlite3 restored.sqlite < database.sql
```

Ganti `database.sql` dengan nama file unduhan Anda. Skrip ini menggunakan sintaks SQLite. Jika basis data menggunakan tabel virtual atau ekstensi, pulihkan dengan instalasi SQLite yang menyediakan modul yang diperlukan.

Untuk menelusuri tabel atau mengekspor hasil kueri sebagai CSV atau JSON, buka [Penampil SQLite](../sqlite-viewer/). Untuk membuat basis data dari lembar kerja, gunakan [Konverter CSV dan Excel ke SQLite](../csv-excel-to-sqlite/).
