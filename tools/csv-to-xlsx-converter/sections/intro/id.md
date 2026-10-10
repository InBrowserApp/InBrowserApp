## Konversi teks berpemisah ke Excel

Buka atau letakkan file CSV atau TSV lokal, periksa selnya, lalu unduh buku kerja XLSX dengan satu lembar kerja bernama Sheet1. Pilih pemisah dan pengodean teks jika deteksi otomatis tidak sesuai dengan file. File TSV menggunakan tab secara default. Jendela pratinjau tidak membatasi data yang diekspor.

## Pertahankan pengenal dan teks asli

CSV dan TSV tidak menyimpan tipe sel lembar bentang. Konverter ini mempertahankan setiap bidang sebagai teks, termasuk nol di awal, pengenal panjang, angka yang menyerupai desimal, tanggal, dan teks yang diawali tanda sama dengan. Bidang tidak ditafsirkan sebagai angka atau tanggal dan rumus tidak dijalankan. Pemisah di dalam tanda kutip, tanda kutip yang di-escape, Unicode, baris baru di dalam bidang, bidang kosong, dan rekaman kosong dipertahankan. Baris yang lebih pendek menyisakan sel kosong. Akhir baris di ujung file mengakhiri rekaman terakhir, bukan menambahkan baris lain.

Pengaturan baris pertama menawarkan data biasa atau header dengan filter Excel. Keduanya mempertahankan baris persis seperti aslinya, termasuk header duplikat atau kosong. Pengodean otomatis mendukung UTF-8 dan UTF-16 dengan penanda urutan byte. Pengodean lain dapat dipilih secara manual. Instruksi sep= di awal hanya dihilangkan jika deteksi pemisah otomatis dipilih atau pemisahnya cocok dengan pemisah yang dipilih.

Bidang dengan tanda kutip yang tidak tepat, pengodean teks yang tidak valid, dan data yang melampaui batas baris, kolom, atau teks sel Excel akan menghasilkan kesalahan alih-alih buku kerja yang terpotong. Periksa nilai penting di aplikasi lembar bentang setelah mengunduh.

## Pemrosesan lokal

Konversi berjalan di browser ini tanpa mengunggah file. Mengubah pengaturan impor, mengganti atau menutup file akan menghapus hasil sebelumnya. Membatalkan akan menghentikan tugas latar belakang. Tidak ada batas tetap untuk ukuran file; memori browser yang tersedia menentukan file mana yang dapat diproses.

Untuk menjelajahi file lembar bentang, buka [Penampil Lembar Bentang](../xlsx-viewer/).
