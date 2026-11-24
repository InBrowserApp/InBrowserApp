## Cara menggunakan terminal serial di browser

Hubungkan Arduino, ESP32, Raspberry Pi Pico, atau adaptor serial USB dengan kabel data. Atur laju baud yang digunakan perangkat, misalnya 9600 atau 115200, lalu pilih **Hubungkan** dan pilih port perangkat di browser. Monitor serial ini menggunakan 8 bit data, tanpa paritas, satu bit stop, dan tanpa kontrol alur (8N1).

## Mengirim teks dan byte heksadesimal

Teks dikirim dalam UTF-8. Pilih LF, CR, atau CR + LF jika perangkat menggunakan akhir baris untuk mengirim perintah. Untuk perintah biner, pilih **Heksadesimal** dan masukkan byte lengkap seperti `41 54 0D 0A`. Format heksadesimal mengirim byte sebagaimana dimasukkan, tanpa akhir baris otomatis.

## Membaca dan menyimpan log serial

Log menampilkan data yang diterima (RX) dan dikirim (TX) beserta stempel waktu. Beralihlah ke Heksadesimal untuk memeriksa setiap byte jika teks terlihat kacau. Jeda pengguliran untuk memeriksa entri sebelumnya saat data terus masuk, atau unduh log yang tersimpan sebagai file teks. Data serial tetap berada di tab ini sampai Anda memilih untuk menyimpannya.

## Mengapa saya tidak bisa terhubung ke perangkat?

Gunakan browser terbaru yang mendukung Web Serial dan pastikan sistem operasi mengenali port serial. Coba kabel lain dan tutup monitor serial lain yang sedang menggunakan port tersebut. Jika perangkat terhubung tetapi menghasilkan teks yang tidak terbaca, periksa laju baud dan coba lihat byte dalam format Heksadesimal.
