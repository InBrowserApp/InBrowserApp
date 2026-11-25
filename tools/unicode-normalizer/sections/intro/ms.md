## Cara menormalkan teks Unicode

Taip atau tampal teks dalam ruang **Teks asal**, kemudian pilih bentuk penormalan. Hasil dikemas kini semasa anda menaip atau menukar bentuk. Pilih **Salin hasil** untuk menggunakan teks yang dinormalkan dalam aplikasi lain. Penukaran berlaku dalam pelayar dan teks anda kekal pada peranti sendiri.

## Bentuk penormalan Unicode manakah yang sesuai?

- **NFC (penggabungan kanonik)** sesuai sebagai pilihan lalai untuk teks umum. NFC menggabungkan huruf dan tanda aksen menjadi satu titik kod jika aksara gabungan itu tersedia. Gunakan NFC untuk menyeragamkan perwakilan yang setara sebelum menyimpan atau membandingkan teks.
- **NFD (penguraian kanonik)** menguraikan jujukan kepada komponen kanoniknya, seperti huruf asas dan tanda aksen gabungan. Gunakan NFD untuk memeriksa atau memproses tanda secara berasingan.
- **NFKC (penggabungan keserasian)** turut menyeragamkan varian keserasian seperti huruf lebar penuh dan ligatur. Bentuk ini berguna untuk carian atau padanan jika perbezaan tersebut tidak penting.
- **NFKD (penguraian keserasian)** menggunakan pemetaan keserasian yang sama tetapi mengekalkan hasil dalam bentuk terurai, yang berguna untuk analisis teks.

## Mengapakah teks yang dinormalkan kadangkala kelihatan sama?

Huruf **é** boleh disimpan sebagai `U+00E9` atau sebagai **e** diikuti tanda aksen akut gabungan (`U+0065 U+0301`). NFC menghasilkan perwakilan pertama, manakala NFD menghasilkan perwakilan kedua. Buka **Bandingkan titik kod** untuk melihat jujukan titik kod pada permulaan setiap teks, walaupun kedua-duanya kelihatan sama.

Pilih **Cuba contoh** untuk melihat aksara yang berubah rupa. Dengan NFKC, **ＡＢＣ ① ﬁ** menjadi **ABC 1 fi**. NFC mengekalkan perbezaan antara varian keserasian ini.

## Bilakah penormalan boleh mengubah makna?

NFKC dan NFKD boleh menghilangkan perbezaan format, misalnya superskrip dalam rumus atau angka berbulat dalam senarai. Pilih NFC jika perbezaan itu penting. Penormalan berbeza daripada penukaran huruf besar dan kecil, pembuangan aksen atau penukaran antara pengekodan seperti UTF-8 dan UTF-16.

Ketahui lebih lanjut dalam [Lampiran Piawaian Unicode tentang bentuk penormalan](https://www.unicode.org/reports/tr15/).
