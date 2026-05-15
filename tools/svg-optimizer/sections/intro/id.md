## Apa yang dilakukan alat ini

SVG optimizer ini mengompresi satu file SVG lokal atau dokumen SVG yang
ditempel di browser Anda. Alat ini menggunakan pass pembersihan SVGO untuk
menghapus komentar, metadata, atribut redundan, presisi yang tidak perlu, dan
markup lain yang tidak mengubah gambar yang terlihat.

## Mengapa ini membantu

File SVG yang diekspor dari alat desain sering berisi metadata editor, path yang
bertele-tele, ID yang tidak digunakan, dan komentar. Mengoptimalkannya dapat
mengurangi ukuran unduhan, mempercepat pemuatan halaman, dan membuat kode SVG
inline lebih mudah ditinjau sebelum dikirim dalam situs web, aplikasi, email,
atau halaman dokumentasi.

## Cara kerjanya

Unggah file `.svg` atau tempel markup SVG, pilih preset aman atau sesuaikan pass
SVGO individual, lalu jalankan optimasi. Alat ini menampilkan pratinjau asli dan
yang dioptimalkan, penghematan byte, serta markup akhir agar Anda dapat
menyalinnya atau mengunduh file `.optimized.svg`. SVG tidak perlu meninggalkan
perangkat Anda.

## Catatan praktis

- Pertahankan preset aman saat SVG bergantung pada CSS eksternal, ID berskrip,
  atau referensi simbol yang tidak mudah Anda periksa.
- Gunakan preset agresif untuk ikon, logo, dan ilustrasi ekspor sederhana ketika
  penghapusan dimensi dan inlining style dapat diterima.
- Pratinjau gambar yang dioptimalkan sebelum mengganti artwork sumber, terutama
  saat sumber menggunakan mask, gradien, filter, atau aset tertaut.
