## Apa itu MurmurHash3 (x86 128-bit)?

MurmurHash3 adalah algoritma hash non-kriptografi cepat yang dirancang untuk
checksum yang dapat diulang dengan distribusi yang merata. Varian x86 128-bit
menghasilkan nilai 16-byte, biasanya ditampilkan sebagai 32 karakter
heksadesimal, sehingga lebih sesuai daripada hash 32-bit ketika Anda
membutuhkan pengenal yang lebih lebar untuk kumpulan besar rekaman, file, atau
kunci cache.

**Di mana ini membantu:**

- **Tabel hash dan sharding**: Buat kunci stabil untuk bucket, partisi, atau
  tabel pencarian.
- **Deduplikasi**: Bandingkan kumpulan teks atau file besar dengan fingerprint
  128-bit yang ringkas sebelum melakukan pemeriksaan lebih mendalam.
- **Kunci cache**: Hasilkan pengenal deterministik untuk artefak build, data
  yang ditransformasikan, atau konten yang dihasilkan.
- **Pemeriksaan integritas non-keamanan**: Deteksi perubahan tidak disengaja
  selama penyimpanan atau transfer ketika jaminan kriptografi tidak
  diperlukan.

**Perilaku seed:**

Seed opsional adalah nilai 32-bit tak bertanda. Gunakan seed yang sama ketika
Anda perlu mencocokkan hasil dengan sistem lain, dan biarkan di `0` ketika Anda
tidak memiliki kebutuhan kompatibilitas tertentu. Nilai desimal dan nilai
heksadesimal berawalan `0x` diterima; nilai yang lebih besar akan dibungkus ke
rentang 32-bit yang sama seperti yang digunakan algoritma.

**Catatan keamanan:**

MurmurHash3 bukan algoritma untuk membuat hash kata sandi, penandatanganan,
atau verifikasi tahan manipulasi. Gunakan SHA-256, HMAC, atau alat hash kata
sandi ketika output membutuhkan properti keamanan. Alat ini paling cocok untuk
pembuatan hash lokal, offline, dan berorientasi kinerja ketika kecepatan dan
distribusi stabil lebih penting daripada ketahanan terhadap serangan.
