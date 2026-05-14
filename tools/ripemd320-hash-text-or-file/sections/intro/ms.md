## Apakah RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) ialah fungsi hash kriptografi yang menghasilkan nilai hash 320-bit (40-bait), biasanya dipaparkan sebagai nombor heksadesimal 80 aksara. Ia merupakan sebahagian daripada keluarga RIPEMD yang dibangunkan di Eropah sebagai alternatif kepada MD4/MD5.

Gunakan alat ini apabila anda perlu mengira ringkasan RIPEMD-320 untuk teks yang ditampal, data konfigurasi yang disalin, atau fail setempat. Pengiraan dijalankan dalam pelayar anda, jadi kandungan fail tidak perlu dimuat naik ke pelayan.

**Ciri-ciri utama:**

- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama
- **Pengiraan pantas**: Pantas dikira untuk sebarang input yang diberikan
- **Kesan runtuhan salji**: Perubahan kecil dalam input menghasilkan output yang sangat berbeza
- **Saiz output tetap**: Sentiasa menghasilkan hash 320-bit tanpa mengira saiz input
- **Sehala**: Mendapatkan kembali input asal daripada hash adalah tidak praktikal secara pengiraan

**Kegunaan biasa:**

- Pemeriksaan integriti data
- Cap jari dan penyahpenduaan
- Keserasian sistem lama

**Nota keselamatan:**

RIPEMD-320 paling berguna apabila protokol, arkib, senarai jumlah semak, atau sistem lama sudah menetapkannya. Untuk reka bentuk baharu yang sensitif terhadap keselamatan, utamakan hash yang kini distandardkan seperti SHA-256, SHA-512, SHA-3, atau BLAKE3 melainkan keserasian RIPEMD diperlukan.
