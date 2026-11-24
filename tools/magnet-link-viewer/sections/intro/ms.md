Pautan magnet mengenal pasti torrent BitTorrent melalui hash info. Pautan ini juga boleh mengandungi nama paparan, alamat penjejak, web seed atau sumber metadata. Untuk melihat nama dan saiz sebenar fail, klien perlu mengambil metadata torrent.

## Cara menyemak pautan magnet

Tampal pautan `magnet:?` dan pilih “Cari metadata”. Pemapar menunjukkan hash info serta nama atau alamat penjejak yang terkandung dalam pautan. Selepas WebTorrent memperoleh metadata, pemapar menunjukkan nama torrent, laluan dan saiz fail, jumlah saiz serta butiran segmen data. Anda boleh menapis senarai fail dan menyalin hash info.

## Mengapa sesetengah pautan magnet gagal mendapatkan metadata

Dalam penyemak imbas, WebTorrent perlu menghubungi rakan setara (peer) yang menyokong WebRTC. Biasanya ia mencari rakan setara melalui penjejak WebSocket. Sesetengah pautan magnet juga mengandungi sumber metadata HTTPS yang boleh dibaca oleh penyemak imbas. Pautan yang berfungsi dalam klien torrent desktop masih boleh melebihi had masa carian di sini. Jika anda mempunyai fail `.torrent`, gunakan pautan ke Pemapar Fail Torrent untuk membacanya terus.

## Perkhidmatan yang dihubungi semasa carian

Carian berjalan dalam penyemak imbas anda. WebTorrent mungkin menghubungi penjejak, rakan setara atau sumber metadata bagi torrent yang anda minta. Mereka mungkin dapat melihat alamat IP anda dan torrent yang anda cari. Pemapar hanya meminta metadata. Fail yang disenaraikan tidak dimuat turun. Pautan magnet mesti mempunyai hash info BitTorrent v1 (`btih`), termasuk pautan yang turut mengenal pasti torrent v2.
