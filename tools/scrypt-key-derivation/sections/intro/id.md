## Apa itu scrypt?

scrypt adalah fungsi derivasi kunci berbasis kata sandi (KDF) yang memory-hard. Fungsi ini mengubah kata sandi dan salt menjadi byte kunci deterministik sambil sengaja memakai waktu CPU dan memori, sehingga penebakan kata sandi berskala besar menjadi lebih mahal daripada hashing sederhana.

**Poin utama:**

- Menggunakan `N` (faktor biaya), `r` (ukuran blok), dan `p` (paralelisme)
- Pengaturan `N` dan `r` yang lebih tinggi meningkatkan biaya memori dan komputasi
- Menghasilkan kunci turunan yang sama hanya ketika kata sandi, salt, parameter, dan panjang output cocok

**Praktik terbaik:**

- Gunakan salt acak yang unik untuk setiap kata sandi atau rahasia
- Simpan `N`, `r`, `p`, format salt, dan panjang output di samping kunci turunan
- Sesuaikan parameter pada perangkat paling lambat yang perlu Anda dukung sebelum menggunakannya di produksi
