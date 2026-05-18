Buat identifier UUID v1 secara lokal di browser saat Anda membutuhkan nilai yang menyertakan waktu pembuatan dan identifier node. Alat ini berguna untuk integrasi lama, impor database, fixture berurutan, dan sistem yang masih mengharapkan UUID versi 1 RFC 4122.

## Kapan UUID v1 Membantu

UUID v1 menyimpan timestamp, urutan clock, dan nilai node 48-bit dalam string UUID standar 36 karakter. Ini membuat ID yang dibuat kurang lebih dapat diurutkan berdasarkan waktu pembuatan, sekaligus tetap cocok untuk sistem yang menerima kolom UUID biasa, URL, log, dan payload API.

## Privasi Dan Identifier Node

Pembuatan UUID v1 klasik menggunakan alamat MAC kartu jaringan asli, yang dapat mengekspos informasi perangkat keras. Alat ini memulai dengan alamat MAC acak yang dikelola secara lokal. Anda dapat memasukkan nilai node tertentu saat mencocokkan sistem lama, tetapi hindari penggunaan alamat perangkat keras asli dalam sampel publik atau data bersama.

## Urutan Clock Dan Pembuatan Batch

Urutan clock adalah nilai 14-bit yang membantu menghindari collision saat node yang sama membuat ID pada waktu yang berdekatan. Pembuatan batch mempertahankan semua ID dalam milidetik yang sama dan menaikkan tick 100 nanodetik untuk setiap baris, sehingga setiap nilai dalam hasil tetap berbeda.
