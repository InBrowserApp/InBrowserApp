Penyahsulitan AES memulihkan teks biasa daripada data yang disulitkan dengan bahan kunci AES yang sama. Alat ini direka untuk sampul JSON yang dihasilkan oleh Penyulit AES InBrowser.App. Sampul ini menyimpan algoritma, tetapan terbitan kunci, salt, IV, ciphertext, dan metadata teks biasa bersama-sama, manakala kata laluan atau kunci mentah kekal berasingan.

Semua kerja berlaku secara setempat dengan Web Crypto API pelayar. JSON yang disulitkan, kata laluan, kunci mentah, dan hasil yang dinyahsulitkan tidak dimuat naik.

## Bila Menggunakan Alat Ini

Gunakannya apabila seseorang memberi anda sampul JSON `inbrowser-aes-v1` atau apabila anda perlu memulihkan nota, token, petikan konfigurasi, atau fail yang pernah anda sulitkan lebih awal dengan halaman Penyulit AES yang sepadan.

Jika sampul dicipta dengan kata laluan, masukkan kata laluan yang sama dan alat ini akan menggunakan semula cincang PBKDF2, bilangan lelaran, salt, mod AES, dan panjang kunci yang disimpan. Jika sampul dicipta dengan kunci mentah, tampal kunci heksadesimal tepat dengan panjang yang direkodkan dalam sampul.

## Nota Praktikal

AES-GCM mengesahkan data yang disulitkan, jadi kunci yang salah atau JSON yang diubah sepatutnya gagal dan bukannya mengembalikan teks biasa yang telah berubah. AES-CBC dan AES-CTR boleh menyahsulitkan sampul yang serasi, tetapi kedua-duanya tidak mengesahkan ciphertext dengan sendirinya.

Simpan kata laluan atau kunci mentah berasingan daripada sampul JSON. Sesiapa sahaja yang mempunyai sampul dan bahan kunci boleh memulihkan teks biasa. Untuk sampul fail, muat turun yang dipulihkan menggunakan nama fail asal dan jenis media yang disimpan dalam JSON.
