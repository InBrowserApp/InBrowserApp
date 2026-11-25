## Konversi file STL ke Wavefront OBJ

Pilih **Buka file** atau seret file `.stl` ke konverter. Alat ini membaca STL ASCII maupun biner dan menyiapkan file `.obj` yang bisa diunduh langsung dari browser. Pilih **Coba contoh** untuk mengonversi model braket pemasangan kecil terlebih dahulu, lalu pilih **Unduh OBJ** untuk menyimpannya.

## Periksa isi file OBJ

Konverter menyimpan segitiga permukaan asli dalam file Wavefront OBJ. Titik-titik sudut dengan posisi yang sama memakai satu indeks titik di OBJ, sehingga mesh lebih mudah diedit. Sumbu koordinat dan skala mesh tetap sama. STL tidak memiliki pengaturan satuan standar. Jika panjang sebuah tepi pada file awal adalah 40 satuan koordinat, panjangnya tetap 40 satuan koordinat di OBJ. Pilih satuan yang sesuai saat mengimpor file ke aplikasi lain.

File hasil unduhan berisi geometri mesh. Pustaka material dan tekstur tidak disertakan karena model permukaan STL standar tidak menyimpan keduanya.

## Lihat hasil atau konversi kembali

Buka file hasil unduhan di [Penampil OBJ](../obj-viewer/) untuk memeriksa hasilnya. Gunakan [Penampil STL](../stl-viewer/) untuk membuka file sumber atau [Konverter OBJ ke STL](../obj-to-stl-converter/) untuk konversi ke arah sebaliknya.
