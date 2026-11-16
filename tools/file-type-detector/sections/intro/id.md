## Cara Kerja Deteksi Jenis File

Alat ini membaca hingga 64 KiB pertama dari file lokal dan memeriksa tanda tangan
binernya dengan [file-type](https://github.com/sindresorhus/file-type). Hasilnya
mencakup jenis MIME yang terdeteksi, ekstensi yang diharapkan, dan pratinjau
256 byte pertama dalam heksadesimal dan ASCII. Tidak ada yang diunggah.

## Mengapa Ekstensi Bisa Tidak Sesuai

Mengganti nama file mengubah namanya, bukan isinya. PNG bernama photo.jpg tetap
memiliki tanda tangan PNG. Alias umum seperti .jpg dan .jpeg diterima.
MIME yang dilaporkan browser ditampilkan secara terpisah karena sering mengikuti
nama file, bukan memeriksa byte-nya.

## Batasan Deteksi

Tanda tangan adalah petunjuk, bukan bukti bahwa file valid atau aman. Format teks
seperti TXT, CSV, dan SVG mungkin tidak dikenali. Sampel singkat mungkin mengenali
ZIP atau kontainer lain tanpa memastikan subjenisnya, seperti dokumen Office.
Pratinjau heksadesimal adalah isi file mentah, bukan checksum kriptografis.
