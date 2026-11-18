## Jana awalan /48 ULA IPv6

Salin awalan `fd` yang dijana untuk rangkaian rumah, makmal atau VPN anda. Simpan awalan `/48` yang dipilih bersama konfigurasi rangkaian supaya anda boleh menggunakannya semula semasa menambah subnet. Pilih **Jana awalan baharu** apabila anda memerlukan peruntukan baharu.

## Kira subnet /64

Masukkan **ID Subnet** perenambelasan antara `0000` dengan `ffff`. Contohnya, ID `00a0` dalam `fd12:3456:789a::/48` menghasilkan `fd12:3456:789a:a0::/64`. Satu awalan `/48` menyediakan 65,536 subnet `/64`. Anda boleh memperuntukkan awalan berasingan untuk LAN, Wi-Fi tetamu atau VPN.

## Asal awalan fd

RFC 4193 mentakrifkan Alamat Setempat Unik dalam julat `fc00::/7`. Separuh daripada julat itu, `fd00::/8`, diperuntukkan secara setempat dan bermula dengan `fd`. Penjana menambah ID Global rawak 40 bit daripada Web Crypto API pelayar untuk membentuk awalan `/48`.

## Bila Alamat Setempat Unik digunakan

Gunakan ULA untuk alamat IPv6 yang stabil dalam satu rangkaian atau antara tapak yang disambungkan melalui VPN. Peranti juga boleh menggunakan alamat IPv6 global untuk trafik Internet awam sambil mengekalkan ULA bagi perkhidmatan dalaman.
