## Apakah xxHash (XXH3 128)?

XXH3 ialah algoritma xxHash moden yang direka untuk kelajuan yang sangat tinggi dan taburan yang sangat baik. XXH3 128 menghasilkan nilai hash 128-bit (16 bait), yang biasanya dipaparkan sebagai rentetan perenambelasan 32 aksara. Ia ialah hash bukan kriptografi dan menyokong seed pilihan untuk hashing yang boleh dihasilkan semula.

**Ciri utama:**

- **Sangat pantas**: Dioptimumkan untuk prestasi pada input yang besar
- **Deterministik**: Input dan seed yang sama sentiasa menghasilkan hash yang sama
- **Bukan kriptografi**: Tidak sesuai untuk tujuan keselamatan
- **Taburan yang baik**: Berguna untuk jadual hash dan pengindeksan
- **Dengan seed**: Seed pilihan membantu membezakan output hash

**Kegunaan biasa:**

- Jadual hash dan struktur data
- Pemeriksaan integriti fail (bukan untuk keselamatan)
- Penyahgandaan data dan chunking
- Kunci cache dan pengindeksan pangkalan data
- Saluran paip data berdaya pemprosesan tinggi
