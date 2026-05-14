## Apakah scrypt?

scrypt ialah fungsi derivasi kunci berasaskan kata laluan (KDF) yang sukar dari segi memori. Ia menukar kata laluan dan salt kepada bait kunci yang deterministik sambil sengaja menggunakan masa CPU dan memori, yang menjadikan tekaan kata laluan berskala besar lebih mahal berbanding hashing ringkas.

**Perkara utama:**

- Menggunakan `N` (faktor kos), `r` (saiz blok) dan `p` (paralelisme)
- Tetapan `N` dan `r` yang lebih tinggi meningkatkan kos memori dan pengiraan
- Menghasilkan kunci terbitan yang sama hanya apabila kata laluan, salt, parameter dan panjang output sepadan

**Amalan terbaik:**

- Gunakan salt rawak yang unik untuk setiap kata laluan atau rahsia
- Simpan `N`, `r`, `p`, format salt dan panjang output bersama kunci terbitan
- Tala parameter pada peranti paling perlahan yang perlu disokong sebelum menggunakannya dalam pengeluaran
