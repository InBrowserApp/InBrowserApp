## Tukar alamat Filecoin f410 kepada 0x

Tampal alamat `f410` atau `t410`, kemudian pilih **Tukar alamat**. Penukar menyemak checksum Filecoin dan memaparkan alamat `0x` gaya Ethereum yang sepadan dengan checksum EIP-55. Salin hasilnya untuk digunakan dalam dompet atau peneroka blok yang menggunakan alamat gaya Ethereum pada Filecoin. Pilih **Cuba contoh** untuk melihat penukaran tanpa memasukkan alamat sendiri.

## Tukar alamat 0x kepada Filecoin

Tampal alamat `0x` dengan 40 digit heksadesimal. Pilih **Mainnet** untuk mendapatkan alamat `f410` atau **Testnet** untuk mendapatkan alamat `t410`. Calibration menggunakan awalan `t410` yang sama seperti testnet Filecoin lain. Format `0x` tidak mengandungi awalan rangkaian, jadi turutan bait yang sama boleh ditulis dengan mana-mana awalan Filecoin. Pilih rangkaian yang digunakan oleh dompet, peneroka blok atau bursa anda. Input heksadesimal diterima dalam huruf kecil atau huruf besar sepenuhnya. Input yang mencampurkan kedua-duanya mesti lulus semakan checksum EIP-55.

## Apakah maksud f410 dan t410?

Kedua-duanya ialah alamat delegasi yang digunakan oleh Filecoin Ethereum Virtual Machine (FEVM). Alamat `f410` atau `t410` dan format `0x` yang setara mewakili alamat 20 bait yang sama dalam rangkaian Filecoin yang dipilih. Format asal Filecoin menggunakan Base32 dan checksumnya sendiri. Penukaran format mengekalkan bait tersebut dan tidak memindahkan FIL antara rangkaian.

## Bolehkah saya menukar alamat f0, f1, f2 atau f3?

Alat ini menukar alamat delegasi FEVM dalam ruang nama `10`, yang dikenal pasti melalui awalan `f410` atau `t410`. Alamat ID actor, bentuknya yang bertopeng `0xff0000…` dan jenis alamat Filecoin yang lain berada di luar skop ini. Pemetaan sesetengah jenis alamat asal kepada actor memerlukan keadaan rantaian blok. Penukaran ini berjalan dalam pelayar tanpa panggilan RPC atau sambungan dompet.

Lihat [panduan Filecoin untuk jenis alamat dan pindahan FIL](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) dan [spesifikasi checksum EIP-55](https://eips.ethereum.org/EIPS/eip-55).
