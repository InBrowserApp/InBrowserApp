## Periksa file Parquet di browser Anda

Buka atau letakkan file `.parquet` untuk menjelajahi datanya dan memeriksa tipe fisik, anotasi logis, serta pengulangan setiap bidang. Grup bertingkat tetap terlihat dalam skema. Ringkasan menampilkan jumlah baris, kolom, grup baris, kompresi, serta aplikasi pembuat file jika tersedia. Anda dapat mencoba contoh yang disertakan tanpa memilih file.

## Jelajahi data dan ekspor ke CSV atau JSON

Data dimuat satu halaman dalam satu waktu. Gunakan kontrol halaman untuk menjelajahi file, lalu pilih sel untuk membaca nilai lengkapnya. Beralih ke **Skema** untuk memeriksa bidang. Gunakan **Ekspor data** untuk mengunduh halaman saat ini atau semua baris sebagai CSV UTF-8 atau array JSON. Ekspor seluruh file disiapkan secara bertahap dan dapat dibatalkan.

CSV menyertakan nama kolom dan mengapit nilai yang berisi koma, tanda kutip, atau baris baru dengan tanda kutip. Null menjadi bidang kosong di CSV dan tetap berupa `null` di JSON. Nilai bertingkat menggunakan JSON; nilai biner menggunakan teks heksadesimal. Untuk mempertahankan bilangan bulat 64 bit, JSON menuliskannya sebagai string. Tanggal dan stempel waktu menggunakan teks ISO dengan presisi milidetik. Bilangan desimal mengikuti presisi numerik pembaca, sehingga penampil ini bukan alat konversi tanpa kehilangan data untuk bilangan desimal atau stempel waktu berpresisi tinggi.

## Pemrosesan lokal

File Anda dibaca secara lokal di worker latar belakang dan tidak pernah diunggah. Penampil membaca footer terlebih dahulu, lalu hanya rentang baris yang diperlukan untuk penjelajahan. Grup baris Parquet mungkin tetap membutuhkan memori yang besar untuk didekode; ukuran ekspor dibatasi oleh memori yang tersedia di browser Anda. Kodek tanpa kompresi, Snappy, Gzip, Brotli, Zstandard, dan LZ4 didukung oleh hyparquet dan paket kompresornya. File Parquet terenkripsi tidak didukung.
