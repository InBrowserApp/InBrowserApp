## Apakah MurmurHash3 (x86 32-bit)?

MurmurHash3 ialah algoritma hash bukan kriptografi yang sangat pantas yang memberi tumpuan kepada kelajuan dan prestasi sambil mengekalkan sifat pengedaran yang baik. MurmurHash3 x86 32-bit ialah varian 32-bit yang menghasilkan nilai hash 32-bit (4-byte), biasanya dipaparkan sebagai nombor heksadesimal 8 aksara.

**Ciri-ciri utama:**

- **Sangat pantas**: Dioptimumkan untuk kelajuan, jauh lebih pantas daripada fungsi hash kriptografi
- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama
- **Pengedaran baik**: Memberikan pengedaran hash yang sangat baik untuk jadual hash
- **Bukan kriptografi**: Tidak sesuai untuk tujuan keselamatan, direka untuk prestasi
- **Output kecil**: Hash 32-bit memberikan perwakilan padat
- **Dioptimumkan platform**: Menggunakan arahan SIMD apabila tersedia untuk kelajuan maksimum

**Kegunaan biasa:**

- Jadual hash dan struktur data
- Pemeriksaan integriti fail (bukan keselamatan)
- Deduplikasi data
- Checksum untuk penghantaran data
- Aplikasi kritikal prestasi
- Pengindeksan pangkalan data
- Penjanaan kunci cache
