## Cara merencanakan subnet IPv4 dengan VLSM

Masukkan blok induk dalam notasi CIDR, misalnya 192.168.10.0/24. Tambahkan satu baris untuk setiap jaringan dan isi jumlah alamat host yang dibutuhkan, termasuk alamat gateway dan cadangan untuk pengembangan. Jalankan perhitungan untuk melihat jaringan yang dialokasikan, subnet mask, rentang IP untuk host, alamat broadcast, dan blok CIDR yang masih tersedia.

VLSM menggunakan subnet mask dengan panjang berbeda untuk membagi jaringan menjadi subnet dengan ukuran yang berbeda. Kalkulator memilih blok terkecil yang cukup untuk tiap subnet, lalu mengalokasikan blok terbesar terlebih dahulu pada batas CIDR yang sesuai. Subnet standar mencadangkan alamat jaringan dan alamat broadcast. Misalnya, blok /26 menyediakan 62 alamat yang dapat digunakan, sehingga cukup untuk 50 host.

Pilih /31 hanya untuk sambungan IPv4 titik ke titik yang mendukung dua alamat yang dapat digunakan. Pilih /32 untuk satu alamat, misalnya alamat loopback router. Kedua opsi tidak memiliki alamat broadcast. Perhitungan berlangsung di browser, dan nama subnet tetap berada di sana.
