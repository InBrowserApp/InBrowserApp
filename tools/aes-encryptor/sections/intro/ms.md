# Apakah Penyulitan AES?

AES ialah algoritma penyulitan simetri, yang bermaksud rahsia yang sama digunakan untuk menyulitkan dan menyahsulitkan data. Alat ini berjalan sepenuhnya dalam pelayar anda dan menggunakan Web Crypto API, jadi teks biasa, kata laluan, dan fail yang dipilih tidak dimuat naik.

Mod lalai ialah AES-GCM kerana ia menyulitkan dan mengesahkan output. Pengesahan penting: jika ciphertext, salt, atau IV berubah kemudian, penyahsulitan sepatutnya gagal dan bukannya mengembalikan data yang telah diubah. AES-CBC dan AES-CTR tersedia untuk keserasian, tetapi kedua-duanya tidak mengesahkan ciphertext dengan sendirinya.

## Bila Menggunakan Alat Ini

Gunakannya apabila anda perlu melindungi nota, token, petikan konfigurasi, atau fail kecil sebelum menyimpan atau berkongsinya melalui saluran lain. Output ialah sampul JSON yang mengandungi mod, tetapan terbitan kunci, salt, IV, dan ciphertext, supaya parameter tersebut kekal bersama untuk langkah nyahsulit yang sepadan.

Untuk penyulitan berasaskan kata laluan, kata laluan diproses dengan PBKDF2 dan salt rawak. Tingkatkan bilangan lelaran apabila anda boleh menerima penyulitan dan penyahsulitan yang lebih perlahan. Untuk penyulitan kunci mentah, tampal kunci heksadesimal dengan panjang tepat yang dipilih: 32 aksara heks untuk 128-bit, 48 untuk 192-bit, atau 64 untuk 256-bit.

## Nota Praktikal

Simpan kata laluan atau kunci mentah berasingan daripada JSON yang disulitkan. Sesiapa yang mempunyai kedua-dua JSON dan bahan kunci boleh menyahsulitkan data. Jika anda menyulitkan fail, muat turun hasil JSON dan simpan nama fail asal secara berasingan jika konteks itu penting.

Jangan guna semula IV manual dengan kunci yang sama. Alat ini menjana IV dan salt baharu untuk setiap jalanan, iaitu lalai yang lebih selamat. Utamakan AES-GCM melainkan sistem lain secara khusus memerlukan AES-CBC atau AES-CTR.
