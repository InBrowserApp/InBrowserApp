## Maklumat yang ditunjukkan oleh pemapar ini

Pemapar Maklumat Media membaca metadata teknikal fail audio dan video setempat,
termasuk MP4, MOV, MKV, WebM, AVI, MP3, FLAC dan WAV. Gunakannya untuk menyemak
spesifikasi fail yang dieksport, menyemak tag bahasa audio sesebuah filem atau
mengumpulkan laporan teknikal untuk menyelesaikan masalah. Analisis bermula sebaik
sahaja anda memilih atau melepaskan fail.

## Butiran fail, video, audio dan sari kata

- **Gambaran keseluruhan fail:** format bekas sebenar, saiz fail, tempoh, kadar bit
  keseluruhan, tajuk dan aplikasi pengekodan, apabila tersedia.
- **Trek video:** kodek, profil dan kadar bit, resolusi, kadar bingkai dan mod kadar
  bingkai, nisbah aspek, putaran, kedalaman bit, ruang warna, pensubsampelan kroma
  dan format HDR.
- **Trek audio:** kodek, kadar bit, bahasa, tajuk trek, bilangan dan susun atur
  saluran, kadar pensampelan, kedalaman bit serta penanda lalai atau paksa. Setiap
  trek audio disenaraikan secara berasingan supaya trek bunyi asal, alih suara
  dan ulasan kekal berbeza.
- **Trek sari kata:** format, bahasa, tajuk, tempoh serta penanda lalai atau paksa
  apabila disertakan dalam fail.

Spesifikasi utama dipaparkan serta-merta. Buka **Butiran teknikal** dalam sesuatu
trek untuk melihat medan tambahan, atau pilih pautan bilangan trek untuk terus
ke trek pertama bagi jenis tersebut. Medan yang tersedia bergantung pada format
dan metadatanya.

## Cara memeriksa fail

1. Pilih satu fail audio atau video setempat, atau seretnya ke kawasan fail.
2. Semak ringkasan, kemudian periksa setiap trek video, audio dan sari kata.
3. Salin laporan yang mudah dibaca untuk mesej atau tiket sokongan, atau muat
   turun JSON untuk inventori aset, skrip atau analisis lanjut. Kedua-duanya
   merangkumi medan teknikal yang dilipat dalam antara muka.
4. Pilih **Tukar fail** untuk memeriksa fail lain, atau **Alih keluar fail** untuk
   mengosongkan hasil. Memilih fail lain atau mengalih keluar fail semasa turut
   menghentikan sebarang analisis yang masih berjalan.

## Memahami angka

- **Bekas dan kodek menerangkan perkara yang berbeza.** MP4 dan Matroska ialah
  bekas; AVC/H.264, HEVC/H.265 dan AAC menerangkan cara strim dikodkan. Satu bekas
  boleh mengandungi beberapa trek audio atau sari kata.
- **Kadar bit keseluruhan meliputi seluruh fail.** Ia merangkumi semua strim dan
  data tambahan bekas. Kadar bit sesuatu trek hanya merujuk kepada strim tersebut.
  Kadar bit menggunakan kb/s atau Mb/s; saiz fail menggunakan B, KiB, MiB, GiB atau
  TiB.
- **Tempoh merangkumi milisaat.** Paparan menggunakan `HH:MM:SS.mmm`. Kadar bingkai
  menggunakan fps dan kadar pensampelan audio menggunakan kHz. CFR menunjukkan
  kadar bingkai malar; VFR menunjukkan kadar bingkai berubah-ubah.
- **Penanda trek menerangkan pemilihan yang dimaksudkan.** Lalai menandakan trek
  pilihan; paksa biasanya digunakan untuk sari kata yang dimaksudkan untuk muncul
  tanpa memilih trek sari kata penuh. Kedua-duanya ialah penanda berasingan yang
  dilaporkan daripada fail.

Sesetengah bekas tidak menyediakan kadar bit berasingan untuk setiap strim. Nilai
yang tidak tersedia tidak dipaparkan atau ditandakan sebagai tidak tersedia;
nilai tersebut tidak diteka daripada nama fail. Imej kulit terbenam tidak dikira
sebagai trek video.

## Kegunaan biasa

Semak resolusi dan kadar bingkai selepas mengeksport video, periksa saluran dan
kadar pensampelan sebelum menyunting audio, kenal pasti trek berbilang bahasa atau
ulasan, atau kumpulkan butiran kodek semasa menyiasat masalah main balik. Laporan
ini membolehkan anda berkongsi spesifikasi yang berkaitan tanpa menghantar fail
media.

## Pemprosesan setempat dan eksport laporan

Analisis dilakukan dalam pelayar anda: fail media tidak dimuat naik dan
kandungannya tidak diubah. Penganalisis membaca segmen fail mengikut keperluan,
jadi ia boleh memeriksa metadata walaupun pelayar tidak dapat memainkan bekas atau
kodek tersebut.

**Salin laporan** menghasilkan ringkasan teks yang mudah dibaca. **Muat turun
JSON** mengeksport metadata yang dikembalikan oleh penganalisis bersama-sama nama
dan saiz fail. Dalam JSON, `Duration` menggunakan saat, `BitRate` dan
`OverallBitRate` menggunakan bit sesaat, manakala `SamplingRate` menggunakan hertz.
Antara muka memformatkannya kepada unit yang lebih mudah dibaca. Eksport itu
turut mengekalkan medan metadata tambahan selain yang dipaparkan dalam kad trek.
