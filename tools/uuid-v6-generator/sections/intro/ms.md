Penjana UUID v6 mencipta UUID berasaskan masa yang mengekalkan bentuk UUID yang biasa sambil meletakkan cap masa di hadapan untuk pengisihan leksikal semula jadi. Ia berjalan sepenuhnya dalam pelayar anda, jadi pengecam yang dijana dan nilai nod pilihan tidak pernah meninggalkan halaman.

## Bila UUID v6 Membantu

Gunakan UUID v6 apabila anda memerlukan pengecam yang kekal serasi secara meluas dengan peralatan UUID tetapi juga diisih hampir mengikut urutan penciptaan dalam log, indeks pangkalan data, strim peristiwa, atau skrip migrasi. UUID v6 paling hampir dengan UUID v1 dari segi semantik: ia menggunakan cap masa Gregorian, jujukan jam, dan medan nod 48-bit, tetapi menyusun semula bit cap masa supaya ID yang lebih baharu diisih selepas ID yang lebih lama.

## ID Nod dan Privasi

Penjana UUID v1 klasik sering menggunakan alamat MAC sebenar sebagai medan nod. Alat ini secara lalai menggunakan ID nod rawak yang ditadbir secara setempat untuk setiap UUID yang dijana supaya ia tidak mendedahkan alamat perkakasan. Tukar kepada nod tersuai hanya apabila anda memang memerlukan output serasi v1 untuk lekapan ujian, semakan saling kendali, atau sistem terkawal.

## Jujukan Jam dan Masa Tersuai

Jujukan jam membantu mengelakkan perlanggaran apabila cap masa berulang atau jam bergerak ke belakang. Jujukan rawak lalai paling selamat untuk penggunaan biasa. Cap masa, ID nod, dan jujukan jam tersuai berguna untuk contoh deterministik, tetapi nilai tersuai yang berulang harus digunakan dengan berhati-hati dalam data pengeluaran.
