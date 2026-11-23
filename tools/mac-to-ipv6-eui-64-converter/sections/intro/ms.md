## Cara alamat dibentuk

Modified EUI-64 menyisipkan `ff:fe` di tengah alamat MAC dan menyongsangkan bit universal/setempat pada bait pertama. Contohnya, `00:11:22:33:44:55` menjadi pengecam antara muka `211:22ff:fe33:4455`. Jika awalannya ialah `2001:db8:1:2::/64`, alamat yang terhasil ialah `2001:db8:1:2:211:22ff:fe33:4455`.

Masukkan `fe80::/64` untuk mendapatkan alamat link-local. Untuk menambahkan nama antara muka, gunakan [penukar link-local](/ms/tools/mac-address-to-ipv6-link-local-address-converter/). Untuk alamat unicast yang boleh digunakan dalam rangkaian anda, gunakan awalan /64 yang diperuntukkan kepada rangkaian tersebut. Contoh di atas menggunakan awalan dokumentasi.
