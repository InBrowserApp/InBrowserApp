## Kira Piece CID daripada arkib CAR atau fail

Pilih fail yang akan anda hantar kepada penyedia storan Filecoin. Pilih **Kira Piece CID**, kemudian salin pengecam dalam format yang diperlukan. Alat ini turut menunjukkan saiz piece selepas pengisian dalam bait. Pelayar membaca fail pada peranti dan memprosesnya bahagian demi bahagian supaya kandungan fail kekal pada peranti anda.

## Format manakah yang patut saya gunakan?

**Piece CID (v2)** mengikut [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Pengecam ini biasanya bermula dengan `bafkzci` dan mengandungi maklumat saiz data yang diperlukan oleh alat Filecoin yang lebih baharu. **CommP versi lama (v1)** biasanya bermula dengan `baga6ea4` dan digunakan dalam perjanjian storan Filecoin tradisional. Jika proses anda memerlukan Piece CID versi lama dan saiz piece selepas pengisian, salin komitmen versi lama dan gunakan saiz yang dipaparkan di sebelahnya. Anda boleh menampal mana-mana format untuk menyemak sama ada komitmen sedia ada sepadan dengan fail anda. CommP versi lama boleh memberikan nilai yang sama untuk fail yang hanya berbeza dari segi bilangan bait sifar di hujung.

## Mengapakah CID IPFS saya kelihatan berbeza?

CID akar IPFS mengenal pasti satu blok atau akar fail atau folder. Piece CID Filecoin ialah komitmen untuk jujukan bait tepat bagi data yang akan disimpan selepas peraturan pengisian dan pencincangan Filecoin digunakan. Jika data yang hendak disimpan ialah arkib CAR, kira komitmen daripada arkib itu sendiri. Dua arkib CAR boleh mempunyai CID akar IPFS yang sama walaupun turutan bloknya berbeza. Perbezaan turutan itu boleh mengubah Piece CID. Apabila menyerahkan perjanjian storan, gunakan fail yang sama seperti semasa pengiraan.

Untuk format dan peraturan pengisian, lihat [spesifikasi Filecoin Piece](https://spec.filecoin.io/systems/filecoin_files/piece/).
