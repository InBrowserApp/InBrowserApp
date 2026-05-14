## Apa itu RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) adalah fungsi hash kriptografis yang menghasilkan nilai hash 320-bit (40-byte), biasanya ditampilkan sebagai angka heksadesimal 80 karakter. RIPEMD-320 adalah bagian dari keluarga RIPEMD yang dikembangkan di Eropa sebagai alternatif untuk MD4/MD5.

Gunakan alat ini saat Anda perlu menghitung digest RIPEMD-320 untuk teks yang ditempel, data konfigurasi yang disalin, atau file lokal. Perhitungan berjalan di browser Anda, sehingga konten file tidak perlu diunggah ke server.

**Karakteristik utama:**

- **Deterministik**: Input yang sama selalu menghasilkan hash yang sama
- **Komputasi cepat**: Cepat dihitung untuk input tertentu
- **Efek avalanche**: Perubahan kecil pada input menghasilkan output yang sangat berbeda
- **Ukuran output tetap**: Selalu menghasilkan hash 320-bit, berapa pun ukuran inputnya
- **Satu arah**: Secara komputasi tidak layak untuk memulihkan input asli dari hash

**Penggunaan umum:**

- Pemeriksaan integritas data
- Fingerprinting dan deduplikasi
- Kompatibilitas sistem lama

**Catatan keamanan:**

RIPEMD-320 terutama berguna ketika protokol, arsip, daftar checksum, atau sistem lama sudah menentukannya. Untuk rancangan baru yang sensitif terhadap keamanan, pilih hash yang saat ini distandardisasi seperti SHA-256, SHA-512, SHA-3, atau BLAKE3 kecuali kompatibilitas RIPEMD diperlukan.
