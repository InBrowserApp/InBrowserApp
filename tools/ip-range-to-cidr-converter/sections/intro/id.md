## Apa Fungsi Alat Ini

Alat ini mengubah alamat IP awal dan alamat IP akhir menjadi kumpulan blok CIDR terkecil yang mencakup seluruh rentang. Semuanya berjalan secara lokal di browser Anda, sehingga alamatnya tidak pernah keluar dari perangkat Anda.

## Cara Kerja Penutup CIDR

Blok CIDR mewakili jaringan berukuran kekuatan dua yang disejajarkan pada batas yang cocok. Ketika suatu rentang dimulai atau berakhir di tengah batas tersebut, satu blok saja tidak cukup. Konverter terus mengambil blok sejajar terbesar yang sesuai, lalu mengulanginya hingga seluruh rentang tercakup.

## Mengapa Banyak Blok Bisa Muncul

Rentang seperti 192.168.1.10 hingga 192.168.1.25 tidak dimulai pada batas jaringan yang bersih dan juga tidak berakhir pada batas jaringan tersebut. Oleh karena itu, hasil sebenarnya adalah daftar pendek blok, masing-masing mencakup satu bagian yang selaras tanpa menyertakan alamat tambahan di luar rentang yang diminta.

## Kapan Ini Bermanfaat

Gunakan saat menyiapkan aturan firewall, ringkasan rute, entri ACL, grup keamanan cloud, atau daftar periksa migrasi yang rentang awal dan akhir mentahnya perlu menjadi notasi CIDR standar.
