Dekripsi AES memulihkan plaintext dari data yang dienkripsi dengan materi kunci AES yang sama. Alat ini dirancang untuk envelope JSON yang dihasilkan oleh AES Encryptor InBrowser.App. Envelope menyimpan algoritma, pengaturan derivasi kunci, salt, IV, ciphertext, dan metadata plaintext bersama-sama, sementara kata sandi atau kunci mentah tetap terpisah.

Semua proses berlangsung secara lokal dengan Web Crypto API di browser. JSON terenkripsi, kata sandi, kunci mentah, dan hasil dekripsi tidak diunggah.

## Kapan Menggunakan Alat Ini

Gunakan saat seseorang memberi Anda envelope JSON `inbrowser-aes-v1` atau saat Anda perlu memulihkan catatan, token, cuplikan konfigurasi, atau file yang sebelumnya Anda enkripsi dengan halaman AES Encryptor yang sesuai.

Jika envelope dibuat dengan kata sandi, masukkan kata sandi yang sama dan alat ini akan menggunakan kembali hash PBKDF2, jumlah iterasi, salt, mode AES, dan panjang kunci yang tersimpan. Jika envelope dibuat dengan kunci mentah, tempel kunci heksadesimal persis sesuai panjang yang tercatat di envelope.

## Catatan Praktis

AES-GCM mengautentikasi data terenkripsi, sehingga kunci yang salah atau JSON yang diubah seharusnya gagal alih-alih mengembalikan plaintext yang telah berubah. AES-CBC dan AES-CTR dapat mendekripsi envelope yang kompatibel, tetapi keduanya tidak mengautentikasi ciphertext dengan sendirinya.

Simpan kata sandi atau kunci mentah secara terpisah dari envelope JSON. Siapa pun yang memiliki envelope dan materi kunci dapat memulihkan plaintext. Untuk envelope file, unduhan yang dipulihkan menggunakan nama file asli dan tipe media yang tersimpan di JSON.
