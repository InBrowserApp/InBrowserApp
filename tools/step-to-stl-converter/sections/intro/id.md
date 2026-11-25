## Konversi file STEP atau STP ke STL

Pilih **Buka file** atau seret file `.step` atau `.stp` ke konverter. Alat ini membagi permukaan CAD menjadi segitiga langsung di perangkat Anda dan menyiapkan file STL biner untuk diunduh. Pilih **Coba contoh** untuk mengonversi braket pemasangan, lalu pilih **Unduh STL** untuk menyimpan hasilnya.

## Pertahankan ukuran yang benar untuk pencetakan 3D

STEP menyimpan dimensi fisik. Konverter mengekspor koordinat dalam milimeter, termasuk posisi setiap komponen dalam rakitan. STL tidak memiliki pengaturan satuan bawaan. Pilih milimeter saat membuka hasilnya di aplikasi slicer. Misalnya, tepi yang panjangnya satu inci di STEP akan memiliki panjang 25,4 satuan koordinat di STL.

## Periksa mesh hasil ekspor

File STL memuat permukaan segitiga dari setiap komponen pada posisinya dalam rakitan. Gunakan STEP jika Anda perlu mengedit permukaan CAD atau mempertahankan nama komponen dan struktur rakitan. Buka STL di [Penampil STL](../stl-viewer/) atau periksa volume tertutup dan topologinya dengan [Pemeriksa Volume dan Topologi Mesh](../mesh-inspector/).

## Periksa atau ekspor model asli

Gunakan [Penampil STEP](../step-viewer/) untuk memeriksa dimensi, memutar model CAD, dan mengekspor STL langsung dari bilah alat. Jika aplikasi slicer Anda mendukung STEP, buka file asli dan pilih pengaturan mesh di aplikasi tersebut. [Format yang didukung PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
