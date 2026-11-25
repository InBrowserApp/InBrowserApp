## Konversi file Wavefront OBJ ke STL

Pilih **Buka file** atau seret file `.obj` ke konverter. Pilih **Coba contoh** untuk mengonversi model braket pemasangan kecil terlebih dahulu. Alat ini membagi bidang poligon menjadi segitiga. Lalu, pilih **Unduh STL** untuk menyimpan file `.stl` biner. Konversi berlangsung di perangkat Anda.

## Perubahan saat mengekspor STL

STL menyimpan permukaan dalam bentuk segitiga. Material, gambar tekstur, koordinat UV, serta garis dan titik lepas tidak disertakan dalam STL. Koordinat dan sumbu asli tetap sama. Sebelum mencetak, pilih satuan yang sesuai di aplikasi slicer. Misalnya, bentang 40 satuan koordinat pada OBJ tetap menjadi 40 satuan koordinat pada STL.

Konversi bisa berhasil meskipun mesh berlubang atau memiliki masalah geometri lain. Periksa hasilnya di aplikasi slicer sebelum mencetak.

## Lihat hasil atau konversi kembali

Gunakan [Penampil STL](../stl-viewer/) untuk membuka file hasil unduhan atau [Penampil OBJ](../obj-viewer/) untuk memeriksa file asli, termasuk material yang Anda sertakan. Gunakan [Konverter STL ke OBJ](../stl-to-obj-converter/) untuk konversi ke arah sebaliknya.
