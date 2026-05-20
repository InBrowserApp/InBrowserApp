## Apakah Itu UUID Nil?

UUID nil ialah UUID yang distandardkan dengan kesemua 128 bitnya bernilai sifar. Bentuk teks kanoniknya ialah `00000000-0000-0000-0000-000000000000`, dan ia sering digunakan untuk bermaksud "tiada UUID yang telah ditetapkan lagi."

## Bila Menggunakannya

Gunakan UUID nil apabila API, lajur pangkalan data, fixture, atau fail konfigurasi memerlukan nilai berbentuk UUID tetapi pengecam sebenar sengaja tiada. Ia berguna sebagai pemegang tempat dalam ujian, templat import, skrip migrasi, dan protokol yang mentakrifkan nilai UUID kosong secara jelas.

## Perkara yang Perlu Diperhatikan

Jangan anggap UUID nil sebagai pengecam unik yang dijana. Nilainya sama setiap kali, jadi menyimpannya di tempat yang menjangkakan ID objek sebenar boleh menyembunyikan data yang hilang, memecahkan andaian keunikan, atau membuat rekod kelihatan berkaitan sedangkan sebenarnya tidak.
