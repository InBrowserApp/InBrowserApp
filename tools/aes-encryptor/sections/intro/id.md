# Apa Itu Enkripsi AES?

AES adalah algoritma enkripsi simetris, yang berarti rahasia yang sama digunakan untuk mengenkripsi dan mendekripsi data. Alat ini berjalan sepenuhnya di browser Anda dan menggunakan Web Crypto API, sehingga plaintext, kata sandi, dan file yang dipilih tidak diunggah.

Mode default adalah AES-GCM karena mode ini mengenkripsi dan mengautentikasi output. Autentikasi penting: jika ciphertext, salt, atau IV berubah kemudian, dekripsi seharusnya gagal alih-alih mengembalikan data yang telah diubah. AES-CBC dan AES-CTR tersedia untuk kompatibilitas, tetapi keduanya tidak mengautentikasi ciphertext dengan sendirinya.

## Kapan Menggunakan Alat Ini

Gunakan saat Anda perlu melindungi catatan, token, cuplikan konfigurasi, atau file kecil sebelum menyimpan atau membagikannya melalui saluran lain. Output-nya adalah envelope JSON yang berisi mode, pengaturan derivasi kunci, salt, IV, dan ciphertext, sehingga parameter tersebut tetap bersama untuk langkah dekripsi yang sesuai.

Untuk enkripsi berbasis kata sandi, kata sandi diproses dengan PBKDF2 dan salt acak. Tingkatkan jumlah iterasi jika Anda dapat menerima enkripsi dan dekripsi yang lebih lambat. Untuk enkripsi kunci mentah, tempel kunci heksadesimal dengan panjang persis yang dipilih: 32 karakter hex untuk 128-bit, 48 untuk 192-bit, atau 64 untuk 256-bit.

## Catatan Praktis

Simpan kata sandi atau kunci mentah secara terpisah dari JSON terenkripsi. Siapa pun yang memiliki JSON dan materi kunci dapat mendekripsi data. Jika Anda mengenkripsi file, unduh hasil JSON dan simpan nama file asli secara terpisah jika konteks tersebut penting.

Jangan gunakan ulang IV manual dengan kunci yang sama. Alat ini menghasilkan IV dan salt baru untuk setiap proses, yang merupakan default yang lebih aman. Pilih AES-GCM kecuali sistem lain secara khusus memerlukan AES-CBC atau AES-CTR.
