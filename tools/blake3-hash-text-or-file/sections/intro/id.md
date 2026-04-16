## Apa itu BLAKE3?

BLAKE3 adalah fungsi hash kriptografi modern yang diturunkan dari BLAKE2. Dirancang untuk performa sangat tinggi dan paralelisme sambil mempertahankan keamanan yang kuat. Ini menghasilkan hash 256-bit secara default dan mendukung panjang output yang dapat diperluas (XOF).

**Karakteristik utama:**

- **Panjang output yang dapat diperluas**: Dapat menghasilkan hash dengan panjang apa pun
- **Performa tinggi**: Cepat dan dapat diparalelkan pada CPU modern
- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Tidak dapat dibalik**: Secara komputasi tidak mungkin membalik hash untuk menemukan input asli
- **Tahan collision**: Sangat sulit menemukan dua input berbeda yang menghasilkan hash yang sama
- **Hash berkunci**: Mendukung kunci opsional 32 byte untuk fungsionalitas MAC
- **Derivasi kunci**: Dapat menurunkan subkunci dari material kunci dan konteks

**Penggunaan umum:**

- Verifikasi integritas file
- Penyimpanan beralamat konten dan deduplikasi
- Tanda tangan digital dan sertifikat
- Penyimpanan dan otentikasi kata sandi
- Protokol dan sistem kriptografi
