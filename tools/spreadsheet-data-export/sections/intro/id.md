## Ekspor lembar kerja ke format portabel

Buka file lokal .xlsx, .xlsm, .xltx, atau .xltm atau letakkan di pengekspor. Pilih lembar kerja berdasarkan nama aslinya, termasuk lembar kerja tersembunyi, lalu pilih CSV, TSV, JSON, atau Markdown. Pratinjau hasilnya, salin, atau unduh file UTF-8 yang diberi nama sesuai buku kerja dan lembar kerja. Mengganti atau menutup file membatalkan pekerjaan yang belum selesai dan menghapus hasil sebelumnya yang tersedia untuk diunduh. Penampil Lembar Bentang juga menyediakan tindakan Ekspor lembar kerja untuk lembar saat ini.

Rentang sel default adalah persegi panjang terkecil yang memuat nilai tersimpan atau rumus. Sel dan baris kosong di dalam persegi panjang tersebut tetap disertakan dalam hasil. Anda dapat memasukkan rentang lain, seperti A1:D20, lalu memilih Terapkan rentang. Lembar kosong menghasilkan file teks kosong atau larik JSON kosong, kecuali jika Anda memilih rentang secara eksplisit.

## Pilih cara nilai dan header ditampilkan

Teks berformat mengikuti format angka yang didukung, mempertahankan tanggal yang ditampilkan dan format angka dengan nol di awal jika tersedia. Format yang bergantung pada lokal dapat berbeda dari Excel. Nilai tersimpan mempertahankan angka dan boolean; tanggal tetap berupa nomor seri Excel tanpa diberi zona waktu. Sel teks mempertahankan teksnya dalam kedua mode. Rumus menggunakan hasil tersimpan tanpa dihitung ulang. Jika hasil tersimpan tidak tersedia, sel menjadi kosong dan pemberitahuan muncul di antarmuka. Kesalahan lembar bentang tetap berupa string yang dapat dibaca seperti #DIV/0!.

CSV dan TSV mengapit bidang yang berisi pemisah, tanda kutip, atau baris baru dengan tanda kutip. JSON berupa larik yang berisi larik untuk setiap baris: baris pertama tetap menjadi data, header yang sama atau kosong tidak menjadi kunci objek, dan sel kosong menggunakan null. Markdown dapat memperlakukan baris pertama sebagai header atau menambahkan header kosong di atas semua baris data. Tanda baca Markdown, HTML, garis vertikal, dan baris baru dalam sel di-escape atau direpresentasikan dengan aman. Unduhan menggunakan UTF-8 tanpa penanda urutan byte; pilih UTF-8 saat mengimpor ke aplikasi lain.

## Pemrosesan lokal dan kompatibilitas

Buku kerja Anda tetap berada di browser ini dan tidak diunggah atau disimpan oleh alat ini. Makro, skrip, dan koneksi data eksternal tidak dijalankan atau diperbarui. Baris dan kolom tersembunyi disertakan dalam rentang yang dipilih. Sel gabungan tidak diperluas menjadi nilai berulang. Bagan, gambar, komentar, dan gaya buku kerja tidak disertakan dalam format teks ini.

Buku kerja yang terenkripsi, rusak, atau tidak didukung akan menampilkan pesan kesalahan yang jelas. Tidak ada batas tetap untuk ukuran file, jumlah lembar kerja, baris, atau kolom, tetapi ekspor yang besar dapat melebihi memori browser. Alat ini mengekspor data tersimpan; alat ini tidak mengedit buku kerja atau menjamin bahwa aplikasi lembar bentang lain akan menafsirkan bidang teks biasa dengan cara yang sama.
