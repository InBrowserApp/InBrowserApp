## Apa itu MD5?

MD5 (Message Digest Algorithm 5) adalah fungsi hash kriptografi yang banyak digunakan yang menghasilkan nilai hash 128-bit (16-byte), biasanya ditampilkan sebagai angka heksadesimal 32 karakter. Dirancang oleh Ron Rivest pada tahun 1991 sebagai penerus MD4.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cepat dihitung untuk input apa pun
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Ukuran output tetap**: Selalu menghasilkan hash 128-bit terlepas dari ukuran input
- **Rentan collision**: Kerentanan yang diketahui memungkinkan untuk menemukan collision

**Status keamanan:**
⚠️ **MD5 telah rusak secara kriptografi dan tidak boleh digunakan untuk aplikasi yang kritis keamanan**. Serangan collision didemonstrasikan pada tahun 2004, dan generasi collision praktis menjadi layak dengan kekuatan komputasi modern.

**Penggunaan umum (saat ini dan historis):**

- Verifikasi integritas file (tidak kritis keamanan)
- Checksum untuk deteksi korupsi data
- Sistem lama yang memerlukan MD5
- Generasi kunci database (non-kriptografi)
- Beberapa protokol dan sistem lama

**Alternatif yang direkomendasikan:**

- SHA-256 atau SHA-3 untuk aplikasi baru
- SHA-512 untuk persyaratan keamanan tinggi
- BLAKE2 untuk aplikasi performa tinggi
