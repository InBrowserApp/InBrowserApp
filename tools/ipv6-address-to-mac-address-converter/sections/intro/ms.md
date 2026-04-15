## Cara Menukar IPv6 kepada Alamat MAC

Anda hanya boleh mendapatkan semula alamat MAC daripada alamat IPv6 apabila
pengecam antara muka IPv6 diterbitkan daripada alamat MAC tersebut menggunakan
kaedah EUI-64. Ini paling biasa berlaku pada alamat link-local lama yang
bermula dengan `fe80::` dan beberapa alamat autokonfigurasi tanpa keadaan.

### Bila ini berfungsi

Penukaran songsang ini berfungsi apabila 64 bit terakhir alamat IPv6 masih
mengandungi pengecam antara muka EUI-64.

- Pengecam antara muka dibina daripada alamat MAC 48-bit.
- Bait di bahagian tengah masih `ff:fe`.
- Alamat itu tidak dijana oleh privacy extensions atau skim rawak yang lain.

### Cara penukaran berfungsi

Penukar membina semula alamat MAC dengan langkah berikut:

1. Membaca 64 bit terakhir alamat IPv6.
2. Membuang bait `ff:fe` yang disisipkan di tengah pengecam antara muka.
3. Membalikkan bit universal/local pada bait pertama.
4. Memformat baki 48 bit sebagai alamat MAC standard.

### Mengapa tiada hasil

Anda mungkin tidak mendapat hasil atas beberapa sebab:

- Sintaks alamat IPv6 tidak sah.
- Alamat itu sah, tetapi tidak dijana daripada alamat MAC menggunakan EUI-64.
- Alamat itu menggunakan privacy, stable-random, DHCPv6 atau kaedah
  peruntukan lain yang tidak berasaskan MAC.
