## Apa itu MurmurHash3 (x64 128-bit)?

MurmurHash3 adalah algoritma hash non-kriptografi cepat yang dirancang
untuk checksum yang dapat diulang dan terdistribusi dengan baik. Varian x64
128-bit menghasilkan nilai 16-byte, biasanya ditampilkan sebagai 32 karakter
heksadesimal, sehingga lebih cocok daripada hash 32-bit ketika Anda
membutuhkan pengenal yang lebih lebar untuk kumpulan besar record, file, atau
kunci cache.

**Di mana ini membantu:**

- **Tabel hash dan sharding**: Buat kunci stabil untuk bucket, partisi, atau
  tabel lookup.
- **Deduplikasi**: Bandingkan kumpulan teks atau file besar dengan fingerprint
  128-bit yang ringkas sebelum melakukan pemeriksaan lebih mendalam.
- **Kunci cache**: Hasilkan pengenal deterministik untuk artefak build, data
  yang ditransformasikan, atau konten yang dihasilkan.
- **Pemeriksaan integritas non-keamanan**: Deteksi perubahan tidak disengaja
  selama penyimpanan atau transfer ketika jaminan kriptografi tidak
  diperlukan.

**Perilaku seed:**

Seed opsional adalah nilai unsigned 32-bit. Gunakan seed yang sama ketika Anda
perlu mencocokkan hasil dengan sistem lain, dan biarkan di `0` ketika Anda
tidak memiliki kebutuhan kompatibilitas tertentu. Nilai desimal dan nilai
heksadesimal `0x` diterima; nilai yang lebih besar akan dibungkus ke rentang
32-bit yang sama seperti yang digunakan algoritma.

**Catatan keamanan:**

MurmurHash3 bukan algoritma untuk hashing kata sandi, penandatanganan, atau
verifikasi tahan manipulasi. Gunakan SHA-256, HMAC, atau alat hashing kata sandi
ketika output membutuhkan properti keamanan. Alat ini paling cocok untuk
hashing lokal, offline, dan berorientasi kinerja ketika kecepatan dan distribusi
stabil lebih penting daripada ketahanan terhadap serangan.
