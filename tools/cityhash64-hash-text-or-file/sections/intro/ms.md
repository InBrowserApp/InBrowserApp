## Apakah CityHash64?

CityHash64 ialah algoritma hash bukan kriptografi pantas daripada Google yang menghasilkan nilai 64-bit (8 bait). Ia berguna apabila anda memerlukan cap jari yang padat dan deterministik untuk teks atau fail, dan kelajuan lebih penting daripada keselamatan kriptografi.

**Ciri-ciri utama:**

- **Pantas dan deterministik**: Input dan seed yang sama sentiasa menghasilkan hash 64-bit yang sama
- **Bukan kriptografi**: Jangan gunakan CityHash64 untuk kata laluan, tandatangan, token, atau semakan integriti kalis usik
- **Menyokong seed**: Biarkan seed kosong untuk CityHash64 standard, atau masukkan seed perpuluhan atau heksadesimal `0x` apabila anda memerlukan ruang hash berseed yang berasingan
- **Pemprosesan setempat**: Teks dan fail dihash dalam penyemak imbas; fail yang dimuat naik tidak dihantar ke pelayan
- **Berbilang pengekodan**: Hasil dipaparkan sebagai nilai heksadesimal, Base64, perpuluhan, dan binari

**Kegunaan biasa:**

- Jadual hash dan struktur data
- Cap jari fail bukan keselamatan
- Deduplikasi dan pengelompokan data
- Kunci cache dan kunci sharding
- Lekapan regresi untuk sistem yang sudah menggunakan CityHash64
- Pengindeksan pangkalan data
