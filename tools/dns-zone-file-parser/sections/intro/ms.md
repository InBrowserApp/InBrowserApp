## Cara membaca fail zon DNS

Buka fail eksport DNS dalam format BIND atau tampal teksnya. Muatkan contoh untuk melihat rekod SOA, rekod alamat IPv4 dan IPv6, rekod mel dan rentetan TXT. Setiap baris memaparkan nama, kelas, jenis, tempoh hayat (TTL) dalam saat dan data rekod. Tapis mengikut nama, jenis seperti MX atau sebahagian nilai, kemudian salin rekod yang dipaparkan sebagai JSON untuk inventori atau migrasi.

## Cara domain asas, TTL dan data rekod dikendalikan

Jika $ORIGIN ditetapkan kepada “example.com.”, nama relatif “www” menjadi www.example.com. Nama @ merujuk kepada domain asas semasa, manakala rekod pada baris berinden mewarisi nama sebelumnya. Jika fail tiada $ORIGIN, masukkan domainnya dalam medan Domain asas awal. Nilai lalai $TTL sebanyak 1h menjadi 3,600 saat, manakala rekod dengan TTL sendiri menggunakan nilai tersebut. Tanda petikan, aksara lepas dan nama sasaran relatif dikekalkan seperti dalam teks asal. Oleh itu, “hello; world” kekal sebagai satu nilai TXT, dan “mail” dalam data MX kekal sebagai “mail”.

## Cara memahami hasil

Penghurai membaca komen, teks dalam tanda petikan dan rekod berbilang baris. Nota penghuraian menunjukkan nombor baris yang bermasalah sambil tetap memaparkan rekod yang berjaya dibaca. Jika zon menggunakan $INCLUDE atau $GENERATE, kembangkan arahan tersebut kepada rekod lengkap sebelum menampalnya. Input dibaca secara setempat tanpa menghubungi pelayan DNS atau menguji sama ada zon boleh dimuatkan oleh penyedia tertentu.
