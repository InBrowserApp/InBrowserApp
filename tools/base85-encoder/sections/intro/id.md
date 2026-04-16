## Apa itu Base85?

Base85 adalah pengodean biner-ke-teks yang mengubah 4 byte menjadi 5 karakter yang dapat dicetak. Format ini lebih rapat daripada Base64, dan alat ini memungkinkan Anda memilih ASCII85 atau Z85 sesuai format yang diharapkan penerima.

## Kapan digunakan?

- Saat Anda ingin mengodekan byte mentah, teks, atau file untuk saluran berbasis teks sambil menjaga output tetap relatif ringkas.
- Gunakan ASCII85 jika Anda memerlukan format Base85 yang fleksibel dan dapat menangani byte sisa di bagian akhir.
- Gunakan Z85 jika Anda memerlukan teks Base85 yang kompatibel dengan ZeroMQ dan panjang input tepat kelipatan 4 byte.

## Hal yang perlu diperhatikan

- Base85 adalah format pengodean, bukan enkripsi.
- ASCII85 dan Z85 memakai alfabet yang berbeda, jadi keduanya tidak saling menggantikan.
- Z85 menolak data yang panjang bytenya tidak habis dibagi 4, sedangkan ASCII85 dapat mengodekan blok akhir parsial.
