## Apa yang Ditunjukkan Alat Ini

Alat ini mencari alamat IPv4 dan IPv6 publik yang dapat dilihat oleh layanan eksternal dari sesi browser Anda saat ini. Jika browser juga dapat mengekspos kandidat antarmuka lokal melalui WebRTC, alat tersebut akan mencantumkannya secara terpisah.

## Mengapa Hasil IPv4, IPv6, dan WebRTC Bisa Berbeda

Alamat IPv4 dan alamat IPv6 Anda dapat berasal dari jalur jaringan, ISP, atau pengaturan terowongan yang berbeda. Kandidat WebRTC mungkin menyertakan alamat LAN pribadi, alamat antarmuka IPv6 sementara, atau rute terkait VPN yang tidak selalu ditampilkan secara langsung oleh situs web biasa.

## Cara Kerja Pencarian

Alat ini menanyakan penyedia IP publik seperti Cloudflare, geojs.io, ip.sb, dan ipify.org, lalu memperkaya alamat yang terdeteksi dengan nama host, ASN, organisasi, negara, zona waktu, dan metadata koordinat jika tersedia. Artinya, alat tersebut memerlukan koneksi internet aktif dan bergantung pada kualitas respons layanan pihak ketiga tersebut.

## Mengapa Alamat Mungkin Hilang

Sebuah alamat bisa gagal muncul jika jaringan Anda memblokir satu kelompok protokol, VPN atau proksi Anda memfilter permintaan tersebut, browser Anda menonaktifkan paparan WebRTC, atau layanan pencarian upstream untuk sementara tidak tersedia. Jika IPv6 tidak tersedia di jaringan Anda, normalnya hanya melihat IPv4.
