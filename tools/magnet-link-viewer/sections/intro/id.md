Tautan magnet mengidentifikasi torrent BitTorrent melalui info hash. Tautan ini juga bisa mencantumkan nama tampilan, alamat pelacak, web seed, atau sumber metadata. Klien perlu mengambil metadata torrent untuk menampilkan nama dan ukuran file yang sebenarnya.

## Cara memeriksa tautan magnet

Tempel tautan `magnet:?` dan pilih “Cari metadata”. Penampil menunjukkan info hash beserta nama dan alamat pelacak yang tercantum dalam tautan. Setelah WebTorrent mengambil metadata, penampil menunjukkan nama torrent, jalur dan ukuran file, ukuran total, dan informasi tentang potongan file. Anda dapat memfilter daftar file dan menyalin info hash.

## Mengapa sebagian tautan magnet tidak bisa dibaca

Di browser, WebTorrent memerlukan peer yang mendukung WebRTC dan dapat dijangkau, biasanya lewat pelacak WebSocket. Sebagian tautan magnet juga menyertakan sumber metadata HTTPS yang bisa dibaca browser. Pencarian metadata di sini bisa melewati batas waktu meskipun tautannya berfungsi di klien torrent desktop. Jika Anda memiliki file `.torrent`, buka di Penampil File Torrent untuk langsung membaca metadatanya.

## Layanan yang dihubungi saat pencarian

Pencarian berjalan di browser Anda. WebTorrent dapat menghubungi pelacak, peer, atau sumber metadata untuk torrent yang Anda minta. Pihak tersebut dapat melihat alamat IP Anda dan torrent yang Anda cari. Penampil hanya meminta metadata dan tidak mengunduh file yang tercantum di dalamnya. Tautan magnet memerlukan info hash BitTorrent v1 (`btih`), termasuk jika tautan itu juga mengidentifikasi torrent v2.
