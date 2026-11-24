## Cara merancang subnet IPv4 dengan VLSM

Masukkan blok induk dalam notasi CIDR, contohnya 192.168.10.0/24. Tambahkan satu baris untuk setiap rangkaian dan nyatakan bilangan alamat hos yang diperlukan, termasuk alamat get laluan dan ruang untuk pengembangan. Kira pelan untuk melihat rangkaian yang diperuntukkan, topeng subnet, julat IP untuk hos, alamat siaran dan blok CIDR yang masih tersedia.

VLSM menggunakan topeng subnet dengan panjang berbeza untuk membahagikan rangkaian kepada subnet berlainan saiz. Kalkulator memilih blok terkecil yang memenuhi keperluan setiap subnet, kemudian memperuntukkan blok terbesar dahulu mengikut sempadan CIDR. Subnet standard merizabkan alamat rangkaian dan alamat siaran. Contohnya, blok /26 menawarkan 62 alamat yang boleh digunakan, jadi ia boleh memuatkan 50 hos.

Pilih /31 hanya untuk pautan IPv4 titik ke titik yang menyokong dua alamat yang boleh digunakan. Pilih /32 untuk satu alamat, seperti alamat gelung balik penghala. Kedua-dua pilihan tiada alamat siaran. Pengiraan dijalankan dalam pelayar dan nama subnet kekal di situ.
