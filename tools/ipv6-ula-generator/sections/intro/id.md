## Membuat prefiks /48 ULA IPv6

Salin prefiks `fd` yang dihasilkan untuk jaringan rumah, lab, atau VPN. Simpan prefiks `/48` pilihan bersama konfigurasi jaringan agar dapat digunakan lagi saat menambah subnet. Pilih **Buat prefiks baru** jika Anda membutuhkan alokasi baru.

## Menghitung subnet /64

Masukkan **ID Subnet** heksadesimal dari `0000` hingga `ffff`. Misalnya, ID `00a0` pada prefiks `fd12:3456:789a::/48` menghasilkan `fd12:3456:789a:a0::/64`. Satu `/48` menyediakan 65.536 subnet `/64`, sehingga Anda dapat memberi prefiks terpisah untuk LAN, Wi-Fi tamu, atau VPN.

## Asal prefiks fd

RFC 4193 menetapkan rentang Alamat Lokal Unik di `fc00::/7`. Separuh rentang untuk penetapan lokal, `fd00::/8`, diawali `fd`. Generator menambahkan ID Global acak 40 bit dari Web Crypto API di browser untuk membentuk prefiks `/48`.

## Kapan menggunakan Alamat Lokal Unik

Gunakan ULA untuk pengalamatan IPv6 yang tetap di dalam jaringan atau antar lokasi yang terhubung lewat VPN. Perangkat juga dapat memakai alamat IPv6 global untuk lalu lintas internet publik dan tetap memakai ULA untuk layanan internal.
