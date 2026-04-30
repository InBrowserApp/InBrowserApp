CIDR Parser mengubah blok seperti `10.24.8.19/21` atau `2001:db8:abcd::123/64` menjadi jaringan yang benar-benar Anda maksud. Alat ini menormalkan input alamat host, menampilkan subnet kanonis, dan membuka batas yang biasanya dibutuhkan saat menulis aturan firewall, mendokumentasikan rentang, atau memeriksa apakah alokasi terlalu besar.

## Yang Ditampilkan

Hasil dimulai dengan ringkasan cepat, lalu memecah blok menjadi detail praktis: CIDR kanonis, jumlah alamat total dan usable, awal dan akhir rentang, serta nilai integer di balik blok. Untuk IPv4, Anda juga mendapat netmask, wildcard mask, dan alamat broadcast. Untuk IPv6, parser mempertahankan alur yang sama tetapi menyembunyikan field yang tidak berlaku.

## Mengapa Kanonisasi Penting

Banyak nilai CIDR yang ditempel berisi bit host. Itu wajar untuk manusia, tetapi router, ACLs, dan dokumentasi biasanya membutuhkan alamat jaringan kanonis. Dengan menulis ulang blok sebelum Anda menyalin apa pun, alat ini membantu menangkap asumsi off-by-one sebelum masuk ke konfigurasi.

## Catatan Praktis

- Blok IPv4 `/31` dan `/32` diperlakukan sepenuhnya usable, sesuai penggunaan point-to-point dan host-route modern.
- Blok IPv6 melaporkan seluruh ruang alamat dan rentang usable tanpa membuat konsep broadcast.
- Semuanya berjalan lokal di browser, jadi subnet internal tidak meninggalkan halaman saat Anda memeriksanya.
