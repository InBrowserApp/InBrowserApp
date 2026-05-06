## Apa itu RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) adalah fungsi hash kriptografi yang menghasilkan nilai hash 128-bit (16-byte), biasanya ditampilkan sebagai angka heksadesimal 32 karakter. Ini adalah bagian dari keluarga RIPEMD yang dikembangkan di Eropa sebagai alternatif untuk MD4/MD5.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cepat dihitung untuk input apa pun
- **Efek longsor**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Ukuran output tetap**: Selalu menghasilkan hash 128-bit terlepas dari ukuran input
- **Satu arah**: Memulihkan input asli dari hash tidak praktis secara komputasi

**Penggunaan umum:**

- Pemeriksaan integritas data
- Fingerprinting dan deduplikasi
- Kompatibilitas sistem lama
