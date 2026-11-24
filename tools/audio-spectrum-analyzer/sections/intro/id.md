## Periksa frekuensi dalam file audio

Gunakan penganalisis spektrum audio untuk mencari dengungan rendah, membandingkan kandungan frekuensi, atau melihat tempat frekuensi tinggi mulai berkurang dalam rekaman. Grafik menampilkan frekuensi dalam hertz (Hz) dan level dalam desibel relatif terhadap skala penuh digital (dBFS). Puncak menunjukkan pita frekuensi yang membawa energi paling besar dalam rekaman.

## Cara melihat spektrum audio

1. Pilih atau seret dan letakkan file WAV, MP3, M4A, FLAC, atau OGG mono atau stereo. Dukungan dekode bergantung pada browser.
2. Lihat frekuensi terkuat, lalu arahkan kursor ke grafik atau ketuk grafik untuk membaca frekuensi lain beserta levelnya. Penggeser bisa dikendalikan dengan papan ketik untuk mendapatkan bacaan yang sama.
3. Beralih antara skala logaritmik dan linear sesuai kebutuhan. Putar file asli untuk mendengarkan rekaman sambil memeriksa grafik. Analisis dan pemutaran tetap berlangsung di perangkat Anda.

## Cara membaca grafik FFT

Alat mendekode audio pada 48 kHz. Sejumlah cuplikan pendek diambil dari berbagai bagian file, diberi jendela Hann, lalu dianalisis menggunakan transformasi Fourier cepat (FFT). Alat menghitung daya rata-rata cuplikan dan menggabungkan kanal stereo berdasarkan daya, sehingga suara yang fasenya berbeda antarkanal tetap terlihat. Grafik mencapai 24 kHz. Bacaan level mewakili setiap bin frekuensi, sehingga nilainya berbeda dari volume keseluruhan, puncak sampel, atau LUFS terintegrasi.

Puncak tajam di sekitar 50 atau 60 Hz dapat menandakan dengungan listrik. Penurunan mendadak pada frekuensi tinggi dapat terjadi karena pemfilteran atau kompresi. Satu puncak bisa merupakan harmonik, jadi periksa puncak di sekitarnya sebelum menggunakannya untuk mengenali tinggi nada.

## Kapan sebaiknya memakai skala frekuensi logaritmik atau linear?

Skala logaritmik memberi lebih banyak ruang bagi frekuensi bas dan tengah serta memudahkan Anda mengikuti oktaf. Skala linear memberi jarak yang sama untuk setiap kenaikan Hz yang sama. Ini berguna untuk membandingkan harmonik berjarak teratur. Grafik ini merangkum kandungan frekuensi di seluruh rekaman. Gunakan spektrogram untuk mengetahui kapan suara muncul atau bagaimana frekuensinya berubah seiring waktu.
