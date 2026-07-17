## Apa itu Alamat Lokal Unik IPv6?

Alamat Lokal Unik (ULA) IPv6 ditujukan untuk komunikasi di dalam situs, jaringan privat, dan organisasi yang saling terhubung. Ruang ULA lengkap adalah `fc00::/7`. Bit kedelapannya adalah **bit L**: nilai `1` memilih rentang `fd00::/8` yang ditetapkan secara lokal dan digunakan oleh generator ini, sementara separuh `fc00::/8` tetap dicadangkan untuk metode penetapan lain.

Secara default, ULA tidak dapat dijangkau secara global, tetapi “lokal” bukan berarti rahasia atau otomatis aman. ULA dapat melintasi batas situs yang dirutekan, VPN, dan interkoneksi privat saat operator mengonfigurasi jalur tersebut.

## Cara generator RFC 4193 ini membuat prefiks /48

Generator RFC 4193 ini meminta tepat 40 bit acak dari Web Crypto API dan menggabungkannya dengan `fd`. Hasilnya adalah prefiks situs 48 bit yang unik secara statistik, seperti `fd12:3456:789a::/48`. Pembuatan berlangsung di browser: alat ini tidak mengumpulkan alamat MAC, stempel waktu, pengenal perangkat, atau respons server.

Terdapat `2^40` kemungkinan ID Global — sekitar 1,1 triliun. Keacakan aman memperkecil kemungkinan penggunaan ulang yang tidak disengaja, tetapi tidak dapat menjamin dua prefiks yang dibuat secara independen tidak akan pernah bertabrakan. Catat prefiks `/48` yang dipilih dalam dokumentasi jaringan Anda dan gunakan kembali secara konsisten.

## Merencanakan 65.536 subnet /64 yang tersedia

Setelah prefiks situs `/48`, terdapat ID Subnet 16 bit. Nilai dari `0000` hingga `ffff` menyediakan 65.536 kemungkinan jaringan `/64`. Contohnya, ID Subnet `00a0` mengubah `fd12:3456:789a::/48` menjadi jaringan kanonis `fd12:3456:789a:a0::/64`.

Sebanyak 64 bit yang tersisa merupakan ID Antarmuka. Alat ini hanya merencanakan prefiks jaringan; alat ini tidak membuat alamat host `/128` atau menurunkan pengenal antarmuka dari alamat MAC.

## Di mana ULA tepat digunakan — dan di mana tidak

ULA cocok untuk pengalamatan internal yang stabil, situs yang terhubung melalui VPN, jaringan laboratorium, dan layanan yang perlu mempertahankan prefiks internal sambil juga menggunakan IPv6 unicast global. ULA bukan firewall atau batas keamanan yang melekat. Terapkan kontrol akses biasa, filter lalu lintas ULA yang tidak semestinya di batas situs, dan jangan masukkan rekaman ULA internal ke DNS publik.

Sebuah host dapat menggunakan ULA dan alamat unicast global secara bersamaan. Gunakan alamat global untuk keterjangkauan Internet dan prefiks ULA tetap untuk jalur privat yang membutuhkannya.
