## Apa itu SHA-512?

SHA-512 (Secure Hash Algorithm 512-bit) adalah fungsi hash kriptografi yang menghasilkan nilai hash 512-bit (64-byte), biasanya ditampilkan sebagai angka heksadesimal 128 karakter. Ini adalah bagian dari keluarga fungsi hash SHA-2 yang dirancang oleh NSA dan diterbitkan oleh NIST.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cepat dihitung untuk input apa pun
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Tidak dapat dibalik**: Secara komputasi tidak mungkin membalik hash untuk menemukan input asli
- **Tahan collision**: Sangat sulit menemukan dua input berbeda yang menghasilkan hash yang sama

**Penggunaan umum:**

- Tanda tangan digital dan sertifikat
- Blockchain dan cryptocurrency (Bitcoin menggunakan SHA-256, tetapi SHA-512 digunakan dalam sistem lain)
- Penyimpanan kata sandi (dengan salting yang tepat)
- Verifikasi integritas file
- Algoritma proof-of-work
