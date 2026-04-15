## Apakah RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) adalah fungsi hash kriptografi yang menghasilkan nilai hash 160-bit (20-byte), biasanya dipaparkan sebagai nombor heksadesimal 40 aksara. Ia dibangunkan pada tahun 1996 oleh Hans Dobbertin, Antoon Bosselaers, dan Bart Preneel sebagai sebahagian daripada projek RACE Eropah.

**Ciri-ciri utama:**

- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama
- **Pengiraan pantas**: Agak pantas dikira untuk sebarang input yang diberikan
- **Kesan runtuhan salji**: Perubahan kecil dalam input menghasilkan output yang sangat berbeza
- **Saiz output tetap**: Sentiasa menghasilkan hash 160-bit tanpa mengira saiz input
- **Struktur selari dua baris**: Menggunakan dua baris pengiraan selari untuk keselamatan yang dipertingkat

**Status keselamatan:**
✅ **RIPEMD-160 dianggap selamat secara kriptografi** tanpa serangan praktikal yang diketahui. Ia memberikan margin keselamatan yang baik dan masih disyorkan untuk aplikasi kriptografi di mana hash 160-bit mencukupi.

**Kegunaan biasa:**

- Penjanaan alamat Bitcoin (pengekodan Base58Check)
- Tandatangan digital dan sijil
- Pengesahan integriti data
- Protokol kriptografi yang memerlukan hash 160-bit
- Alternatif kepada SHA-1 apabila diperlukan

**Perbandingan dengan algoritma lain:**

- Lebih selamat daripada MD5 dan SHA-1
- Output lebih kecil daripada SHA-256 (160-bit vs 256-bit)
- Ciri prestasi yang baik
- Dikaji dengan baik dan dipercayai dalam komuniti kriptografi

**Disyorkan untuk:**

- Aplikasi yang memerlukan keselamatan hash 160-bit
- Operasi kriptografi berkaitan Bitcoin
- Keserasian sistem lama di mana RIPEMD-160 dinyatakan
