## Apakah xxHash (XXH3 64)?

XXH3 ialah algoritma xxHash moden yang direka untuk kelajuan sangat tinggi dan taburan yang sangat baik. XXH3 64 menghasilkan nilai hash 64-bit (8-bait), biasanya dipaparkan sebagai rentetan heksadesimal 16 aksara. Ia merupakan hash bukan kriptografi dan menyokong nilai benih pilihan untuk menghasilkan hash yang boleh diulang.

**Ciri utama:**

- **Sangat pantas**: Dioptimumkan untuk prestasi pada input besar
- **Deterministik**: Input dan nilai benih yang sama sentiasa menghasilkan hash yang sama
- **Bukan kriptografi**: Tidak sesuai untuk tujuan keselamatan
- **Taburan yang baik**: Sangat sesuai untuk jadual hash dan pengindeksan
- **Berbenih**: Nilai benih pilihan untuk mempelbagaikan output hash

**Kegunaan lazim:**

- Jadual hash dan struktur data
- Semakan integriti fail (bukan untuk keselamatan)
- Penyahduaan dan pembahagian data kepada cebisan
- Kunci cache dan pengindeksan pangkalan data
- Saluran pemprosesan data berdaya pemprosesan tinggi
