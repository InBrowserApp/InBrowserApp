## Apa itu PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) menurunkan kunci kriptografis dari kata sandi dengan salt dan banyak iterasi. Ini memperlambat serangan brute‑force dan menghasilkan kunci yang berbeda saat salt berubah.

**Poin utama:**

- Menggunakan HMAC dengan hash yang dipilih (SHA-1/SHA-256/dll.)
- Lebih banyak iterasi meningkatkan biaya komputasi
- Panjang output dapat dikonfigurasi

**Praktik terbaik:**

- Gunakan salt unik dan acak
- Pilih iterasi lebih tinggi dalam batas performa yang wajar
- Untuk sistem baru, pertimbangkan Argon2 atau scrypt
