## Apa itu Basic Auth?

Basic Auth menempatkan `username:password` ke dalam header `Authorization` setelah dikodekan dengan Base64. Metode ini sederhana dan didukung luas, tetapi Base64 hanyalah encoding, bukan enkripsi.

## Apa yang dihasilkan alat ini

- Header `Authorization: Basic ...` yang bisa langsung ditempel ke klien API.
- Contoh `curl` siap pakai untuk pengujian cepat.
- Semuanya berjalan secara lokal di browser.

## Hal yang perlu diperhatikan

- Selalu gunakan HTTPS saat mengirim kredensial Basic Auth.
- Siapa pun yang melihat header tersebut dapat mendekode nama pengguna dan kata sandi aslinya.
- Basic Auth cocok untuk alat internal, lingkungan staging, dan pengecekan API cepat.
