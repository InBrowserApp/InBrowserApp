## Informasi yang ditampilkan penampil ini

Penampil Info Media membaca metadata teknis file audio dan video lokal,
termasuk MP4, MOV, MKV, WebM, AVI, MP3, FLAC, dan WAV. Gunakan untuk memeriksa
spesifikasi hasil ekspor, memeriksa tag bahasa audio sebuah film, atau mengumpulkan
laporan teknis untuk menelusuri masalah. Analisis dimulai begitu Anda memilih atau
meletakkan file di area file.

## Detail file, video, audio, dan subtitel

- **Ringkasan file:** format kontainer yang sebenarnya, ukuran file, durasi, bitrate
  keseluruhan, judul, dan aplikasi pengodean, jika tersedia.
- **Trek video:** codec, profil dan bitrate, resolusi, laju bingkai dan mode laju
  bingkai, rasio aspek, rotasi, kedalaman bit, ruang warna, subsampling kroma, dan
  format HDR.
- **Trek audio:** codec, bitrate, bahasa, judul trek, jumlah dan tata letak kanal,
  laju sampel, kedalaman bit, serta flag default atau paksa. Setiap trek audio
  ditampilkan secara terpisah, sehingga suara asli, sulih suara, dan trek komentar
  tetap dapat dibedakan.
- **Trek subtitel:** format, bahasa, judul, durasi, serta flag default atau paksa
  jika disertakan dalam file.

Spesifikasi utama langsung terlihat. Buka **Detail teknis** di dalam trek untuk
melihat kolom tambahan, atau pilih tautan jumlah trek untuk melompat ke trek pertama
dari jenis tersebut. Kolom yang tersedia bergantung pada format dan metadatanya.

## Cara memeriksa file

1. Pilih satu file audio atau video lokal, atau seret ke area file.
2. Periksa ringkasan, lalu periksa setiap trek video, audio, dan subtitel.
3. Salin laporan yang mudah dibaca untuk pesan atau tiket dukungan, atau unduh JSON
   untuk inventaris aset, skrip, atau analisis lebih lanjut. Keduanya menyertakan
   kolom teknis yang tersembunyi di bagian antarmuka yang diciutkan.
4. Pilih **Ganti file** untuk memeriksa file lain, atau **Hapus file** untuk
   mengosongkan hasil. Memilih file lain atau menghapus file saat ini juga
   menghentikan analisis yang masih berjalan.

## Memahami angka yang ditampilkan

- **Kontainer dan codec menjelaskan hal yang berbeda.** MP4 dan Matroska adalah
  kontainer; AVC/H.264, HEVC/H.265, dan AAC menjelaskan cara aliran dikodekan.
  Satu kontainer dapat memuat beberapa trek audio atau subtitel.
- **Bitrate keseluruhan mencakup seluruh file.** Nilainya mencakup semua aliran dan
  overhead kontainer. Bitrate suatu trek hanya berlaku untuk aliran tersebut.
  Bitrate menggunakan kb/s atau Mb/s; ukuran file menggunakan B, KiB, MiB, GiB, atau
  TiB.
- **Durasi mencakup milidetik.** Tampilan menggunakan `HH:MM:SS.mmm`. Laju bingkai
  menggunakan fps, dan laju sampel audio menggunakan kHz. CFR menunjukkan laju
  bingkai konstan; VFR menunjukkan laju bingkai variabel.
- **Flag trek menjelaskan pemilihan yang dimaksudkan.** Default menandai trek yang
  diutamakan; paksa biasanya digunakan untuk subtitel yang dimaksudkan agar muncul
  tanpa memilih trek subtitel lengkap. Keduanya merupakan flag terpisah yang
  dilaporkan dari file.

Beberapa kontainer tidak menyediakan bitrate terpisah untuk setiap aliran. Nilai
yang tidak tersedia tetap tidak ditampilkan atau ditandai sebagai tidak tersedia;
nilainya tidak ditebak dari nama file. Gambar sampul yang disematkan tidak dihitung
sebagai trek video.

## Kegunaan umum

Periksa resolusi dan laju bingkai setelah mengekspor video, periksa kanal dan laju
sampel sebelum menyunting audio, identifikasi beberapa trek bahasa atau komentar,
atau kumpulkan detail codec saat menelusuri masalah pemutaran. Laporan memungkinkan
Anda membagikan spesifikasi yang relevan tanpa mengirim file media.

## Pemrosesan lokal dan ekspor laporan

Analisis berlangsung di browser Anda: file media tidak diunggah dan isinya tidak
diubah. Penganalisis membaca segmen file sesuai kebutuhan, sehingga dapat memeriksa
metadata meskipun browser tidak dapat memutar kontainer atau codec tersebut.

**Salin laporan** menghasilkan ringkasan teks yang mudah dibaca. **Unduh JSON**
mengekspor metadata yang dikembalikan penganalisis, beserta nama dan ukuran file.
Dalam JSON, `Duration` menggunakan detik, `BitRate` dan `OverallBitRate` menggunakan
bit per detik, dan `SamplingRate` menggunakan hertz. Antarmuka memformatnya menjadi
satuan yang lebih mudah dibaca. Ekspor juga menyertakan kolom metadata tambahan
di luar yang ditampilkan pada kartu trek.
