## Konversi PNG animasi ke GIF

APNG menyimpan beberapa frame dalam satu file PNG. Ubah ke GIF untuk aplikasi
chat, forum, atau dokumentasi yang menampilkan animasi dalam format GIF.
File PNG animasi dapat berekstensi `.apng` atau `.png`. Konverter membaca animasi
di dalam file dan memprosesnya di perangkat Anda.

### Cara mengonversi APNG ke GIF

1. Klik **Pilih file** atau letakkan PNG animasi di area unggah.
2. Klik **Buat GIF** untuk mengonversi frame dengan dimensi asli.
3. Klik **Putar** untuk memeriksa hasilnya, lalu **Unduh GIF** untuk menyimpan.

### Bagaimana durasi frame dan jumlah putaran dipertahankan?

Setiap frame mempertahankan durasinya sendiri, dengan pembulatan ke satuan
10 ms sesuai format GIF dan durasi pemutaran minimum 20 ms. Sebagai contoh,
frame berdurasi 100 ms yang diikuti frame 250 ms akan mempertahankan kedua
durasi tersebut. GIF mengikuti jumlah pemutaran sumber, baik sekali, beberapa
kali, atau tanpa henti. Untuk animasi dengan putaran terbatas, GIF mendukung
hingga 65.536 kali pemutaran.

### Bagaimana GIF menangani transparansi dan warna?

APNG mendukung transparansi parsial dan frame berwarna penuh. GIF memakai
palet warna terindeks dengan maksimal 256 entri per frame, termasuk satu
entri transparan. Tepi halus dan bayangan bisa tampak lebih tegas, sedangkan
gradasi halus bisa terlihat berlapis. Periksa pratinjau GIF sebelum membagikannya.
Jika tempat tujuan mendukung PNG animasi, file sumber tetap mempertahankan warna
penuh dan transparansi parsial.

### Pertanyaan umum

#### Bisakah saya mengonversi PNG biasa?

Alat ini memerlukan data animasi PNG. File berekstensi `.png` juga bisa berisi
animasi. Jika animasi memiliki gambar cadangan terpisah untuk penampil PNG
statis, GIF akan dimulai dari frame animasi pertama.

#### Apakah ukuran file GIF lebih kecil daripada APNG?

Ukuran file bergantung pada dimensi kanvas, jumlah frame, dan detail gambar.
GIF bisa lebih besar, terutama jika APNG sumber hanya menyimpan area kecil yang
berubah antarframe. Periksa ukuran file hasil di samping pratinjau GIF.

### Alat animasi terkait

Gunakan [Konverter GIF ke APNG](/id/tools/gif-to-apng-converter/) untuk konversi
sebaliknya, atau [Konverter WebP Animasi ke GIF](/id/tools/animated-webp-to-gif-converter/)
jika sumbernya WebP.
