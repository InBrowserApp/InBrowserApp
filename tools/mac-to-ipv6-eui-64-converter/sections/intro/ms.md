## Cara menukar alamat MAC kepada IPv6

Masukkan alamat MAC 48 bit dengan tanda titik bertindih, sempang, titik, atau tanpa pemisah. Tambahkan awalan rangkaian IPv6 `/64` yang ingin digunakan. Awalan boleh ditulis dalam bentuk termampat atau penuh, dengan semua bit hos bernilai sifar. Alamat IPv6 dikemas kini semasa anda menaip dan boleh terus disalin. Butang **Cuba contoh** mengisi kedua-dua medan dengan nilai contoh.

## Cara Modified EUI-64 membentuk alamat

Dalam subnet `/64`, awalan rangkaian mengisi 64 bit pertama dan pengecam antara muka mengisi 64 bit terakhir. Modified EUI-64 menyisipkan `ff:fe` di tengah alamat MAC dan menyongsangkan bit universal/setempat pada bait pertama. Contohnya, `00:11:22:33:44:55` menjadi pengecam antara muka `211:22ff:fe33:4455`. Jika awalannya ialah `2001:db8:1:2::/64`, alamat yang terhasil ialah `2001:db8:1:2:211:22ff:fe33:4455`.

## Awalan IPv6 yang lazim

- **Link-local.** Guna `fe80::/64` untuk berkomunikasi pada pautan yang sama. Butang link-local mengisi awalan ini sambil mengekalkan alamat MAC anda. Untuk menambah nama antara muka seperti `%eth0`, gunakan [penukar IPv6 link-local](/ms/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Setempat unik (ULA).** Butang ULA mengisi `fd12:3456:789a:1::/64`, iaitu contoh daripada julat `fd00::/8` untuk rangkaian dalaman. Untuk menjana awalan unik bagi rangkaian anda, gunakan [penjana ULA IPv6](/ms/tools/ipv6-ula-generator/).
- **Unicast global.** Masukkan subnet `/64` daripada julat yang diperuntukkan oleh penyedia perkhidmatan internet, penyedia perkhidmatan awan, atau pentadbir rangkaian anda.
- **Dokumentasi.** Awalan `2001:db8:1:2::/64` berasal daripada julat `2001:db8::/32` yang dikhaskan untuk dokumentasi dan contoh.

## Adakah hasilnya sepadan dengan alamat IPv6 peranti saya?

Alat ini menghasilkan alamat bagi awalan anda menggunakan Modified EUI-64. Peranti mungkin menggunakan pengecam antara muka yang lain, seperti pengecam stabil atau sementara yang dijana untuk privasi. Jika anda sudah mempunyai alamat IPv6 dengan pengecam antara muka yang berasal daripada alamat MAC, anda boleh mendapatkan semula alamat MAC itu dengan [penukar IPv6 kepada MAC](/ms/tools/ipv6-address-to-mac-address-converter/).
