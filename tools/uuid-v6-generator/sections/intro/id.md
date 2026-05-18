Generator UUID v6 membuat UUID berbasis waktu yang mempertahankan bentuk UUID yang familier sekaligus menempatkan stempel waktu di depan untuk pengurutan leksikal alami. Semuanya berjalan sepenuhnya di browser Anda, sehingga pengenal yang dibuat dan nilai node opsional tidak pernah meninggalkan halaman.

## Saat UUID v6 Membantu

Gunakan UUID v6 saat Anda membutuhkan pengenal yang tetap kompatibel secara luas dengan alat UUID, tetapi juga dapat diurutkan mendekati urutan pembuatannya di log, indeks basis data, aliran peristiwa, atau skrip migrasi. Secara semantik, UUID v6 paling dekat dengan UUID v1: UUID ini menggunakan stempel waktu Gregorian, urutan jam, dan field node 48-bit, tetapi menyusun ulang bit stempel waktu sehingga ID yang lebih baru terurut setelah ID yang lebih lama.

## ID Node dan Privasi

Generator UUID v1 klasik sering menggunakan alamat MAC asli sebagai field node. Alat ini secara default memakai ID node acak yang dikelola secara lokal untuk setiap UUID yang dibuat, sehingga tidak mengekspos alamat perangkat keras. Beralihlah ke node kustom hanya saat Anda memang membutuhkan output yang kompatibel dengan v1 untuk fixture pengujian, pemeriksaan interoperabilitas, atau sistem terkendali.

## Urutan Jam dan Waktu Kustom

Urutan jam membantu menghindari tabrakan saat stempel waktu berulang atau jam bergerak mundur. Urutan acak default adalah pilihan paling aman untuk penggunaan normal. Stempel waktu, ID node, dan urutan jam kustom berguna untuk contoh deterministik, tetapi nilai kustom yang berulang harus digunakan dengan hati-hati dalam data produksi.
