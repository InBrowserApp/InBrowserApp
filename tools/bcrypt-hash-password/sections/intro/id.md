## Apa itu bcrypt?

bcrypt adalah algoritma hashing password yang dirancang untuk penyimpanan password. bcrypt menggabungkan password dengan salt acak dan mengulangi pekerjaan yang mahal berdasarkan faktor cost, sehingga penyerang perlu lebih banyak waktu untuk menguji setiap tebakan.

## Kapan menggunakan alat ini

- Buat hash bcrypt untuk akun uji, skrip seed, atau lingkungan pengembangan lokal.
- Bandingkan bagaimana faktor cost yang berbeda mengubah format output dan waktu berjalan.
- Buat hash siap disalin tanpa mengirim password ke server.

## Cara memilih faktor cost

Nilai cost yang lebih tinggi lebih lambat dan biasanya lebih aman, tetapi juga membuat setiap percobaan login lebih lambat untuk aplikasi Anda. Cost sekitar 10-12 umum untuk sistem interaktif; nilai yang lebih tinggi bisa masuk akal untuk workflow khusus admin atau bervolume rendah. Uji cost pada jenis hardware yang sama dengan yang akan memverifikasi password.

## Hal yang perlu diingat

- Setiap hash yang dibuat menggunakan salt acak baru, sehingga output berubah meskipun password dan cost tetap sama.
- Simpan hash bcrypt, bukan password asli.
- Gunakan bcrypt untuk password, bukan untuk checksum file, tanda tangan, atau hashing umum.
- Jaga perilaku verifikasi tetap konstan dan hindari mengungkap apakah akun pengguna ada.
