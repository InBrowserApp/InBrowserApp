## Cara Mengkonversi IPv6 ke Alamat MAC

Anda hanya bisa mendapatkan kembali alamat MAC dari alamat IPv6 jika
identifier antarmuka IPv6 diturunkan dari alamat MAC tersebut dengan metode
EUI-64. Ini paling sering terjadi pada alamat link-local lama yang diawali
dengan `fe80::` dan beberapa alamat autokonfigurasi stateless.

### Kapan ini berfungsi

Konversi balik ini berfungsi ketika 64 bit terakhir alamat IPv6 masih
mengandung identifier antarmuka EUI-64.

- Identifier antarmuka dibangun dari alamat MAC 48-bit.
- Byte di tengah masih bernilai `ff:fe`.
- Alamat tidak dibuat dengan privacy extensions atau skema pengacakan lain.

### Cara kerja konversi

Konverter membangun ulang alamat MAC dengan langkah-langkah berikut:

1. Membaca 64 bit terakhir alamat IPv6.
2. Menghapus byte `ff:fe` yang disisipkan di tengah identifier antarmuka.
3. Membalik bit universal/local pada byte pertama.
4. Memformat 48 bit yang tersisa sebagai alamat MAC standar.

### Mengapa tidak ada hasil

Anda mungkin tidak mendapatkan hasil karena beberapa alasan:

- Sintaks alamat IPv6 tidak valid.
- Alamat tersebut valid, tetapi tidak dibuat dari alamat MAC dengan EUI-64.
- Alamat menggunakan privacy, stable-random, DHCPv6, atau metode penetapan lain
  yang tidak berbasis MAC.
