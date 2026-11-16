## Apa itu kunci sistem Motorola lawas?

Kunci sistem perangkat lunak adalah file `.KEY` yang digunakan oleh perangkat lunak pemrograman Motorola yang kompatibel untuk memungkinkan pengeditan pengaturan sistem trunking yang dilindungi. Generator ini mereproduksi format lawas yang berasal dari BatLabs untuk suatu ID Sistem. Kunci sistem berbeda dari kunci enkripsi lalu lintas radio dan tidak dengan sendirinya memberikan akses ke jaringan radio.

## Cara menggunakan generator ini

1. Masukkan ID Sistem menggunakan 1–4 digit heksadesimal (`0–9`, `A–F`), tanpa awalan `0x`. Huruf kecil dapat digunakan, dan ID pendek akan dilengkapi dengan nol di depan: `ab` menjadi `00AB`.
2. Periksa ID yang dinormalisasi, nama file, dan pratinjau heksadesimal.
3. Unduh file biner `.KEY` dan muat di perangkat lunak pemrograman lawas yang kompatibel. File berukuran 27 byte; ID Sistem `1234` menghasilkan `SYS01234.KEY`.

## Batas kompatibilitas

Alat ini mengikuti format lawas yang dipublikasikan; kompatibilitas bergantung pada perangkat lunak pemrograman. Alat ini tidak mendukung ASTRO 25 Portable CPS (termasuk XTS5000), APX CPS, atau Advanced System Keys (ASK). Kecocokan dengan format byte referensi tidak membuktikan kompatibilitas dengan radio atau versi CPS tertentu.

## Privasi

Pembuatan, validasi, dan pratinjau file dijalankan secara lokal di browser Anda. ID Sistem dan kunci yang dihasilkan tidak dikirim ke server.
