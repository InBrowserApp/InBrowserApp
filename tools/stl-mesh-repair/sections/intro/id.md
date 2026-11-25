## Perbaiki file STL secara online

Pilih **Buka file** atau seret file `.stl` ASCII atau biner ke alat ini. Perbaikan berlangsung di perangkat Anda. Pilih **Coba contoh** untuk melihat mesh kecil dengan muka duplikat, muka berluas nol, dan muka yang terbalik. Bandingkan hasilnya, lalu pilih **Unduh STL** untuk menyimpan file biner baru dengan ukuran dan koordinat asli.

## Apa yang berubah saat mesh diperbaiki

Alat ini menghapus segitiga yang sama persis dan segitiga berluas nol. Alat membandingkan orientasi muka yang bertetangga. Jika salah satu dari dua orientasi yang konsisten dapat dicapai dengan membalik lebih sedikit muka, alat memilih orientasi itu. Titik-titik pada mesh tetap berada di posisi semula. Batas terbuka, muka dengan orientasi yang tidak dapat ditentukan, dan sambungan nonmanifold mungkin perlu diperbaiki secara manual. Lubang, titik yang hampir berimpit, dan perpotongan dibiarkan seperti semula. [Masalah mesh yang umum pada pencetakan 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Bandingkan topologi sebelum dan sesudah

Periksa jumlah segitiga, muka duplikat, dan muka degenerat. Laporan ini juga menunjukkan tepi dengan orientasi muka tidak konsisten, batas terbuka, serta tepi dan titik sudut nonmanifold yang tersisa. Buka file hasil unduhan di [Penampil STL](../stl-viewer/) untuk memeriksanya dalam 3D. Untuk melihat luas permukaan atau volume tertutup, gunakan [Pemeriksa Volume dan Topologi Mesh](../mesh-inspector/). Anda juga dapat memilih **Perbaiki STL** langsung dari laporan pemeriksaan STL yang memiliki masalah topologi.
