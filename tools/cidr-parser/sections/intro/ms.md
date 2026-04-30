CIDR Parser menukar blok seperti `10.24.8.19/21` atau `2001:db8:abcd::123/64` kepada rangkaian yang benar-benar anda maksudkan. Ia menormalkan input alamat hos, memaparkan subnet kanonik dan mendedahkan sempadan yang biasanya diperlukan semasa menulis peraturan firewall, mendokumentasikan julat atau menyemak sama ada peruntukan terlalu besar.

## Apa Yang Dipaparkan

Hasil bermula dengan gambaran ringkas, kemudian memecahkan blok kepada butiran praktikal: CIDR kanonik, jumlah alamat dan alamat boleh guna, mula dan akhir julat, serta nilai integer di sebalik blok. Untuk IPv4, anda juga mendapat netmask, wildcard mask dan alamat broadcast. Untuk IPv6, parser mengekalkan aliran yang sama tetapi menyembunyikan medan yang tidak berkaitan.

## Mengapa Kanonikalisasi Penting

Banyak nilai CIDR yang ditampal mengandungi bit hos. Itu sesuai untuk manusia, tetapi router, ACLs dan dokumentasi biasanya memerlukan alamat rangkaian kanonik. Dengan menulis semula blok sebelum anda menyalin apa-apa, alat ini membantu menangkap andaian off-by-one sebelum masuk ke konfigurasi.

## Nota Praktikal

- Blok IPv4 `/31` dan `/32` dianggap boleh digunakan sepenuhnya, sejajar dengan penggunaan point-to-point dan host-route moden.
- Blok IPv6 melaporkan keseluruhan ruang alamat dan julat boleh guna tanpa mencipta konsep broadcast.
- Semuanya berjalan setempat dalam pelayar, jadi subnet dalaman tidak meninggalkan halaman semasa anda memeriksanya.
