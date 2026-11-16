## Apa itu SHA-512/224 (FIPS 180-4)?

SHA-512/224 (FIPS 180-4) adalah fungsi hash kriptografis SHA-2 yang menghasilkan digest 224-bit (28-byte), biasanya ditampilkan sebagai string heksadesimal sepanjang 56 karakter. Fungsi ini didasarkan pada SHA-512 dengan nilai awal yang berbeda dan keluaran yang dipangkas, sehingga menghasilkan digest yang lebih pendek dengan tetap mempertahankan struktur internal SHA-512.

**Karakteristik utama:**

- **Deterministik**: Masukan yang sama selalu menghasilkan hash yang sama
- **Perhitungan cepat**: Dapat dihitung dengan cepat untuk masukan apa pun
- **Efek avalanche**: Perubahan kecil pada masukan menghasilkan keluaran yang sangat berbeda
- **Tidak dapat dibalik**: Membalik hash untuk menemukan masukan aslinya tidak dapat dilakukan dengan sumber daya komputasi yang wajar
- **Tahan kolisi**: Sangat sulit menemukan dua masukan berbeda yang menghasilkan hash yang sama

**Penggunaan umum:**

- Tanda tangan dan sertifikat digital
- Pemeriksaan integritas dan checksum
- Konstruksi HMAC
- Verifikasi file dan alur pemrosesan data
- Protokol yang memerlukan hash 224-bit
