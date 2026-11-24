## Cara membaca file zona DNS

Buka hasil ekspor DNS dalam format BIND atau tempel teksnya. Muat contoh untuk melihat record SOA, record alamat IPv4 dan IPv6, record email, dan string TXT. Setiap baris menampilkan nama, kelas, jenis, masa berlaku (TTL) dalam detik, dan data record. Filter menurut nama, jenis seperti MX, atau sebagian nilai, lalu salin record yang terlihat sebagai JSON untuk inventarisasi atau migrasi.

## Cara parser menangani domain dasar, TTL, dan data record

Jika $ORIGIN ditetapkan ke “`example.com.`”, nama relatif “www” menjadi `www.example.com.` Nama @ merujuk ke domain dasar saat ini, sedangkan record pada baris yang menjorok mewarisi nama sebelumnya. Jika file tidak memiliki $ORIGIN, masukkan domainnya di kolom Domain dasar awal. Nilai bawaan $TTL sebesar 1h menjadi 3.600 detik, dan record yang memiliki TTL sendiri memakai nilai tersebut. Tanda kutip, karakter escape, dan nama tujuan relatif tetap seperti teks aslinya. Jadi “hello; world” tetap menjadi satu nilai TXT, dan “mail” pada data MX tetap “mail”.

## Cara membaca hasil

Parser dapat membaca komentar, teks dalam tanda kutip, dan record multibaris. Catatan penguraian menunjukkan nomor baris yang bermasalah sambil tetap menampilkan record yang berhasil dibaca. Jika zona memakai $INCLUDE atau $GENERATE, jalankan direktif tersebut untuk mendapatkan record lengkapnya sebelum menempelkannya. Alat membaca input secara lokal tanpa menghubungi server DNS atau menguji apakah zona dapat dimuat oleh penyedia tertentu.
