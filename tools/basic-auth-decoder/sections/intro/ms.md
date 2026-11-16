## Fungsinya

Nyahkod pengepala HTTP Basic Authorization untuk mengekstrak nama pengguna dan kata laluan daripada Base64. Berguna untuk penyahpepijatan dan ujian API.

## Input yang Diterima

Tampal sesuatu seperti: Basic dXNlcjpwYXNz
Alat ini juga menerima baris penuh `Authorization: Basic ...`.

## Nota

- Base64 hanya mengekodkan kelayakan; ia tidak melindunginya.
- Penyahkod memisahkan pada `:` pertama dan mengekalkan selebihnya dalam kata laluan.
- Semuanya berjalan secara setempat dalam pelayar anda.
