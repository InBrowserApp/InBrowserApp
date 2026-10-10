## Konversi lembar bentang OpenDocument ke Excel

Buka atau letakkan file ODS lokal, periksa selnya, lalu unduh buku kerja XLSX. Nama dan urutan lembar kerja, lembar kerja tersembunyi, teks, angka, nilai boolean, tanggal, hasil rumus tersimpan, dan sel gabungan disertakan. Lembar kerja kosong dan ruang kosong di antara sel dipertahankan. Jendela pratinjau tidak membatasi data yang diekspor.

## Nilai tersimpan dan kompatibilitas

Rumus diubah menjadi nilai tersimpannya, bukan rumus Excel. Hasil tersimpan yang tidak tersedia tetap kosong dan dilaporkan. Browser tidak menghitung ulang rumus atau memperbarui data eksternal. Hasil kesalahan menjadi kesalahan lembar bentang umum. Teks literal tetap berupa teks, termasuk pengenal dengan nol di awal, karakter non-Latin, dan teks yang diawali tanda sama dengan.

Tanggal menggunakan format tanggal dan waktu standar; tanggal dengan zona waktu yang dinyatakan secara eksplisit dikonversi ke UTC. Durasi tetap berupa jumlah hari, dan persentase menggunakan format persentase dasar. Nilai mata uang mempertahankan angkanya, tanpa label mata uang atau pemformatan asli. Gaya, ukuran baris dan kolom, bagan, gambar, komentar, tautan, makro, dan pengaturan buku kerja tidak direproduksi.

File terenkripsi, arsip tidak valid, data yang tidak didukung, serta nilai atau nama lembar kerja di luar batas yang didukung Excel akan menghasilkan pesan kesalahan yang jelas. Konverter ini tidak menerima file Flat OpenDocument (.fods). Periksa hasil penting di aplikasi lembar bentang Anda setelah mengunduh.

## Pemrosesan lokal

Konversi berjalan di browser ini tanpa mengunggah dokumen. Mengganti atau menutup file akan menghapus hasil sebelumnya yang disiapkan untuk diunduh; membatalkan akan menghentikan tugas latar belakang. Tidak ada batas tetap untuk ukuran file atau jumlah lembar kerja. Memori browser yang tersedia tetap menentukan buku kerja mana yang dapat diproses.

Untuk menjelajahi ODS dan format lembar bentang lainnya, buka [Penampil Lembar Bentang](../xlsx-viewer/).
