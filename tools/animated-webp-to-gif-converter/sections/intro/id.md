## Konversi WebP animasi ke GIF

WebP animasi menyimpan beberapa frame dalam satu file `.webp`. Ubah ke GIF
saat aplikasi chat, situs dokumentasi, atau platform lain memerlukan animasi
berformat GIF. Alat ini mendukung WebP animasi dengan kompresi lossy maupun
lossless. Semua pemrosesan berlangsung di perangkat Anda.

### Cara mengonversi WebP animasi ke GIF

1. Klik **Pilih file** atau letakkan WebP animasi di area unggah.
2. Klik **Buat GIF** untuk mengonversi frame dengan dimensi asli.
3. Klik **Putar** untuk memeriksa hasilnya, lalu **Unduh GIF** untuk menyimpan.

### Bagaimana durasi frame dan jumlah putaran dipertahankan?

Setiap frame mempertahankan durasinya sendiri, dengan pembulatan ke satuan
10 ms sesuai format GIF dan durasi pemutaran minimum 20 ms. Sebagai contoh,
frame berdurasi 100 ms yang diikuti frame 250 ms akan mempertahankan kedua
durasi tersebut. Jika WebP diputar sejumlah kali tertentu, GIF mempertahankan
total pemutaran tersebut. WebP yang berulang tanpa henti menghasilkan GIF
yang juga berulang tanpa henti.

### Bagaimana GIF menangani transparansi dan warna?

GIF memakai palet warna terindeks dengan maksimal 256 entri per frame,
termasuk satu entri transparan. WebP dapat menyimpan transparansi parsial,
sehingga bayangan tembus pandang dan tepi yang diperhalus bisa terlihat berbeda
pada GIF. Frame dengan banyak warna juga bisa menampilkan gradasi yang berlapis.
Periksa pratinjau dengan latar belakang yang akan Anda gunakan.

### Pertanyaan umum

#### Bisakah saya mengonversi WebP statis?

Alat ini memerlukan frame animasi. Gambar statis dan animasi sama-sama bisa
berekstensi `.webp`. Gunakan [Pembuat GIF](/id/tools/gif-maker/) untuk membuat
animasi dari beberapa gambar statis.

#### Mengapa ukuran file GIF lebih besar daripada WebP?

WebP mengompresi warna dan area yang berubah antarframe dengan efisien.
GIF bisa lebih besar meski dimensi dan durasi pemutaran sama. Jika tempat
tujuan membatasi ukuran unggahan, periksa ukuran file di samping pratinjau.

### Alat animasi terkait

Gunakan [Konverter GIF ke WebP Animasi](/id/tools/gif-to-animated-webp-converter/)
untuk konversi sebaliknya, atau [Konverter APNG ke GIF](/id/tools/apng-to-gif-converter/)
jika sumbernya PNG animasi.
