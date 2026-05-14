## Fungsi alat ini

Ekstraktor Palet Gambar menemukan warna dominan dalam gambar langsung di
browser Anda. Alat ini menyampel gambar, mengelompokkan piksel yang
secara visual mirip, lalu menghasilkan palet praktis dengan nilai HEX, RGB,
HSL, dan persentase untuk setiap warna.

## Kasus penggunaan yang baik

- Mengambil warna merek atau produk dari tangkapan layar, logo, foto, atau mockup.
- Membuat palet CSS cepat untuk landing page, thumbnail, atau serah terima desain.
- Membandingkan seberapa besar sebuah gambar dipengaruhi oleh satu warna dominan
  dibandingkan aksen pendukung.
- Bekerja dengan gambar pribadi tanpa mengirim file ke server.

## Opsi ekspor

Hasil dapat disalin sebagai daftar HEX biasa, properti kustom CSS, atau JSON.
Format CSS berguna saat Anda menginginkan variabel seperti `--palette-1`,
sedangkan JSON menyimpan format warna dan rasio dominasi bersama untuk skrip
atau otomasi desain.

## Hal yang perlu diperhatikan

- Ekstraksi palet bersifat perkiraan. Tujuannya adalah menghasilkan kelompok
  visual yang berguna, bukan inventaris lengkap setiap warna piksel.
- Piksel transparan diabaikan secara default agar ikon dan cutout tidak
  mengubah palet secara berlebihan; matikan opsi itu saat transparansi itu
  sendiri merupakan bagian dari karya.
- Pengaturan kualitas akurat menyampel lebih banyak piksel dan bisa
  lebih lambat pada gambar yang sangat besar.
