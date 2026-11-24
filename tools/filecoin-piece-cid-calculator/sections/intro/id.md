## Hitung Piece CID dari arsip CAR atau file

Pilih file yang persis sama dengan file yang akan Anda kirim ke penyedia penyimpanan Filecoin. Pilih **Hitung Piece CID**, lalu salin pengenal dalam format yang Anda perlukan. Alat ini juga menampilkan ukuran piece setelah padding dalam byte. Browser membaca file secara lokal dan memprosesnya per bagian, sehingga isi file tetap berada di perangkat Anda.

## Format mana yang sebaiknya saya gunakan?

**Piece CID (v2)** mengikuti [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Format ini biasanya diawali dengan `bafkzci` dan memuat ukuran data yang diperlukan alat Filecoin versi baru. **CommP versi lama (v1)** biasanya diawali dengan `baga6ea4` dan digunakan dalam kesepakatan penyimpanan Filecoin tradisional. Jika proses Anda meminta Piece CID versi lama dan ukuran piece setelah padding, salin komitmen versi lama dan gunakan ukuran yang ditampilkan di sampingnya. Anda dapat menempelkan salah satu format untuk memeriksa apakah komitmen yang ada cocok dengan file Anda. CommP versi lama dapat bernilai sama untuk file yang hanya berbeda pada jumlah byte nol di bagian akhir.

## Mengapa CID IPFS saya terlihat berbeda?

CID akar IPFS mengidentifikasi blok atau akar file maupun folder. Piece CID Filecoin adalah komitmen atas rangkaian byte data yang akan disimpan setelah aturan padding dan hashing Filecoin diterapkan. Jika data yang akan disimpan berupa arsip CAR, hitung komitmen dari arsip itu sendiri. Dua arsip CAR dapat memiliki CID akar IPFS yang sama meski urutan bloknya berbeda, sehingga Piece CID bisa berubah. Saat mengajukan kesepakatan penyimpanan, gunakan file yang persis sama dengan yang Anda gunakan untuk penghitungan.

Untuk mengetahui format dan aturan padding, lihat [spesifikasi Filecoin Piece](https://spec.filecoin.io/systems/filecoin_files/piece/).
