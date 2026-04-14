## Apa itu SHA-1?

SHA-1 (Secure Hash Algorithm 1) adalah fungsi hash kriptografi yang menghasilkan nilai hash 160-bit (20-byte), biasanya ditampilkan sebagai angka heksadesimal 40 karakter. Dirancang oleh NSA dan diterbitkan oleh NIST pada tahun 1995 sebagai bagian dari Digital Signature Standard.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cepat dihitung untuk input apa pun
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Tidak dapat dibalik**: Secara komputasi tidak mungkin membalik hash untuk menemukan input asli
- **Rentan collision**: Kerentanan yang diketahui memungkinkan untuk menemukan collision

**Status keamanan:**
⚠️ **SHA-1 telah rusak secara kriptografi dan tidak boleh digunakan untuk aplikasi yang kritis keamanan**. Serangan teoretis didemonstrasikan pada tahun 2005, dan serangan collision praktis dicapai pada tahun 2017.

**Penggunaan umum (historis):**

- Tanda tangan digital dan sertifikat (deprecated)
- Sistem kontrol versi Git (untuk kompatibilitas)
- Sistem lama yang memerlukan SHA-1
- Verifikasi integritas file (tidak kritis keamanan)
- Algoritma proof-of-work (beberapa cryptocurrency lama)

**Alternatif yang direkomendasikan:**

- SHA-256 atau SHA-3 untuk aplikasi baru
- SHA-512 untuk persyaratan keamanan tinggi
