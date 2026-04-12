## Apa itu durasi?

Durasi adalah sejumlah waktu yang Anda tambahkan ke waktu dasar
atau kurangkan darinya. Kalkulator ini mulai dari tanggal dan
waktu lokal dalam zona waktu yang dipilih, lalu menerapkan
durasi yang sama ke dua arah.

## Contoh ISO 8601

- `PT45M` berarti 45 menit.
- `P2DT6H` berarti 2 hari dan 6 jam.
- `P1DT2H3M4.005S` berarti 1 hari, 2 jam, 3 menit, dan
  4,005 detik.

## Cara kerja kalkulator ini

- Masukkan waktu dasar dalam format `YYYY-MM-DD HH:mm:ss.SSS`
  dan pilih zona waktu yang ingin Anda evaluasi.
- Masukkan durasi sebagai teks ISO 8601 atau melalui kolom hari,
  jam, menit, detik, dan milidetik. Alat ini menjaga kedua
  masukan tetap sinkron dan menormalkan nilai yang meluap secara
  otomatis.
- Masukkan hanya durasi positif. Gunakan kartu hasil tambah dan
  kurang bawaan untuk membandingkan kedua arah.
- Kartu hasil menampilkan waktu lokal yang sudah disesuaikan,
  stempel waktu UTC ISO 8601, dan stempel waktu Unix dalam detik
  serta milidetik. Offset dapat berubah di sekitar transisi
  daylight saving time.
