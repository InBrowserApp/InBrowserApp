## Apakah PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) menghasilkan kunci kriptografi daripada kata laluan dengan salt dan banyak iterasi. Ia memperlahankan serangan brute‑force dan menghasilkan kunci berbeza apabila salt berubah.

**Perkara utama:**

- Menggunakan HMAC dengan hash terpilih (SHA-1/SHA-256 dll.)
- Lebih banyak iterasi meningkatkan kos pengiraan
- Panjang output boleh dikonfigurasi

**Amalan terbaik:**

- Gunakan salt yang unik dan rawak
- Pilih iterasi lebih tinggi dalam prestasi yang boleh diterima
- Untuk sistem baharu, pertimbangkan Argon2 atau scrypt
