## Apakah subset fon?

Subset fon mengandungi aksara yang diperlukan untuk sesuatu teks, bersama glif
sokongan yang diperlukan untuk memaparkannya. Membuang glif yang tidak digunakan
boleh mengurangkan saiz muat turun fon dengan ketara, terutamanya untuk fon Cina,
Jepun dan Korea yang besar atau tajuk tetap, logo atau halaman kempen.

## Cara menggunakan alat ini

Pilih fail TTF, OTF, WOFF atau WOFF2 dan tampal semua teks yang akan menggunakan
fon tersebut. Pilih WOFF2 untuk penghantaran melalui web atau TTF / OTF untuk
fon tanpa pemampatan, kemudian jana subset. Bandingkan saiz, semak pratonton,
dan muat turun fon bersama CSS yang sepadan. Pemprosesan fon berjalan secara
setempat dalam Web Worker.

## Apakah yang dikekalkan?

HarfBuzz mengekalkan kebergantungan glif dan ciri susun atur OpenType yang
diperlukan untuk ligatur, kerning, tanda gabungan dan sistem tulisan kompleks.
Hinting dan paksi fon berubah dikekalkan. Bentuk teks tergabung dan terurai
yang setara secara kanonik disertakan jika disokong oleh fon sumber. Pratonton
menggunakan fon yang dijana, dan aksara yang tiada dalam fon sumber disenaraikan
secara berasingan.

## Petua praktikal

- Sertakan ruang, tanda baca, nombor dan setiap rentetan terjemahan yang
  diperlukan. Tambah praset Latin jika teks anda juga mengandungi aksara Latin asas.
- Jana semula subset setiap kali teks anda berubah. Subset tetap paling sesuai
  untuk kandungan yang diketahui; gunakan liputan aksara yang lebih luas untuk
  teks yang dijana pengguna.
- Subset tidak dapat menambah aksara yang tiada dalam fon asal. Kekalkan fon
  gantian CSS untuk aksara di luar subset.
- Gunakan fon yang lesennya membenarkan pengubahsuaian dan pembenaman pada web.
  Koleksi fon (`.ttc` / `.otc`) mesti dieksport sebagai fon berasingan terlebih dahulu.
- Fon kecil atau fon yang sudah disubset mungkin tidak menjadi lebih kecil.
  WOFF2 biasanya memberikan saiz muat turun web yang paling kecil; bilangan
  glif turut merangkumi glif sokongan.
