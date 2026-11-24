## Kira CID untuk fail atau folder

Pilih fail atau folder pada peranti anda, kemudian pilih **Kira CID**. Salin pengecam kandungan (CID) untuk mencatatkannya dalam manifes atau membandingkannya dengan hasil import IPFS terdahulu. Pengiraan dibuat dalam pelayar anda. Fail kekal pada peranti dan tidak diterbitkan ke IPFS.

## Mengapakah fail yang sama boleh mempunyai CID IPFS yang berbeza?

IPFS boleh membahagikan fail kepada blok dan menggunakan UnixFS untuk menyimpan pautan antara blok. CID akar bergantung pada cara blok dibahagikan, dikodkan dan disusun. Untuk menghasilkan semula CID, gunakan saiz bahagian, tetapan blok daun mentah dan struktur folder yang sama seperti import asal. Nama fail dan folder di dalam folder turut mempengaruhi CID folder. Pemilih folder pelayar mengabaikan subfolder yang kosong.

## Hasilkan semula CID dengan Kubo

Buka **Tetapan import** untuk menukar versi CID, saiz bahagian, penggunaan blok daun mentah atau pembungkusan dalam folder. CIDv1 ialah versi lalai. Gunakan CIDv0 untuk memadankan hasil import lama yang menggunakan versi itu. **Bungkus dalam folder** menambah folder luar supaya fail boleh dicapai mengikut nama di bawah CID akar.

Salin perintah `ipfs add --only-hash` yang dipaparkan untuk mengira semula CID bagi fail atau folder yang sama dengan Kubo. Jika anda mempunyai CID daripada import terdahulu, tampalkannya ke dalam medan perbandingan. CIDv0 dan CIDv1 yang setara sepadan kerana kedua-duanya mengenal pasti blok yang sama. [Dokumentasi IPFS tentang pengecam kandungan](https://docs.ipfs.tech/concepts/content-addressing/)
