## Konversi file STL ke 3MF

Pilih **Satuan koordinat STL**, lalu pilih **Buka file** atau seret file `.stl` ke konverter. STL ASCII dan biner sama-sama didukung. Pilih **Coba contoh** untuk mengonversi braket pemasangan dan **Unduh 3MF** untuk menyimpan model. Saat satuan berubah, konverter mengonversi ulang file yang sedang dibuka.

## Pilih ukuran yang benar untuk aplikasi slicer

STL menyimpan koordinat tanpa menetapkan satuannya. Pilih satuan yang digunakan oleh model sumber. Misalnya, komponen selebar 2 satuan koordinat STL akan berukuran 2 inci jika Anda memilih inci atau 2 milimeter jika Anda memilih milimeter. File 3MF mencatat satuan ini agar aplikasi slicer yang kompatibel dapat membaca model dengan ukuran yang diinginkan.

## Periksa model 3MF atau konversi kembali

File 3MF mempertahankan segitiga asli. Konverter mencatat model sebagai benda padat jika mesh menutup sebuah volume dengan orientasi muka yang konsisten. Mesh terbuka atau dengan orientasi muka yang tidak konsisten dicatat sebagai permukaan. Pilih material dan sesuaikan pengaturan cetak di aplikasi slicer. Buka file di [Penampil 3MF](../3mf-viewer/) untuk memeriksa dimensi, atau lihat file aslinya di [Penampil STL](../stl-viewer/). Gunakan [Pemeriksa Volume dan Topologi Mesh](../mesh-inspector/) jika mesh sumber memiliki celah atau masalah topologi lain. Untuk konversi sebaliknya, gunakan [Konverter 3MF ke STL](../3mf-to-stl-converter/). [Tentang format 3MF](https://3mf.io/resources/faq/)
