## Untuk apa alat ini

Gunakan alat ini untuk membandingkan jam pada peranti anda dengan masa yang
diperoleh daripada rangkaian. Ia mengambil cap masa daripada endpoint trace
Cloudflare, menganggarkan titik tengah kependaman permintaan, lalu memaparkan
jam rangkaian dalam pelayar anda.

## Bila ia membantu

- Menyemak sama ada jam sistem tempatan anda lebih cepat atau lebih lambat.
- Mengesahkan hanyutan masa sebelum menyiasat TLS, token, penjadual atau log.
- Mendapatkan masa rujukan berasaskan rangkaian dengan cepat tanpa memasang
  alat NTP.

## Perkara yang perlu diperhatikan

- Offset yang dipaparkan ialah anggaran dan bergantung pada kependaman rangkaian.
- Jika permintaan trace gagal, alat ini akan kembali memaparkan jam tempatan
  sehingga penyegerakan seterusnya berjaya.
- Untuk pembetulan tepat pada peringkat sistem, laraskan tetapan penyegerakan
  masa peranti atau konfigurasi NTP.
