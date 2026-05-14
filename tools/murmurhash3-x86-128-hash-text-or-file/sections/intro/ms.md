## Apakah MurmurHash3 (x86 128-bit)?

MurmurHash3 ialah algoritma hash bukan kriptografi yang pantas, direka untuk
checksum yang boleh diulang dan mempunyai taburan yang sekata. Varian x86
128-bit mengembalikan nilai 16 bait, biasanya dipaparkan sebagai 32 aksara
heksadesimal, menjadikannya lebih sesuai berbanding hash 32-bit apabila anda
memerlukan pengecam yang lebih luas untuk set rekod, fail, atau kunci cache
yang besar.

**Di mana ia berguna:**

- **Jadual hash dan sharding**: Cipta kunci stabil untuk bucket, shard, atau
  jadual carian.
- **Penyahgandaan**: Bandingkan set teks atau fail yang besar dengan cap jari
  128-bit yang padat sebelum melakukan semakan lebih mendalam.
- **Kunci cache**: Hasilkan pengecam deterministik untuk artifak binaan, data
  yang diubah, atau kandungan yang dijana.
- **Semakan integriti bukan keselamatan**: Kesan perubahan tidak sengaja semasa
  penyimpanan atau pemindahan apabila jaminan kriptografi tidak diperlukan.

**Tingkah laku seed:**

Seed pilihan ialah nilai tidak bertanda 32-bit. Gunakan seed yang sama apabila
anda perlu memadankan hasil dengan sistem lain, dan biarkan pada `0` apabila
anda tidak mempunyai keperluan keserasian tertentu. Nilai perpuluhan dan nilai
heksadesimal `0x` diterima; nilai yang lebih besar akan membalut ke julat
32-bit yang sama seperti yang digunakan oleh algoritma.

**Nota keselamatan:**

MurmurHash3 bukan algoritma untuk hashing kata laluan, penandatanganan, atau
pengesahan kalis usik. Gunakan SHA-256, HMAC, atau alat hashing kata laluan
apabila output memerlukan ciri keselamatan. Alat ini paling sesuai untuk
hashing tempatan, luar talian, dan berorientasikan prestasi, apabila kelajuan
serta taburan yang stabil lebih penting daripada rintangan terhadap serangan.
