Alih keluar sekatan kata laluan pemilik daripada PDF terus dalam penyemak imbas anda. Alat ini mencipta PDF baharu yang tidak lagi membawa penanda kebenaran untuk menyunting, mencetak, menyalin atau mengekstrak halaman.

## Bila menggunakannya

Gunakannya apabila anda sudah mempunyai PDF yang dibuka seperti biasa, tetapi dokumen itu menyekat tindakan biasa seperti mencetak, menyalin teks, menyunting halaman atau menyusun halaman dalam alat PDF lain. Perkara ini biasa berlaku pada borang, laporan yang dieksport, invois lama dan dokumen yang dicipta dengan tetapan kebenaran PDF yang mengehadkan.

## Cara ia berfungsi

Muat naik satu PDF, semak fail yang dipilih, kemudian jalankan langkah pengalihan keluar. Alat ini menjalankan qpdf dalam worker penyemak imbas dengan operasi PDF `--decrypt` dan mengembalikan fail PDF baharu untuk dimuat turun. Fail asal dibiarkan tanpa perubahan, jadi anda boleh membandingkan atau membuang output jika ia bukan versi yang anda perlukan.

## Privasi dan batasan

PDF kekal dalam sesi penyemak imbas ini; ia tidak dimuat naik ke pelayan. Alat ini mengalih keluar sekatan kebenaran kata laluan pemilik daripada PDF yang sudah boleh dibuka. Ia tidak memulihkan kata laluan pengguna/buka yang hilang, dan ia tidak dapat membuka kunci fail yang rosak atau mod penyulitan yang tidak disokong oleh binaan qpdf di sisi penyemak imbas.
