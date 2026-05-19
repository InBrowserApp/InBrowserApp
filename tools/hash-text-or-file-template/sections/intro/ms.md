## Apakah hash teks atau fail?

Fungsi hash menukar teks atau bait fail kepada nilai hash dengan panjang tetap. Input dan algoritma yang sama sentiasa menghasilkan nilai hash yang sama, jadi hash berguna apabila anda memerlukan cap jari yang boleh diulang tanpa memuat naik data peribadi.

## Bila menggunakan alat ini

Gunakan alat ini untuk mengesahkan checksum muat turun, membandingkan sama ada dua fail adalah sama, merekod cap jari ringkas untuk petikan teks, atau menyahpepijat sistem yang menerbitkan nilai hash SHA. Mengimport fail akan menjana hash terus daripada bait fail, manakala mod teks menjana hash daripada teks UTF-8 yang ditunjukkan dalam editor.

## Memilih algoritma

SHA-256 ialah pilihan lalai yang kukuh untuk semakan integriti baharu. SHA-384 dan SHA-512 menyediakan nilai hash SHA-2 yang lebih panjang apabila sistem lain menjangkakan format tersebut. SHA-1 disertakan untuk perbandingan legasi, tetapi ia tidak patut digunakan untuk reka bentuk baharu yang sensitif keselamatan.

## Privasi dan batasan

Proses hashing berjalan secara tempatan dalam pelayar anda melalui Web Crypto, dan fail tidak dimuat naik. Hash bukan penyulitan: ia tidak boleh melindungi rahsia dengan sendirinya, dan penyimpanan kata laluan memerlukan fungsi hashing kata laluan khusus dengan salt dan faktor kerja.
