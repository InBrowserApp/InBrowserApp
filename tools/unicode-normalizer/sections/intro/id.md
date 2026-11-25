## Cara menormalisasi teks Unicode

Ketik atau tempel teks di kolom **Teks asli**, lalu pilih bentuk normalisasi. Hasil langsung diperbarui saat Anda mengetik atau mengganti bentuk. Pilih **Salin hasil** untuk menggunakan teks yang telah dinormalisasi di aplikasi lain. Konversi berlangsung di peramban dan teks Anda tetap berada di perangkat.

## Bentuk normalisasi Unicode mana yang sebaiknya dipilih?

- **NFC (komposisi kanonis)** cocok sebagai pilihan awal untuk teks umum. Jika karakter gabungannya tersedia, NFC menyatukan huruf dan aksen menjadi satu titik kode. Gunakan NFC untuk menyeragamkan representasi yang setara sebelum menyimpan atau membandingkan teks.
- **NFD (dekomposisi kanonis)** memisahkan urutan karakter menjadi komponen kanonisnya, misalnya huruf dasar dan tanda aksen penggabung. Gunakan NFD untuk memeriksa atau mengolah setiap tanda secara terpisah.
- **NFKC (komposisi kompatibilitas)** juga menyamakan varian kompatibilitas, seperti huruf lebar penuh dan ligatur. Bentuk ini berguna untuk pencarian atau pencocokan ketika perbedaan tersebut tidak penting.
- **NFKD (dekomposisi kompatibilitas)** menerapkan pemetaan kompatibilitas yang sama dengan hasil yang tetap terurai. Bentuk ini berguna untuk analisis teks.

## Mengapa teks yang dinormalisasi bisa tampak sama?

Huruf **é** dapat disimpan sebagai `U+00E9` atau sebagai **e** yang diikuti tanda aksen akut penggabung (`U+0065 U+0301`). NFC menghasilkan representasi pertama, sedangkan NFD menghasilkan representasi kedua. Buka **Bandingkan titik kode** untuk melihat urutan titik kode di awal masing-masing teks, meskipun keduanya tampak sama.

Pilih **Coba contoh** untuk melihat karakter yang juga berubah secara kasatmata. Dengan NFKC, **ＡＢＣ ① ﬁ** menjadi **ABC 1 fi**. NFC mempertahankan perbedaan di antara varian tersebut.

## Kapan normalisasi dapat mengubah makna?

NFKC dan NFKD dapat menghilangkan perbedaan format, seperti superskrip dalam rumus atau angka di dalam lingkaran pada daftar. Pilih NFC jika perbedaan tersebut penting. Normalisasi berbeda dengan mengubah huruf besar dan kecil, menghapus aksen, atau mengonversi pengodean seperti UTF-8 ke UTF-16.

Baca lebih lanjut di [Lampiran Standar Unicode tentang bentuk normalisasi](https://www.unicode.org/reports/tr15/).
