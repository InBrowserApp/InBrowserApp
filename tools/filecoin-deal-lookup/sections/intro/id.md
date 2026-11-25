## Cari kesepakatan penyimpanan Filecoin dengan Deal ID

Masukkan **Deal ID** numerik untuk kesepakatan Storage Market di mainnet Filecoin, lalu pilih **Cari kesepakatan**. Pilih **Coba contoh** untuk membuka catatan publik yang sebenarnya dan melihat status, penyedia, klien, tanggal, serta Piece CID. Alat ini mencakup kesepakatan di pasar penyimpanan (Storage Market). Filecoin Onchain Cloud menggunakan ID set data tersendiri.

## Cara membaca status kesepakatan Filecoin

Kesepakatan aktif memiliki catatan aktivasi dan belum mencapai waktu berakhir yang dijadwalkan. Status menunggu aktivasi berarti kesepakatan belum diaktifkan dan belum mencapai jadwal mulai. Alat ini juga menampilkan keadaan ketika jadwal mulai telah lewat tanpa aktivasi, kesepakatan kedaluwarsa, atau status pasar mencatat bahwa kesepakatan terkena penalti. Epoch mulai dan berakhir berasal dari proposal kesepakatan. Tanggal UTC-nya dihitung berdasarkan jadwal epoch blockchain.

## Bandingkan Piece CID kesepakatan dengan file Anda

Piece CID adalah komitmen yang dicatat untuk piece Filecoin. Salin pengenal ini untuk membandingkannya dengan komitmen yang dihitung dari file lokal atau CAR menggunakan Kalkulator Piece CID Filecoin. Hasilnya juga menampilkan ukuran piece setelah padding Filecoin. Kesepakatan terverifikasi memiliki penanda verifikasi Filecoin Plus.

## Cari kesepakatan Filecoin lama

Browser terlebih dahulu meminta status pasar saat ini dari mainnet Filecoin. Jika catatan sudah tidak ada di status tersebut, alat ini dapat menampilkan ketentuan awal yang diindeks Filfox dan menandainya sebagai catatan historis. Ketentuan itu mencakup tanggal yang dijadwalkan dan pihak yang terlibat. Pilih **Lihat di Filfox** untuk membuka Deal ID yang sama di penjelajah blok.

Lihat [referensi RPC Storage Market Filecoin](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) untuk mengetahui kolom yang dikembalikan blockchain.
