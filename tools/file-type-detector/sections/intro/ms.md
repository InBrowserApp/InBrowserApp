## Cara Pengesanan Jenis Fail Berfungsi

Alat ini membaca sehingga 64 KiB pertama fail setempat dan menyemak tandatangan
binernya dengan [file-type](https://github.com/sindresorhus/file-type). Hasilnya
merangkumi jenis MIME yang dikesan, sambungan yang dijangka dan pratonton
256 bait pertama dalam heksadesimal dan ASCII. Tiada apa-apa dimuat naik.

## Mengapa Sambungan Boleh Berbeza

Menamakan semula fail mengubah namanya, bukan kandungannya. PNG bernama photo.jpg
masih mempunyai tandatangan PNG. Alias biasa seperti .jpg dan .jpeg diterima.
MIME yang dilaporkan pelayar dipaparkan secara berasingan kerana ia sering
mengikut nama fail dan bukannya memeriksa bait.

## Batasan Pengesanan

Tandatangan ialah petunjuk, bukan bukti bahawa fail sah atau selamat. Format teks
seperti TXT, CSV dan SVG mungkin tidak dikenal pasti. Sampel pendek mungkin
mengenal pasti ZIP atau bekas lain tanpa mengesahkan subjenisnya, seperti dokumen
Office. Pratonton heks ialah kandungan fail mentah, bukan hasil tambah semak
kriptografi.
