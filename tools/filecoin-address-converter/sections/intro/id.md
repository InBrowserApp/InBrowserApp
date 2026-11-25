## Konversi alamat Filecoin f410 ke 0x

Tempel alamat `f410` atau `t410`, lalu pilih **Konversi alamat**. Konverter memeriksa checksum Filecoin dan menampilkan alamat `0x` bergaya Ethereum yang setara dengan checksum EIP-55. Salin hasilnya untuk dompet atau penjelajah blok yang menggunakan alamat bergaya Ethereum di Filecoin. Pilih **Coba contoh** untuk melihat konversi tanpa memasukkan alamat Anda sendiri.

## Konversi alamat 0x ke Filecoin

Tempel alamat `0x` dengan 40 digit heksadesimal. Pilih **Mainnet** untuk alamat `f410` atau **Testnet Calibration** untuk alamat `t410`. Format `0x` tidak memiliki awalan jaringan, sehingga rangkaian byte yang sama dapat ditulis dengan salah satu dari kedua awalan Filecoin. Pilih jaringan yang dipakai dompet, penjelajah blok, atau bursa Anda. Input heksadesimal boleh seluruhnya dalam huruf kecil atau huruf besar. Input yang mencampur keduanya harus lulus pemeriksaan checksum EIP-55.

## Apa arti f410 dan t410?

Keduanya adalah alamat delegasi yang digunakan Filecoin Ethereum Virtual Machine (FEVM). Alamat `f410` atau `t410` dan format `0x` yang setara mewakili alamat 20 byte yang sama pada jaringan Filecoin yang dipilih. Format asli Filecoin memakai Base32 dan checksum tersendiri. Konversi format mempertahankan byte tersebut dan tidak memindahkan FIL antarjaringan.

## Bisakah saya mengonversi alamat f0, f1, f2, atau f3?

Alat ini mengonversi alamat delegasi FEVM di namespace `10`, yang ditandai dengan awalan `f410` atau `t410`. Alamat ID actor, representasinya yang memakai mask `0xff0000…`, dan jenis alamat Filecoin lainnya berada di luar cakupan ini. Pemetaan beberapa jenis alamat asli ke actor memerlukan status blockchain. Konversi ini berjalan di browser tanpa panggilan RPC atau sambungan dompet.

Lihat [panduan Filecoin tentang jenis alamat dan transfer FIL](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) dan [spesifikasi checksum EIP-55](https://eips.ethereum.org/EIPS/eip-55).
