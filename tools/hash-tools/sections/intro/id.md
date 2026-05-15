Koleksi alat hash menyatukan utilitas hashing yang telah dimigrasikan sehingga Anda dapat memilih algoritma yang tepat sebelum membuka alat tertentu. Koleksi ini mencakup digest file sehari-hari, pemeriksaan kompatibilitas lama, autentikasi pesan berkunci, string Subresource Integrity, hashing kata sandi, verifikasi kata sandi, dan checksum non-kriptografis cepat.

## Kapan menggunakan alat ini

Gunakan alat digest kriptografis saat Anda membutuhkan sidik jari yang dapat diulang untuk teks atau file, seperti membandingkan arsip yang diunduh dengan checksum SHA-256 yang dipublikasikan. Gunakan HMAC saat hasilnya harus membuktikan bahwa seseorang dengan rahasia bersama membuat atau menyetujui pesan tersebut. Gunakan Argon2, bcrypt, PBKDF2, atau scrypt untuk alur kerja kata sandi dan derivasi kunci, ketika biaya yang dapat dikonfigurasi lebih penting daripada kecepatan mentah.

## Memilih dengan aman

Tidak semua hash cocok untuk keamanan. MD4, MD5, dan SHA-1 berguna untuk sistem lama dan pemeriksaan kompatibilitas, tetapi tidak boleh digunakan untuk desain integritas baru yang sensitif terhadap keamanan. CRC, Adler-32, MurmurHash, CityHash, dan xxHash adalah checksum cepat atau hash pengelompokan, bukan tanda tangan yang tahan manipulasi. Jika Anda tidak yakin, pilih SHA-256 untuk checksum publik, HMAC-SHA-256 untuk verifikasi berkunci, dan Argon2id atau bcrypt untuk penyimpanan kata sandi.

## Privasi dan alur kerja

Setiap alat dalam koleksi ini berjalan di browser. Teks dan file diproses secara lokal oleh alat yang dipilih kecuali alat tersebut secara eksplisit mendokumentasikan perilaku pencarian publik, yang tidak dibutuhkan oleh alat hash ini. Untuk materi sensitif, hapus nilai yang dihasilkan setelah digunakan dan hindari menempelkan rahasia ke sesi browser yang dibagikan atau direkam.
