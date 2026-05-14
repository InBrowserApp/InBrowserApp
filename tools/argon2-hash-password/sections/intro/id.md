## Apa itu Argon2?

Argon2 adalah algoritma hashing kata sandi yang dirancang untuk membuat cracking kata sandi offline menjadi mahal. Algoritma ini menggabungkan komputasi berulang dengan biaya memori yang dapat dikonfigurasi, sehingga penyerang membutuhkan waktu dan memori untuk setiap tebakan kata sandi.

**Mengapa Argon2id biasanya menjadi pilihan bawaan:**

- Argon2id menyeimbangkan ketahanan terhadap serangan side-channel dan cracking GPU lebih baik daripada menggunakan Argon2i atau Argon2d untuk sebagian besar sistem penyimpanan kata sandi
- Keluaran terenkode menyimpan algoritma, versi, memori, iterasi, paralelisme, salt, dan hash dalam satu string portabel
- Salt acak yang unik mencegah kata sandi yang identik menghasilkan hash tersimpan yang identik
- Pengaturan memori dan iterasi dapat ditingkatkan saat lingkungan verifikasi Anda menjadi lebih cepat

**Cara menggunakan alat ini:**

1. Masukkan kata sandi yang ingin Anda hash.
2. Pertahankan salt yang dihasilkan atau buat salt acak baru.
3. Pilih varian Argon2 dan sesuaikan memori, iterasi, paralelisme, serta panjang hash untuk sistem yang akan memverifikasi hash.
4. Buat hash terenkode dan simpan seluruh string tersebut di basis data aplikasi Anda.

**Catatan keamanan:**

- Jangan simpan atau catat kata sandi polos.
- Gunakan salt acak baru untuk setiap kata sandi.
- Gunakan secret opsional hanya jika pemverifikasi Anda juga memiliki secret yang sama; jika tidak, hash tidak dapat diverifikasi nanti.
- Utamakan pengaturan memori dan iterasi tertinggi yang tetap menjaga latensi masuk tetap dapat diterima bagi pengguna nyata.
