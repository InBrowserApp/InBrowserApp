## Membuka arsip web WARC

Pilih atau seret dan lepaskan file `.warc` atau `.warc.gz`, atau coba arsip contoh. Penampil akan membuat daftar rekaman dan membuka halaman HTML pertama yang ditemukan dalam arsip. Gunakan filter URL atau jenis rekaman untuk menemukan salinan yang dicari, lalu beralih antara pratinjau halaman dan detail rekaman. Pengindeksan arsip besar dapat memakan waktu. File tetap berada di browser Anda.

## Membaca waktu pengarsipan dan header

File Web ARChive (WARC) menyimpan rekaman yang dikumpulkan perayap web atau alat pengarsipan saat mengunjungi situs. Satu URL dapat memiliki beberapa rekaman. Gunakan waktu pengarsipan dalam UTC dan status HTTP asli untuk membedakannya. Rekaman respons (`response`) berisi jawaban server, sedangkan rekaman permintaan (`request`) mencatat data yang dikirim perayap. Rekaman kunjungan ulang (`revisit`) dapat merujuk ke salinan lain tanpa menyimpan halaman itu lagi. Anda tetap dapat memeriksa rekaman ini meski pratinjau halaman tidak tersedia.

## Apa yang ditampilkan dalam pratinjau?

Pratinjau statis menggunakan HTML serta gambar dan lembar gaya yang didukung dari arsip yang sama. Sumber daya yang hilang dapat mengubah tata letak atau membuat sebagian halaman kosong. Skrip dinonaktifkan dan pratinjau tidak mengirim permintaan ke situs asli, sehingga fitur interaktif seperti masuk ke akun dan pemutaran video tidak tersedia. Penampil mendukung WARC 1.0 dan 1.1, termasuk rekaman yang dikompresi dengan gzip.

[Spesifikasi format WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
