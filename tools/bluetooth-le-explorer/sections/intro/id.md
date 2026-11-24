## Cara menghubungkan perangkat Bluetooth Low Energy

Aktifkan Bluetooth dan atur perangkat agar siap dihubungkan. Pilih **Hubungkan perangkat**, lalu pilih perangkat Anda di browser. Penjelajah ini meminta akses ke layanan GATT umum seperti Battery Service, Device Information, Heart Rate, dan Environmental Sensing. Untuk layanan GATT kustom, masukkan UUID-nya sebelum membuka pemilih perangkat. Gunakan UUID 16-bit seperti `180F` atau UUID 128-bit lengkap dari dokumentasi perangkat.

## Cara membaca karakteristik GATT

Buka layanan untuk melihat karakteristik dan operasi yang didukungnya. Pilih **Baca** untuk meminta nilai saat ini. Heksadesimal menampilkan byte persis seperti yang diterima, sedangkan UTF-8 berguna untuk karakteristik yang berisi teks. Tingkat baterai, hasil pengukuran, atau nilai biner lainnya mungkin perlu ditafsirkan menggunakan spesifikasi karakteristik tersebut.

## Cara merekam notifikasi Bluetooth

Pilih **Aktifkan notifikasi** pada karakteristik yang mendukung Notify atau Indicate. Pembaruan muncul bersama waktu dan UUID karakteristik. Unduh 100 notifikasi terbaru sebagai file JSON untuk diperiksa nanti, atau pilih **Nonaktifkan notifikasi** untuk menghentikan aliran tersebut. Halaman ini menyimpan log secara lokal.

## Mengapa perangkat atau layanannya tidak terlihat?

Dukungan Web Bluetooth bergantung pada browser dan sistem operasi. Gunakan browser yang didukung melalui HTTPS, dekatkan perangkat, dan putuskan koneksinya dari aplikasi lain jika perangkat hanya mengizinkan satu koneksi. Browser menyediakan akses ke layanan GATT yang diizinkan pada perangkat Bluetooth LE. Perangkat Bluetooth Classic, seperti headphone yang hanya menyediakan profil audio, memerlukan antarmuka lain.
