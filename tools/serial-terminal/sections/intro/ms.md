## Cara menggunakan terminal bersiri dalam pelayar

Sambungkan Arduino, ESP32, Raspberry Pi Pico atau penyesuai USB bersiri anda dengan kabel data. Tetapkan kadar baud yang digunakan oleh peranti, contohnya 9600 atau 115200, kemudian pilih **Sambung** dan pilih portnya dalam pelayar. Monitor bersiri ini menggunakan 8 bit data, tiada pariti, satu bit henti dan tiada kawalan aliran (8N1).

## Menghantar teks dan bait heksadesimal

Teks dihantar dalam UTF-8. Pilih LF, CR atau CR + LF jika peranti anda menggunakan akhiran baris untuk melaksanakan arahan. Untuk arahan binari, pilih **Heksadesimal** dan masukkan bait lengkap seperti `41 54 0D 0A`. Mod heksadesimal menghantar bait seperti yang dimasukkan, tanpa akhiran baris automatik.

## Membaca dan menyimpan log bersiri

Log memaparkan data yang diterima (RX) dan dihantar (TX) bersama cap masa. Tukar kepada heksadesimal untuk memeriksa bait satu per satu apabila teks kelihatan tidak jelas. Jeda tatalan untuk memeriksa entri terdahulu sementara data terus diterima, atau muat turun log yang disimpan sebagai fail teks. Data bersiri kekal dalam tab ini sehingga anda memilih untuk menyimpannya.

## Mengapa saya tidak dapat menyambung ke peranti saya?

Gunakan pelayar terkini yang menyokong Web Serial dan pastikan sistem pengendalian mengenali port bersiri. Cuba kabel lain dan tutup mana-mana monitor bersiri lain yang sedang menggunakan port tersebut. Jika peranti bersambung tetapi menghasilkan teks yang tidak dapat dibaca, periksa kadar baud dan cuba lihat bait dalam mod heksadesimal.
