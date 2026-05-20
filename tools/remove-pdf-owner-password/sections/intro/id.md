Hapus pembatasan kata sandi pemilik dari PDF langsung di browser Anda. Alat ini membuat PDF baru yang tidak lagi memiliki penanda izin untuk mengedit, mencetak, menyalin, atau mengekstrak halaman.

## Kapan menggunakannya

Gunakan saat Anda sudah memiliki PDF yang terbuka secara normal, tetapi dokumen tersebut memblokir tindakan umum seperti mencetak, menyalin teks, mengedit halaman, atau menyusun halaman di alat PDF lain. Hal ini umum terjadi pada formulir, laporan hasil ekspor, faktur lama, dan dokumen yang dibuat dengan pengaturan izin PDF yang membatasi.

## Cara kerjanya

Unggah satu PDF, tinjau file yang dipilih, lalu jalankan langkah penghapusan. Alat ini menjalankan qpdf di worker browser dengan operasi PDF `--decrypt` dan mengembalikan file PDF baru untuk diunduh. File asli dibiarkan tidak berubah, sehingga Anda dapat membandingkan atau membuang hasilnya jika itu bukan versi yang Anda perlukan.

## Privasi dan batasan

PDF tetap berada di sesi browser ini; file tidak diunggah ke server. Alat ini menghapus pembatasan izin kata sandi pemilik dari PDF yang sudah dapat dibuka. Alat ini tidak memulihkan kata sandi pengguna/pembuka yang hilang, dan tidak dapat membuka file rusak atau mode enkripsi yang tidak didukung oleh versi qpdf sisi browser.
