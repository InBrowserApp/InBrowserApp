## Apakah MD5?

MD5 (Message Digest Algorithm 5) adalah fungsi hash kriptografi yang digunakan secara meluas yang menghasilkan nilai hash 128-bit (16-byte), biasanya dipaparkan sebagai nombor heksadesimal 32 aksara. Ia direka oleh Ron Rivest pada tahun 1991 sebagai pengganti kepada MD4.

**Ciri-ciri utama:**

- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama
- **Pengiraan pantas**: Pantas dikira untuk sebarang input yang diberikan
- **Kesan runtuhan salji**: Perubahan kecil dalam input menghasilkan output yang sangat berbeza
- **Saiz output tetap**: Sentiasa menghasilkan hash 128-bit tanpa mengira saiz input
- **Terdedah kepada perlanggaran**: Kelemahan yang diketahui membolehkan pencarian perlanggaran

**Status keselamatan:**
⚠️ **MD5 telah rosak secara kriptografi dan tidak sepatutnya digunakan untuk aplikasi kritikal keselamatan**. Serangan perlanggaran telah ditunjukkan pada tahun 2004, dan penjanaan perlanggaran praktikal menjadi boleh dilaksanakan dengan kuasa pengiraan moden.

**Kegunaan biasa (semasa dan sejarah):**

- Pengesahan integriti fail (tidak kritikal keselamatan)
- Checksum untuk pengesanan rasuah data
- Sistem lama yang memerlukan MD5
- Penjanaan kunci pangkalan data (bukan kriptografi)
- Beberapa protokol dan sistem lama

**Alternatif yang disyorkan:**

- SHA-256 atau SHA-3 untuk aplikasi baharu
- SHA-512 untuk keperluan keselamatan tinggi
- BLAKE2 untuk aplikasi prestasi tinggi
