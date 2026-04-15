## Apa yang dilakukan alat ini

- Mengodekan teks biasa menjadi HTML entity bernama, desimal, atau
  heksadesimal.
- Mendekode potongan yang sudah di-entity-kan kembali menjadi teks yang mudah
  dibaca.
- Semuanya berjalan lokal di browser, jadi data Anda tetap berada di perangkat.

## Kapan digunakan

- Escape karakter khusus sebelum menempelkan HTML ke dokumentasi, template,
  atau demo.
- Memeriksa markup yang disalin dan berisi `&amp;`, `&#60;`, atau `&#x3C;`.
- Membandingkan entity bernama, desimal, dan heksadesimal untuk kebutuhan
  kompatibilitas.

## Catatan tentang format entity

- Entity bernama paling mudah dibaca, tetapi tidak semua karakter memilikinya.
- Entity desimal dan heksadesimal dapat mewakili karakter Unicode apa pun,
  termasuk emoji.
- Entity yang tidak dikenal atau tidak valid akan dibiarkan apa adanya saat
  didekode.
