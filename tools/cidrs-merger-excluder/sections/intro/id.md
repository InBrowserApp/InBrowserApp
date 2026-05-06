## Apa yang Dilakukan Alat Ini

Alat ini menggabungkan blok CIDR menjadi kumpulan ekuivalen terkecil, lalu mengurangi blok CIDR apa pun yang Anda masukkan ke daftar pengecualian. Alat ini mendukung IPv4 dan IPv6 dalam satu proses yang sama, dan semua pemrosesan terjadi secara lokal di browser Anda.

## Cara Kerja Gabung dan Kecualikan

Daftar gabung dinormalisasi terlebih dahulu: bit host dibersihkan, jaringan yang tumpang tindih digabungkan, dan jaringan yang bersebelahan diringkas ketika dapat direpresentasikan oleh blok CIDR yang lebih pendek. Setelah itu, daftar pengecualian dikurangi dari rentang yang telah digabungkan. Output akhir diperluas kembali menjadi daftar CIDR minimal yang secara tepat mencakup bagian yang tersisa.

## Kapan Ini Berguna

Gunakan saat membersihkan aturan firewall, menyiapkan entri grup keamanan cloud, meninjau daftar izin VPN, merangkum tabel rute, atau menghapus rentang cadangan dari alokasi yang lebih besar. Ini sangat membantu ketika konfigurasi yang disalin berisi blok yang tumpang tindih atau ketika jaringan luas perlu menghapus beberapa rentang yang lebih kecil.

## Catatan Input

Masukkan satu CIDR per baris, atau pisahkan beberapa CIDR dengan koma. Blok IPv4 dan IPv6 dapat ditempel bersama, tetapi pengecualian hanya berlaku untuk blok dari keluarga alamat yang sama. Entri tidak valid dilaporkan bersama daftar dan nomor barisnya agar Anda dapat memperbaiki input tempel yang besar tanpa menebak-nebak.
