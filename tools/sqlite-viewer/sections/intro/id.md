## Jelajahi basis data SQLite di browser

Buka basis data SQLite 3 untuk menelusuri tabel dan tampilan, memeriksa kolom, indeks, kunci asing, dan pernyataan CREATE, atau menjalankan kueri SQL hanya baca. Coba basis data contoh untuk menjelajahi ruang kerja. File Anda diproses secara lokal dan tidak pernah diubah.

## Jalankan kueri dan ekspor hasil

Pilih tabel atau tampilan untuk memuat barisnya, lalu edit SQL untuk memfilter, mengurutkan, atau menggabungkan data. Jalankan satu pernyataan SELECT, WITH, atau EXPLAIN dengan **Jalankan kueri** atau **Ctrl/⌘ + Enter**. Klik sel untuk memeriksa dan menyalin nilai lengkapnya.

Pilih batas hasil sebanyak 100, 1.000, atau 10.000 baris dan telusuri hasil dengan 50 baris per halaman. Kueri memiliki batas waktu 10 detik dan batas ukuran hasil 5 MiB. Ekspor CSV dan JSON mencakup semua baris yang dimuat di seluruh halaman.

JSON menggunakan nama kolom dan larik baris terpisah untuk mempertahankan nama duplikat dan nilai NULL. Bilangan bulat berupa string desimal yang akurat, dan BLOB berisi nilai heksadesimal `$blob`. CSV menyertakan baris header, menggunakan bidang kosong untuk NULL, dan menambahkan apostrof sebelum teks yang menyerupai rumus.

## File SQLite yang didukung

Buka file `.db`, `.sqlite`, atau `.sqlite3` yang tidak terenkripsi, hingga 50 MiB. Untuk basis data yang menggunakan WAL, buat salinan yang telah melalui proses checkpoint sebelum membukanya; file pendamping WAL dan jurnal tidak dimuat. Ekstensi SQLite khusus tidak didukung. File dan kueri tidak disimpan otomatis.
