## Untuk apa alat ini

Gunakan alat ini untuk membandingkan jam perangkat Anda dengan waktu yang
diambil dari jaringan. Alat ini mengambil stempel waktu dari endpoint trace
Cloudflare, memperkirakan titik tengah latensi permintaan, lalu menampilkan
jam jaringan di browser Anda.

## Kapan alat ini membantu

- Memeriksa apakah jam sistem lokal Anda lebih cepat atau lebih lambat.
- Mengonfirmasi pergeseran waktu sebelum menelusuri masalah TLS, token,
  penjadwal, atau log.
- Mendapatkan waktu referensi berbasis jaringan dengan cepat tanpa memasang
  alat NTP.

## Hal yang perlu diperhatikan

- Offset yang ditampilkan adalah perkiraan dan bergantung pada latensi jaringan.
- Jika permintaan trace gagal, alat akan kembali menampilkan jam lokal sampai
  sinkronisasi berikutnya berhasil.
- Untuk perbaikan yang presisi di tingkat sistem, sesuaikan pengaturan sinkron
  waktu perangkat atau konfigurasi NTP.
