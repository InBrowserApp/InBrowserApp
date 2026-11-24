## Buka file CAR dari IPFS atau Filecoin secara online

Pilih file `.car` dari perangkat Anda. Alat ini membaca arsip secara lokal dan menampilkan CID akarnya. Jika arsip memiliki lebih dari satu CID akar, pilih yang ingin Anda buka. CAR adalah singkatan dari Content Addressable aRchive, format arsip yang digunakan oleh IPFS dan Filecoin. Katalog aset Apple menggunakan format berbeda dengan ekstensi yang sama.

## Ekstrak file atau ubah folder dalam CAR menjadi ZIP

Buka folder untuk melihat isinya. Pilih salah satu file, lalu klik **Unduh file** untuk menyimpan data aslinya. Pilih **Unduh ZIP** untuk mengekspor folder beserta subfoldernya. File ZIP mempertahankan struktur folder UnixFS.

## Apa artinya jika ada blok yang hilang?

CAR menyimpan konten sebagai blok yang diidentifikasi dengan CID. CID akar bisa merujuk ke blok di luar arsip yang tidak lengkap. Jika entri memerlukan blok yang tidak ada, mintalah arsip lengkap dari sumbernya atau unduh entri yang bloknya tersedia. File CAR juga dapat menyimpan data dengan format IPLD lain. Alat ini mengekstrak file dan folder yang menggunakan UnixFS. [Format CAR IPLD](https://ipld.io/specs/transport/car/)
