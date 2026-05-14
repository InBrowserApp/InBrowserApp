Reverse IP Lookup mengubah alamat IPv4 atau IPv6 menjadi nama DNS terbaliknya dan melakukan kueri record `PTR` yang sesuai. Alat ini membantu Anda memeriksa hostname yang dipublikasikan pemilik alamat untuk server email, perangkat jaringan, instans cloud, dan catatan pemecahan masalah.

## Yang Diperiksa

Untuk IPv4, alat ini membalik urutan oktet dan menjalankan kueri pada nama `in-addr.arpa`. Untuk IPv6, alat ini memperluas alamat menjadi 32 nibble heksadesimal, membalik urutannya, lalu menjalankan kueri pada nama `ip6.arpa` yang cocok. Hasilnya menampilkan domain DNS terbalik yang tepat, kode status DNS, resolver, keluarga alamat, dan setiap hostname yang dikembalikan beserta nilai TTL-nya.

## Cara Kueri Berjalan

Pencarian berjalan dari browser Anda menggunakan DNS-over-HTTPS. Anda dapat memilih Cloudflare, Google, atau AliDNS sebagai resolver, dan browser mengirim kueri `PTR` standar ke endpoint tersebut. Tidak ada layanan pencarian InBrowser.App sisi server yang terlibat.

## Cara Membaca Hasil yang Hilang

Jawaban PTR yang hilang itu umum. Banyak alamat residensial, cloud, privat, atau yang baru ditetapkan tidak memublikasikan record DNS terbalik. Respons DNS yang berhasil tanpa hostname tidak membuktikan bahwa alamat tersebut tidak digunakan; itu hanya berarti zona terbalik tidak mengembalikan record `PTR` yang dapat digunakan melalui resolver yang dipilih.

## Catatan Praktis

- DNS terbalik memetakan alamat IP ke hostname; ini berbeda dari menemukan setiap domain yang dihosting pada alamat yang sama.
- Record PTR dikendalikan oleh pemilik alamat IP atau penyedia upstream, bukan hanya oleh pemilik domain.
- Sistem email dan keamanan sering membandingkan DNS maju dan terbalik, jadi record PTR biasanya harus menunjuk ke hostname yang kembali mengarah ke alamat yang sama.
