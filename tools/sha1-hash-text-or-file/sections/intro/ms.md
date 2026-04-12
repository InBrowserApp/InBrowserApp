## Apakah SHA-1?

SHA-1 (Secure Hash Algorithm 1) adalah fungsi hash kriptografi yang menghasilkan nilai hash 160-bit (20-byte), biasanya dipaparkan sebagai nombor heksadesimal 40 aksara. Ia direka oleh NSA dan diterbitkan oleh NIST pada tahun 1995 sebagai sebahagian daripada Piawaian Tandatangan Digital.

**Ciri-ciri utama:**

- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama
- **Pengiraan pantas**: Pantas dikira untuk sebarang input yang diberikan
- **Kesan runtuhan salji**: Perubahan kecil dalam input menghasilkan output yang sangat berbeza
- **Tidak boleh dibalik**: Mustahil secara pengiraan untuk membalikkan hash untuk mencari input asal
- **Terdedah kepada perlanggaran**: Kelemahan yang diketahui membolehkan pencarian perlanggaran

**Status keselamatan:**
⚠️ **SHA-1 telah rosak secara kriptografi dan tidak sepatutnya digunakan untuk aplikasi kritikal keselamatan**. Serangan teori telah ditunjukkan pada tahun 2005, dan serangan perlanggaran praktikal dicapai pada tahun 2017.

**Kegunaan biasa (sejarah):**

- Tandatangan digital dan sijil (terkini)
- Sistem kawalan versi Git (untuk keserasian)
- Sistem lama yang memerlukan SHA-1
- Pengesahan integriti fail (tidak kritikal keselamatan)
- Algoritma bukti kerja (beberapa mata wang kripto lama)

**Alternatif yang disyorkan:**

- SHA-256 atau SHA-3 untuk aplikasi baharu
- SHA-512 untuk keperluan keselamatan tinggi
