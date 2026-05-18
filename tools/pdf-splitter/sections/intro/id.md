## Apa fungsi alat ini

PDF Splitter memungkinkan Anda membuka PDF di browser, memilih halaman
berdasarkan rentang atau nomor halaman, dan membuat dokumen yang lebih kecil.
Anda dapat mengekstrak halaman yang dipilih menjadi satu PDF, memisahkan setiap
rentang yang diketik menjadi PDF terpisah, atau memisahkan setiap halaman yang
dipilih menjadi file tersendiri dan mengunduh hasilnya sebagai arsip ZIP.

## Kasus penggunaan yang baik

- Mengambil beberapa halaman dari kontrak, laporan, panduan, atau pindaian
  panjang sebelum membagikannya kepada orang lain.
- Memisahkan bab, faktur, formulir, atau bagian lampiran menjadi file PDF
  tersendiri.
- Menghapus halaman yang tidak Anda perlukan sebelum mengirim dokumen ke
  percetakan, meja dukungan, atau alur persetujuan.
- Membuat pemisahan yang dapat diulang dengan sintaks rentang seperti
  `1-3,5,8-10` alih-alih mengeklik setiap halaman secara manual.

## Cara kerja rentang halaman

Gunakan nomor halaman dan rentang inklusif yang dipisahkan koma.
`1-3,5,8-10` memilih halaman 1, 2, 3, 5, 8, 9, dan 10. Sebuah halaman
hanya dapat muncul satu kali dalam ekspresi, dan rentang menurun seperti `7-4`
ditolak agar urutan keluaran tetap jelas dan dapat diprediksi.

Untuk satu PDF keluaran, halaman yang dipilih disalin ke satu dokumen baru
dalam urutan yang ditampilkan oleh ekspresi rentang. Untuk beberapa PDF
keluaran, "satu file per rentang" mempertahankan setiap segmen yang diketik
tetap bersama, sedangkan "satu file per halaman" membuat PDF terpisah untuk
setiap halaman yang dipilih.

## Catatan privasi

PDF diproses secara lokal di browser Anda dan tidak diunggah oleh alat ini.
Tautan unduhan yang dibuat adalah URL objek sementara yang hanya ada di tab
saat ini. Tinjau file hasil sebelum membagikannya, karena halaman yang disalin
masih dapat berisi metadata tertanam, anotasi, nilai formulir, atau konten
tersembunyi dari dokumen asli.

## Batasan

PDF yang terenkripsi, dilindungi kata sandi, atau rusak mungkin tidak dapat
dibuka di pustaka PDF di browser. Pemisah ini menyalin halaman ke PDF baru,
tetapi bukan alat untuk menghapus informasi sensitif secara visual dan tidak
menjamin seluruh metadata dokumen terhapus. Untuk penghapusan informasi
sensitif demi kebutuhan hukum, perbaikan aksesibilitas, atau optimasi lanjutan,
gunakan editor PDF khusus setelah pemisahan.
