## Cara mengonversi alamat MAC ke IPv6

Masukkan alamat MAC 48 bit dengan tanda titik dua, tanda hubung, titik, atau tanpa pemisah. Tambahkan prefiks jaringan IPv6 `/64` yang ingin Anda gunakan. Prefiks dapat ditulis dalam bentuk ringkas atau lengkap, dengan semua bit host bernilai nol. Alamat IPv6 diperbarui saat Anda mengetik dan siap disalin. Tombol **Coba contoh** mengisi kedua kolom dengan nilai contoh.

## Cara Modified EUI-64 membentuk alamat

Pada subnet `/64`, prefiks jaringan mengisi 64 bit pertama dan ID antarmuka mengisi 64 bit terakhir. Modified EUI-64 menyisipkan `ff:fe` di antara kedua bagian alamat MAC dan membalik nilai bit universal/lokal pada byte pertama. Misalnya, `00:11:22:33:44:55` menjadi ID antarmuka `211:22ff:fe33:4455`. Dengan prefiks `2001:db8:1:2::/64`, alamat yang dihasilkan adalah `2001:db8:1:2:211:22ff:fe33:4455`.

## Prefiks IPv6 yang umum

- **Link-local.** Gunakan `fe80::/64` untuk komunikasi pada segmen jaringan yang sama. Tombol link-local mengisi prefiks ini tanpa mengubah alamat MAC Anda. Untuk menambahkan nama antarmuka seperti `%eth0`, gunakan [konverter IPv6 link-local](/id/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Lokal unik (ULA).** Tombol ULA mengisi `fd12:3456:789a:1::/64`, salah satu contoh dari rentang `fd00::/8` untuk jaringan internal. Untuk membuat prefiks unik bagi jaringan Anda, gunakan [generator ULA IPv6](/id/tools/ipv6-ula-generator/).
- **Unicast global.** Masukkan subnet `/64` dari alokasi yang diberikan oleh penyedia layanan internet, penyedia layanan cloud, atau administrator jaringan Anda.
- **Dokumentasi.** Prefiks `2001:db8:1:2::/64` berasal dari rentang `2001:db8::/32` yang dicadangkan untuk dokumentasi dan contoh.

## Apakah hasilnya sama dengan alamat IPv6 perangkat saya?

Alat ini menghasilkan alamat berdasarkan prefiks Anda dengan Modified EUI-64. Perangkat dapat menggunakan ID antarmuka lain, misalnya ID stabil atau sementara yang dibuat untuk menjaga privasi. Jika Anda sudah memiliki alamat IPv6 dengan ID antarmuka yang berasal dari alamat MAC, Anda bisa mendapatkan kembali alamat MAC tersebut dengan [konverter IPv6 ke MAC](/id/tools/ipv6-address-to-mac-address-converter/).
