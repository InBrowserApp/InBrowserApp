## Buka fail CAR IPFS atau Filecoin dalam talian

Pilih fail `.car` daripada peranti anda. Alat ini membaca arkib pada peranti dan memaparkan CID akarnya. Jika arkib mengandungi lebih daripada satu CID akar, pilih yang ingin anda buka. CAR ialah singkatan bagi Content Addressable aRchive, format arkib yang digunakan oleh IPFS dan Filecoin. Katalog aset Apple menggunakan format lain dengan sambungan fail yang sama.

## Ekstrak fail atau tukar folder dalam CAR kepada ZIP

Buka folder untuk melihat kandungannya. Pilih fail, kemudian pilih **Muat turun fail** untuk menyimpan data asalnya. Pilih **Muat turun ZIP** untuk mengeksport folder bersama subfoldernya. Fail ZIP mengekalkan struktur folder UnixFS.

## Apakah maksud blok yang hilang?

CAR menyimpan kandungan dalam blok yang dikenal pasti melalui CID. CID akar boleh merujuk kepada blok yang berada di luar arkib yang tidak lengkap. Jika entri memerlukan blok yang tiada, dapatkan eksport lengkap daripada sumber atau muat turun entri yang bloknya tersedia. Fail CAR juga boleh menyimpan data dalam format IPLD lain. Alat ini mengekstrak fail dan folder yang menggunakan UnixFS. [Format CAR IPLD](https://ipld.io/specs/transport/car/)
