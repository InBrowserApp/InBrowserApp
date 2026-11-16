## Apakah SHA-512/256 (FIPS 180-4)?

SHA-512/256 (FIPS 180-4) ialah fungsi hash kriptografi SHA-2 yang menghasilkan ringkasan 256-bit (32-bait), biasanya dipaparkan sebagai rentetan heksadesimal 64 aksara. Ia berasaskan SHA-512 dengan nilai awal yang berbeza dan output yang dipendekkan, lalu memberikan ringkasan lebih pendek sambil mengekalkan struktur dalaman SHA-512.

**Ciri utama:**

- **Deterministik**: Input yang sama sentiasa menghasilkan hash yang sama
- **Pengiraan pantas**: Cepat dikira untuk sebarang input yang diberikan
- **Kesan runtuhan**: Perubahan kecil pada input menghasilkan output yang sangat berbeza
- **Tidak boleh diterbalikkan**: Tidak praktikal dari segi pengiraan untuk membalikkan hash bagi mencari input asal
- **Tahan perlanggaran**: Sangat sukar untuk mencari dua input berbeza yang menghasilkan hash yang sama

**Kegunaan lazim:**

- Tandatangan digital dan sijil
- Semakan integriti dan hasil tambah semak
- Pembinaan HMAC
- Pengesahan fail dan saluran pemprosesan data
- Protokol yang memerlukan hash 256-bit
