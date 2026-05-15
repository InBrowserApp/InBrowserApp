# CSR Generator

Certificate Signing Request (CSR) adalah pesan PKCS#10 yang berisi kunci publik Anda, bidang Subject pengenal, ekstensi opsional seperti Subject Alternative Names, dan tanda tangan yang dibuat dengan kunci privat yang sesuai. Certificate authority menggunakan CSR untuk menerbitkan sertifikat X.509 tanpa pernah menerima kunci privat Anda.

Generator ini membuat CSR langsung di browser Anda. Anda dapat membuat pasangan kunci RSA atau ECDSA baru, atau mengimpor kunci privat PEM tanpa enkripsi yang sudah ada saat Anda perlu memperpanjang sertifikat untuk kunci yang sudah digunakan.

## Kapan menggunakannya

Gunakan CSR saat Anda memerlukan certificate authority untuk menerbitkan atau memperpanjang sertifikat TLS, S/MIME, autentikasi klien, atau layanan internal. CSR membuktikan kepemilikan kunci privat dan membawa informasi identitas publik yang harus muncul di sertifikat.

Untuk sertifikat TLS publik, masukkan hostname di Subject Alternative Names. Common Name masih berguna untuk keterbacaan dan sistem lama, tetapi klien modern memvalidasi nama DNS dan alamat IP dari SAN.

## Cara membuat CSR

Pilih apakah akan membuat kunci baru atau mengimpor kunci privat yang sudah ada. Isi bidang Subject yang penting untuk permintaan sertifikat Anda, lalu tambahkan entri SAN untuk nama DNS, alamat IP, alamat email, atau URI. Buat CSR dan kirim hanya CSR PEM ke certificate authority Anda.

Jika alat ini membuat kunci baru, unduh dan simpan kunci privat sebelum meninggalkan halaman. Jika Anda mengimpor kunci, alat ini hanya membuat CSR dan tidak mengekspor ulang kunci privat yang diimpor.

## Catatan kunci dan format

RSA 2048 bit kompatibel secara luas; 3072 atau 4096 bit mungkin lebih disukai untuk sertifikat internal yang berumur lebih panjang. ECDSA P-256 ringkas dan didukung secara luas, sementara P-384 atau P-521 mungkin diwajibkan oleh kebijakan yang lebih ketat. Jalur kunci impor mendukung blok PEM PKCS#8, RSA PRIVATE KEY, dan EC PRIVATE KEY tanpa enkripsi.

Kunci privat bersifat sensitif. Jangan tempelkan ke situs web yang tidak tepercaya, jangan kirimkan ke certificate authority, dan jangan commit ke kontrol sumber. Alat ini berjalan secara lokal di browser, tetapi proses operasional Anda tetap memerlukan penyimpanan dan rotasi kunci yang aman.
