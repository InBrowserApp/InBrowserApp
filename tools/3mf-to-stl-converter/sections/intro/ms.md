## Tukar fail 3MF kepada STL

Pilih **Buka fail** atau seret dan lepaskan fail `.3mf` ke penukar. Penukar membaca model pada peranti anda dan menghasilkan STL binari. Pilih **Cuba contoh** untuk membuka model cetakan dengan dua pendakap berwarna, kemudian pilih **Muat turun STL** untuk menyimpan hasilnya.

## Kekalkan saiz dan kedudukan cetakan

Penukar menghasilkan koordinat jejaring dalam milimeter. Komponen pada plat cetakan kekal pada kedudukan relatif asal, termasuk komponen yang diulang. Jika lebar komponen dalam 3MF ialah satu inci, lebarnya menjadi 25.4 unit koordinat dalam STL. Pilih milimeter apabila perisian meminta unit semasa mengimport STL.

## Semak kandungan fail STL

Penukar membaca jejaring segi tiga yang disimpan dalam fail 3MF. Jika model bergantung pada kekisi rasuk (beam lattice) atau sambungan geometri lain, eksport jejaring segi tiga daripada aplikasi sumber terlebih dahulu. STL mengandungi segi tiga permukaan. Simpan fail 3MF asal jika anda memerlukan warna, bahan atau tetapan penghiris. Buka hasil dalam [Pemapar STL](../stl-viewer/) atau periksa sumber dalam [Pemapar 3MF](../3mf-viewer/). Gunakan [Penukar STL kepada 3MF](../stl-to-3mf-converter/) jika langkah seterusnya memerlukan pakej model 3MF. [Perihal format 3MF](https://3mf.io/resources/faq/)
