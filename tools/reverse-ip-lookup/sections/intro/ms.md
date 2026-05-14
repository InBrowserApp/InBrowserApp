Carian IP Songsang menukar alamat IPv4 atau IPv6 kepada nama DNS songsangnya dan menanyakan rekod `PTR` yang sepadan. Ia membantu anda menyemak nama hos yang diterbitkan oleh pemilik alamat untuk pelayan mel, peralatan rangkaian, instans awan, dan nota penyelesaian masalah.

## Apa Yang Disemak

Untuk IPv4, alat ini menyongsangkan oktet dan menanyakan nama `in-addr.arpa`. Untuk IPv6, ia mengembangkan alamat kepada 32 nibel heksadesimal, menyongsangkannya, dan menanyakan nama `ip6.arpa` yang sepadan. Hasilnya menunjukkan domain DNS songsang yang tepat, kod status DNS, penyelesai, keluarga alamat, dan sebarang nama hos yang dikembalikan bersama nilai TTL.

## Cara Kueri Dijalankan

Carian berjalan dari penyemak imbas anda menggunakan DNS-over-HTTPS. Anda boleh memilih Cloudflare, Google, atau AliDNS sebagai penyelesai, dan penyemak imbas menghantar kueri `PTR` standard kepada endpoint itu. Tiada perkhidmatan carian InBrowser.App sebelah pelayan yang terlibat.

## Cara Mentafsir Keputusan Yang Hilang

Jawapan PTR yang tiada adalah perkara biasa. Banyak alamat kediaman, awan, persendirian, atau yang baru diperuntukkan tidak menerbitkan rekod DNS songsang. Respons DNS yang berjaya tanpa nama hos tidak membuktikan alamat itu tidak digunakan; ia hanya bermaksud zon songsang tidak mengembalikan rekod `PTR` yang boleh digunakan melalui penyelesai yang dipilih.

## Nota Praktikal

- DNS songsang memetakan alamat IP kepada nama hos; ia berbeza daripada mencari setiap domain yang dihoskan pada alamat yang sama.
- Rekod PTR dikawal oleh pemilik alamat IP atau penyedia huluan, bukan oleh pemilik domain sahaja.
- Sistem mel dan keselamatan sering membandingkan DNS hadapan dan DNS songsang, jadi rekod PTR biasanya patut menunjuk kepada nama hos yang diselesaikan kembali kepada alamat yang sama.
