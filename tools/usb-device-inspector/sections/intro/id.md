## Cara memeriksa perangkat USB di browser

Hubungkan perangkat dengan kabel yang dapat membawa data, lalu pilih **Pilih perangkat** dan pilih perangkat di dialog WebUSB browser. Kartu perangkat menampilkan ID vendor (VID), ID produk (PID), dan informasi identitas yang tersedia. Versi USB berasal dari deskriptor perangkat. Kecepatan koneksi sebenarnya juga bergantung pada kabel, port, dan sistem operasi.

## Cara membaca konfigurasi, antarmuka, dan titik akhir

Buka konfigurasi untuk melihat fungsi yang disediakan antarmukanya. Antarmuka dapat memiliki beberapa pengaturan alternatif, masing-masing dengan kelas, subkelas, protokol, dan titik akhirnya sendiri. Titik akhir IN membawa data menuju host dan titik akhir OUT menuju perangkat. Jenis titik akhir dan ukuran paket menjelaskan cara titik akhir mentransfer data.

## Apa yang ditunjukkan pemeriksaan akses?

Pilih **Periksa akses** untuk melihat apakah browser dapat membuka perangkat yang dipilih. Pemeriksaan menggunakan handle perangkat dan melepaskannya setelah selesai. Akses antarmuka masih dapat bergantung pada driver sistem operasi atau aplikasi lain. Pemeriksa membaca deskriptor yang disediakan browser tanpa mengubah pengaturan perangkat.

## Mengapa perangkat USB saya tidak terlihat atau tidak dapat dibuka?

Jika perangkat tidak muncul di pemilih, coba kabel data dan pastikan sistem operasi mengenalinya. Jika browser menolak akses, periksa izin USB situs atau kebijakan browser. Jika perangkat dapat dipilih tetapi gagal dibuka, tutup aplikasi yang mungkin menggunakannya dan periksa persyaratan driver untuk perangkat dan platform Anda. Beberapa kelas USB dilindungi oleh browser. Lihat [Informasi Perangkat](../device-information/) untuk mengetahui kemampuan browser dan sistem ini.
