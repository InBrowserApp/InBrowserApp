## Buat nomor ISBN-10 atau ISBN-13 acak

Pilih `ISBN-13` untuk katalog buku dan formulir penjualan saat ini atau `ISBN-10` untuk catatan lama. Tentukan jumlah dari `1` hingga `1000`, pilih apakah tanda hubung disertakan, lalu pilih **Buat**. Salin seluruh hasil atau unduh file TXT dengan satu ISBN per baris.

## Memahami format dan digit pemeriksa

International Standard Book Number (ISBN) mengidentifikasi edisi dan format sebuah buku. Nilai `ISBN-13` yang dibuat menggunakan prefiks `978` dan berakhir dengan digit pemeriksa berupa angka. `ISBN-10` dapat berakhir dengan `X`, yang mewakili sepuluh dalam perhitungan checksum. Contohnya adalah `978-0-306-40615-7` dan `0-8044-2957-X`. Tanda hubung memudahkan pembacaan kelompok angka dan tidak mengubah digit pemeriksa.

## Gunakan hasil sebagai data pengujian

Gunakan pengenal contoh ini untuk menguji formulir katalog, impor, dan validasi ISBN. Untuk menguji kesalahan checksum, ubah hanya karakter terakhir menjadi digit lain lalu coba impor lagi. Dalam spreadsheet atau basis data, simpan ISBN sebagai teks agar angka nol di awal atau `X` di akhir tetap terjaga. Untuk buku yang diterbitkan, ambil ISBN dari sampul edisi tersebut atau catatan penerbit.
