## Apa itu RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) adalah fungsi hash kriptografi yang menghasilkan nilai hash 160-bit (20-byte), biasanya ditampilkan sebagai angka heksadesimal 40 karakter. Dikembangkan pada tahun 1996 oleh Hans Dobbertin, Antoon Bosselaers, dan Bart Preneel sebagai bagian dari proyek RACE Eropa.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cukup cepat dihitung untuk input apa pun yang diberikan
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Ukuran output tetap**: Selalu menghasilkan hash 160-bit terlepas dari ukuran input
- **Struktur paralel dua jalur**: Menggunakan dua jalur komputasi paralel untuk keamanan yang ditingkatkan

**Status keamanan:**
✅ **RIPEMD-160 dianggap aman secara kriptografi** tanpa serangan praktis yang diketahui. Memberikan margin keamanan yang baik dan masih direkomendasikan untuk aplikasi kriptografi di mana hash 160-bit sudah cukup.

**Penggunaan umum:**

- Generasi alamat Bitcoin (encoding Base58Check)
- Tanda tangan digital dan sertifikat
- Verifikasi integritas data
- Protokol kriptografi yang memerlukan hash 160-bit
- Alternatif untuk SHA-1 saat diperlukan

**Perbandingan dengan algoritma lain:**

- Lebih aman dari MD5 dan SHA-1
- Output lebih kecil dari SHA-256 (160-bit vs 256-bit)
- Karakteristik kinerja yang baik
- Dipelajari dengan baik dan dipercaya dalam komunitas kriptografi

**Direkomendasikan untuk:**

- Aplikasi yang memerlukan keamanan hash 160-bit
- Operasi kriptografi terkait Bitcoin
- Kompatibilitas sistem lama di mana RIPEMD-160 ditentukan
