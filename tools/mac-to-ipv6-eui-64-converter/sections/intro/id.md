## Cara alamat dibentuk

Modified EUI-64 menyisipkan `ff:fe` di antara kedua bagian alamat MAC dan membalik nilai bit universal/lokal pada byte pertama. Misalnya, `00:11:22:33:44:55` menjadi ID antarmuka `211:22ff:fe33:4455`. Dengan prefiks `2001:db8:1:2::/64`, alamat yang dihasilkan adalah `2001:db8:1:2:211:22ff:fe33:4455`.

Masukkan `fe80::/64` untuk menghasilkan alamat link-local. Untuk menambahkan nama antarmuka, gunakan [konverter link-local](/id/tools/mac-address-to-ipv6-link-local-address-converter/). Untuk mendapatkan alamat unicast yang dapat digunakan, masukkan prefiks /64 yang dialokasikan untuk jaringan Anda. Contoh di atas menggunakan prefiks dokumentasi.
