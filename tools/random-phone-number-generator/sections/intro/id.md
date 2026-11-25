## Buat sekumpulan nomor telepon contoh

Pilih negara atau wilayah, pilih format nomor, masukkan jumlah, lalu pilih **Buat**. Salin hasil ke formulir atau unduh berkas teks UTF-8 dengan satu nomor per baris. Gunakan nomor ini untuk menguji pola pengisian formulir, mengisi daftar kontak contoh, atau menguji cara aplikasi menyimpan dan menampilkan nomor telepon.

## Pilih format nasional atau internasional

Format **Nasional** mengikuti pola nomor Faker.js untuk negara yang dipilih. Sebagai contoh, nomor Amerika Serikat dapat ditampilkan sebagai `(202) 555-0100`, sedangkan nomor Britania Raya dapat ditampilkan sebagai `07700 900123`. Format **Internasional (E.164)** menuliskan tanda plus, kode panggilan negara, dan digit berikutnya secara berurutan tanpa spasi, seperti `+12025550100` atau `+447700900123`.

## Pertahankan tanda plus dan angka nol di awal

Simpan nomor telepon sebagai teks di lembar kerja dan basis data. Jika lembar kerja mengimpor `07700 900123` atau `+447700900123` sebagai angka, angka nol di awal atau tanda plus bisa hilang. Nomor contoh ini berguna untuk menguji format. Untuk menguji panggilan atau SMS, gunakan nomor uji yang Anda kendalikan.
