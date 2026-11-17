## Periksa file SQLite secara lokal

Buka basis data SQLite 3 untuk menelusuri tabel dan tampilan, memeriksa definisi kolom, indeks, kunci asing, dan pernyataan CREATE, atau menjalankan kueri SQL hanya baca. Coba basis data contoh untuk menjelajahi ruang kerja tanpa memilih file. File dan kueri tetap di browser Anda dan tidak disimpan otomatis.

## Jalankan kueri dan ekspor hasil

Pilih tabel untuk melihat pratinjau barisnya. Edit SQL dan gunakan **Jalankan kueri** atau **Ctrl/⌘ + Enter** untuk menjalankan satu pernyataan SELECT, WITH, atau EXPLAIN. Batas hasil membatasi jumlah baris yang dimuat; setiap halaman menampilkan 50 baris. Kueri juga dapat berhenti saat hasil mencapai batas ukuran 5 MiB atau setelah 10 detik. Pembatalan menjaga antarmuka tetap responsif dan memuat ulang snapshot basis data saat kueri berikutnya dijalankan.

Ekspor CSV dan JSON berisi hasil yang telah dimuat, termasuk baris di halaman lain. JSON menyimpan nama kolom dan larik baris secara terpisah, sehingga nama duplikat dan nilai NULL tetap terjaga. Bilangan bulat SQLite menjadi string desimal yang akurat, dan BLOB menjadi objek dengan nilai heksadesimal `$blob`. CSV menggunakan bidang kosong untuk NULL, mengapit karakter khusus dengan tanda kutip, dan menambahkan apostrof sebelum teks yang menyerupai rumus agar lebih aman digunakan di aplikasi spreadsheet.

## Basis data yang didukung dan batasan

Buka file `.db`, `.sqlite`, atau `.sqlite3` yang tidak terenkripsi, hingga 50 MiB. File asli tidak pernah diubah. Alat ini memuat snapshot di memori, sehingga penggunaan memori dapat melebihi ukuran file. File pendamping WAL dan jurnal tidak diimpor; buat salinan bersih yang telah melalui proses checkpoint menggunakan aplikasi basis data Anda sebelum membukanya di sini. Basis data terenkripsi, ekstensi SQLite khusus, dan pengeditan basis data tidak didukung.
