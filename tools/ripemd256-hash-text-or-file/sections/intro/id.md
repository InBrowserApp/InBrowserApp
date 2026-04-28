## Apa itu RIPEMD-256?

RIPEMD-256 (RACE Integrity Primitives Evaluation Message Digest) adalah fungsi hash kriptografi yang menghasilkan nilai hash 256-bit (32-byte), biasanya ditampilkan sebagai angka heksadesimal 64 karakter. Ini adalah bagian dari keluarga RIPEMD yang dikembangkan di Eropa sebagai alternatif untuk MD4/MD5.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cepat dihitung untuk input apa pun
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Ukuran output tetap**: Selalu menghasilkan hash 256-bit terlepas dari ukuran input
- **Satu arah**: Memulihkan input asli dari hash tidak praktis secara komputasi

**Penggunaan umum:**

- Pemeriksaan integritas data
- Fingerprinting dan deduplikasi
- Kompatibilitas sistem lama
