## Tukar fail STEP atau STP kepada STL

Pilih **Buka fail** atau seret dan lepaskan fail `.step` atau `.stp` ke penukar. Penukar membahagikan permukaan CAD kepada segi tiga pada peranti anda dan menyediakan fail STL binari untuk dimuat turun. Pilih **Cuba contoh** untuk menukar model pendakap pemasangan, kemudian pilih **Muat turun STL** untuk menyimpan hasilnya.

## Kekalkan saiz yang betul untuk cetakan 3D

STEP menyimpan dimensi fizikal. Penukar mengeksport koordinat dalam milimeter, termasuk kedudukan setiap komponen dalam model pemasangan. STL tidak mempunyai tetapan unit terbina dalam. Pilih milimeter apabila membuka hasilnya dalam perisian penghiris. Sebagai contoh, tepi yang panjangnya satu inci dalam STEP berukuran 25.4 unit koordinat dalam STL.

## Periksa jejaring yang dieksport

Fail STL mengandungi permukaan yang dibahagikan kepada segi tiga mengikut kedudukan setiap komponen dalam pemasangan. Gunakan STEP jika anda perlu menyunting permukaan CAD atau mengekalkan nama komponen dan struktur pemasangan. Buka STL dalam [Pemapar STL](../stl-viewer/) atau semak isi padu tertutup dan topologinya dengan [Penyemak Isi Padu dan Topologi Jejaring](../mesh-inspector/).

## Periksa atau eksport model asal

Gunakan [Pemapar STEP](../step-viewer/) untuk memeriksa dimensi, memutar model CAD dan mengeksport STL terus daripada bar alat. Jika perisian penghiris anda menyokong STEP, buka fail asal dan pilih tetapan jejaring dalam perisian tersebut. [Format yang disokong oleh PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
