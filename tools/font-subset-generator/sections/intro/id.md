## Apa itu subset font?

Subset font memuat karakter yang diperlukan untuk teks tertentu, beserta glif
pendukung yang dibutuhkan untuk menampilkannya. Menghapus glif yang tidak dipakai
dapat sangat mengurangi ukuran unduhan font, terutama untuk font Mandarin,
Jepang, dan Korea yang besar, atau judul tetap, logo, dan halaman kampanye.

## Cara menggunakan alat ini

Pilih file TTF, OTF, WOFF, atau WOFF2, lalu tempel semua teks yang akan
menggunakannya. Pilih WOFF2 untuk web atau TTF / OTF untuk font tanpa kompresi,
lalu buat subset. Bandingkan ukurannya, periksa pratinjau, dan unduh font beserta
CSS yang sesuai. Pemrosesan font berlangsung secara lokal di dalam Web Worker.

## Apa yang dipertahankan?

HarfBuzz mempertahankan dependensi glif dan fitur tata letak OpenType yang
diperlukan untuk ligatur, kerning, tanda gabung, dan sistem tulisan kompleks.
Hinting dan sumbu font variabel juga dipertahankan. Bentuk teks tersusun dan
terurai yang setara secara kanonis disertakan jika didukung font sumber.
Pratinjau menggunakan font yang dihasilkan, sedangkan karakter yang tidak tersedia
di font sumber dicantumkan secara terpisah.

## Tips praktis

- Sertakan spasi, tanda baca, angka, dan semua teks terjemahan yang diperlukan.
  Tambahkan set Latin bawaan jika teks Anda juga akan memuat karakter Latin dasar.
- Buat ulang subset setiap kali teks berubah. Subset tetap paling sesuai untuk
  konten yang sudah diketahui; gunakan cakupan karakter yang lebih luas untuk
  konten buatan pengguna.
- Pembuatan subset tidak dapat menambahkan karakter yang tidak tersedia dalam
  font asli. Sediakan font cadangan di CSS untuk karakter di luar subset.
- Gunakan font dengan lisensi yang mengizinkan modifikasi dan penyematan di web.
  Koleksi font (`.ttc` / `.otc`) harus diekspor sebagai font terpisah terlebih dahulu.
- Font kecil atau font yang sudah berupa subset mungkin tidak menjadi lebih
  kecil. WOFF2 biasanya memberikan unduhan terkecil untuk web; jumlah glif juga
  mencakup glif pendukung.
