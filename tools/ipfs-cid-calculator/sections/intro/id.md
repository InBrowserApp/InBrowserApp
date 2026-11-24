## Hitung CID untuk file atau folder

Pilih file atau folder dari perangkat, lalu pilih **Hitung CID**. Salin pengenal konten (CID) untuk dicatat dalam manifes atau dibandingkan dengan hasil impor IPFS sebelumnya. Penghitungan berlangsung di browser. File tetap berada di perangkat Anda dan tidak dipublikasikan ke IPFS.

## Mengapa file yang sama bisa memiliki CID IPFS yang berbeda?

IPFS dapat membagi file menjadi beberapa blok dan menggunakan UnixFS untuk menyimpan tautan antarblok. CID akar bergantung pada cara blok dibagi, dikodekan, dan disusun. Untuk mendapatkan CID yang sama, gunakan ukuran potongan, pengaturan blok daun mentah, dan struktur folder yang sama seperti pada impor awal. CID folder juga dipengaruhi oleh nama file dan folder di dalamnya. Pemilih folder di browser melewati subfolder kosong.

## Hitung ulang CID dengan Kubo

Buka **Pengaturan impor** untuk mengubah versi CID, ukuran potongan, penggunaan blok daun mentah, atau pembungkusan dalam folder. CIDv1 adalah setelan bawaan. Gunakan CIDv0 untuk mencocokkan hasil impor lama yang memakai versi tersebut. **Bungkus dalam folder** menambahkan folder luar sehingga file dapat diakses berdasarkan namanya di bawah CID akar.

Salin perintah `ipfs add --only-hash` yang ditampilkan untuk mengulangi penghitungan pada file atau folder yang sama dengan Kubo. Jika Anda memiliki CID dari impor sebelumnya, tempelkan ke kolom perbandingan. CIDv0 dan CIDv1 yang setara akan cocok karena menunjuk ke blok yang sama. [Dokumentasi IPFS tentang pengenal konten](https://docs.ipfs.tech/concepts/content-addressing/)
