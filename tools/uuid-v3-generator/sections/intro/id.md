## Apa itu UUID v3?

UUID v3 adalah format UUID berbasis nama. Format ini mengambil UUID namespace
dan nama, meng-hash keduanya dengan MD5, lalu memformat hasilnya sebagai UUID
standar. Perilaku pentingnya adalah determinisme: namespace dan nama yang sama
selalu menghasilkan UUID yang sama.

Alat ini berjalan sepenuhnya di browser Anda. Namespace, nama, dan UUID yang
dihasilkan tetap berada di perangkat Anda kecuali Anda menyalin hasilnya ke
tempat lain.

## Kapan menggunakannya

- Gunakan UUID v3 saat Anda memerlukan pengenal stabil untuk nama yang sudah
  diketahui, seperti nama DNS, URL, path objek, atau nama pengguna.
- Pilih namespace yang sesuai dengan jenis nama yang Anda identifikasi. DNS dan
  URL adalah preset yang paling umum.
- Gunakan kembali namespace yang sama secara konsisten. Mengubah namespace akan
  mengubah setiap UUID yang dihasilkan, bahkan ketika namanya tetap sama.
- Pilih UUID v5 atau pengenal modern lain saat Anda memiliki pilihan dan
  memerlukan UUID berbasis nama dengan hash yang lebih kuat. UUID v3 ada untuk
  kompatibilitas dengan sistem yang secara khusus mengharapkan UUID berbasis
  MD5.

## Catatan keamanan

UUID v3 bukan ID acak dan bukan rahasia. Siapa pun yang mengetahui namespace
dan nama dapat membuat ulang UUID yang sama. Jangan gunakan untuk kata sandi,
token sesi, kunci API, atau nilai lain yang harus tidak dapat ditebak.
