## Apa yang Dinormalisasi Alat Ini

Alat ini mengubah alamat IPv4, alamat IPv6, dan rentang CIDR menjadi notasi kanonik langsung di browser. Ini menghapus padding IPv4 yang tidak perlu, mengompresi IPv6 ke bentuk standar yang disingkat, dan mempertahankan kelompok alamat asli.

## Cara Kerja Normalisasi CIDR

Saat Anda memasukkan blok CIDR, alat tersebut menulis ulang alamat ke alamat jaringan sebenarnya untuk awalan tersebut. Bit host dihapus, sehingga `192.168.0.15/24` menjadi `192.168.0.0/24`, dan `2001:db8::1234/64` menjadi `2001:db8::/64`.

## Kapan Ini Bermanfaat

Gunakan sebelum membandingkan aturan firewall, ACL, tabel rute, daftar VPN yang diizinkan, atau file konfigurasi yang diimpor. Masukan yang dinormalisasi membuat deteksi duplikat, peninjauan, dan salin-tempel ke peralatan jaringan menjadi lebih andal.

## Mengapa Masukan Mungkin Ditolak

Alat ini menolak format alamat IPv4 atau IPv6 yang salah, awalan CIDR yang tidak valid, dan kombinasi alamat atau awalan yang tidak cocok dengan rangkaian protokol. Jika nilai tidak dapat diurai dengan jelas, lebih aman menolaknya daripada menormalkan jaringan yang salah.
