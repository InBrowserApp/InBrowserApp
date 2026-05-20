## Apa Itu UUID Nil?

UUID nil adalah UUID standar yang 128 bitnya semuanya nol. Bentuk teks kanonisnya adalah `00000000-0000-0000-0000-000000000000`, dan sering digunakan untuk berarti "belum ada UUID yang ditetapkan."

## Kapan Menggunakannya

Gunakan UUID nil ketika API, kolom database, fixture, atau file konfigurasi memerlukan nilai berbentuk UUID tetapi pengidentifikasi sebenarnya sengaja tidak ada. UUID ini berguna sebagai placeholder dalam pengujian, template impor, skrip migrasi, dan protokol yang mendefinisikan nilai UUID kosong secara eksplisit.

## Hal yang Perlu Diperhatikan

Jangan perlakukan UUID nil sebagai pengidentifikasi unik yang dihasilkan. Nilainya selalu sama setiap kali, sehingga menyimpannya di tempat yang mengharapkan ID objek nyata dapat menyembunyikan data yang hilang, merusak asumsi keunikan, atau membuat catatan terlihat saling terhubung padahal tidak.
