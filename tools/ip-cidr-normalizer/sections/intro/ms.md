## Apa Alat Ini Normalisasi

Alat ini menukar alamat IPv4, alamat IPv6 dan julat CIDR ke dalam tatatanda kanonik terus dalam penyemak imbas. Ia mengalih keluar padding IPv4 yang tidak diperlukan, memampatkan IPv6 kepada bentuk yang dipendekkan standard, dan mengekalkan keluarga alamat asal.

## Cara Penormalan CIDR Berfungsi

Apabila anda memasukkan blok CIDR, alat itu menulis semula alamat ke alamat rangkaian sebenar untuk awalan itu. Bit hos dikosongkan, jadi `192.168.0.15/24` menjadi `192.168.0.0/24` dan `2001:db8::1234/64` menjadi `2001:db8::/64`.

## Apabila Ini Berguna

Gunakannya sebelum membandingkan peraturan tembok api, ACL, jadual laluan, senarai kebenaran VPN atau fail konfigurasi yang diimport. Input yang dinormalkan menjadikan pengesanan pendua, ulasan dan salin-tampal ke dalam alatan rangkaian lebih dipercayai.

## Mengapa Input Boleh Ditolak

Alat ini menolak alamat IPv4 atau IPv6 yang cacat, awalan CIDR tidak sah dan gabungan alamat atau awalan yang tidak sepadan dengan keluarga protokol. Jika nilai tidak dapat dihuraikan dengan jelas, adalah lebih selamat untuk menolaknya daripada menormalkan rangkaian yang salah.
