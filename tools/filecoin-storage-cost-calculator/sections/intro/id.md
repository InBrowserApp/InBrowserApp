## Perkirakan biaya penyimpanan Filecoin Onchain Cloud

Masukkan ukuran data, **Masa simpan (hari)**, dan **Jumlah salinan**. Kalkulator memperkirakan biaya menyimpan set data baru untuk setiap salinan dengan Filecoin Warm Storage Service. Hasilnya menampilkan tarif bulanan untuk penyimpanan dan pembuktian, pengeluaran selama periode yang dipilih, serta biaya membuat set data dan menambahkan piece. Semua nilai ditampilkan dalam USDFC. Filecoin menetapkan satu bulan penagihan sebagai 30 hari.

## Cara menghitung perkiraan biaya penyimpanan

Setiap set data aktif dikenai tarif penyimpanan berdasarkan ukurannya, ditambah biaya tetap untuk Proof of Data Possession (PDP). Misalnya, dengan tarif penyimpanan 2,50 USDFC per TiB dan biaya pembuktian 0,12 USDFC per salinan, menyimpan satu TiB dalam dua salinan memerlukan sekitar 5,24 USDFC setiap 30 hari. Perkiraan menggunakan ukuran data yang Anda masukkan. Filecoin menghitung ukuran tagihan yang tepat dari simpul daun yang memuat data. Ini dapat menambah hingga 31 byte per piece.

## Rencanakan biaya unggahan dan cadangan yang dapat dikembalikan

Buka **Detail unggahan** untuk memasukkan jumlah piece dan batch unggahan untuk tiap salinan. Setelan bawaan menggunakan satu piece dalam satu batch. Setiap salinan memiliki biaya pembuatan set data sendiri. Penambahan piece dikenai biaya dasar per batch dan biaya per piece. Layanan menahan saldo cadangan untuk menutup biaya operasi selama siklus hidup data. Cadangan ditampilkan terpisah dari perkiraan pengeluaran. Dana yang tidak terpakai dilepas setelah penyelesaian tagihan. Perkiraan ini mencakup unggahan baru dan masa simpannya. Pengambilan data dan operasi selanjutnya memiliki biaya tersendiri.

## Dari mana tarif Filecoin berasal?

Halaman ini menggunakan tarif acuan bertanggal yang ditampilkan di samping hasil. Pilih **Perbarui tarif mainnet** untuk membaca kontrak penetapan harga Warm Storage melalui RPC Filecoin publik. Browser menggunakan tarif yang diterima dan menampilkan blok sumbernya. Anda tetap dapat menghitung dengan tarif acuan jika permintaan itu tidak dapat diselesaikan.

Baca [panduan biaya penyimpanan Filecoin](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) untuk mengetahui ukuran yang ditagihkan, pendanaan yang diperlukan untuk tiap akun, dan daftar biaya lengkap.
