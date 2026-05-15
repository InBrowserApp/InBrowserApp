## Apa itu pasangan kunci SSH?

Pasangan kunci SSH adalah kunci publik dan kunci privat yang digunakan untuk autentikasi ke server, host Git, sistem deployment, dan layanan lain berbasis SSH. Kunci publik dapat dibagikan. Kunci privat harus tetap rahasia.

Pembuat ini membuat kunci Ed25519 atau RSA berformat OpenSSH sepenuhnya di browser Anda. Alat ini juga menampilkan sidik jari SHA-256, yaitu nilai ringkas yang biasanya ditampilkan OpenSSH saat Anda memverifikasi kunci.

## Kapan menggunakan alat ini

- Buat kunci pengembangan untuk server uji, remote Git, kontainer, atau lingkungan lab sementara.
- Buat kunci Ed25519 saat Anda membutuhkan bawaan modern dan ringkas untuk akses SSH baru.
- Buat kunci RSA saat layanan lama tidak mendukung Ed25519.
- Salin kunci publik ke `authorized_keys` sambil menjaga kunci privat tetap di perangkat Anda.

## Cara memilih algoritme

Ed25519 adalah pilihan bawaan terbaik untuk sebagian besar kunci SSH baru karena kecil, cepat, dan didukung luas oleh versi OpenSSH saat ini. RSA berguna untuk kompatibilitas dengan appliance lama, server Git legacy, atau persyaratan kebijakan yang masih mengharapkan kunci RSA.

Untuk RSA, 4096 bit adalah nilai bawaan yang konservatif. Kunci 2048-bit yang lebih kecil lebih cepat dan masih umum, tetapi banyak tim kini memilih 3072 atau 4096 bit untuk kunci baru berumur panjang.

## Hal yang perlu diperhatikan

- Kunci privat yang dibuat di sini tidak terenkripsi. Tambahkan frasa sandi dengan `ssh-keygen -p -f <key-file>` jika Anda memerlukannya.
- Simpan kunci privat dengan izin ketat, seperti `chmod 600 <key-file>`.
- Jangan tempelkan kunci privat ke tiket, chat, log, atau halaman web yang tidak dikenal.
- Rotasi kunci ketika laptop, rahasia CI, atau cadangan yang berisi kunci privat mungkin terekspos.
