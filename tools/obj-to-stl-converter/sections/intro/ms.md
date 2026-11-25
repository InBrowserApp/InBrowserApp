## Tukar fail Wavefront OBJ kepada STL

Pilih **Buka fail** atau seret dan lepaskan fail `.obj` ke penukar. Pilih **Cuba contoh** untuk menukar model pendakap pemasangan kecil terlebih dahulu. Penukar membahagikan muka poligon kepada segi tiga. Kemudian pilih **Muat turun STL** untuk menyimpan fail `.stl` binari. Penukaran berlaku pada peranti anda.

## Perubahan apabila mengeksport STL

STL menyimpan permukaan dalam bentuk segi tiga. Bahan, imej tekstur, koordinat UV serta garisan dan titik yang berasingan tidak disertakan dalam STL. Penukar mengekalkan paksi dan skala. STL binari menyimpan koordinat sebagai nombor titik apung 32 bit, jadi pembundaran boleh menjejaskan butiran yang sangat kecil pada koordinat yang sangat besar. Sebelum mencetak, pilih unit yang dikehendaki dalam perisian penghiris. Sebagai contoh, ukuran 40 unit koordinat dalam OBJ kekal 40 unit koordinat dalam STL.

Fail boleh berjaya ditukar walaupun jejaring berlubang atau mempunyai masalah geometri lain. Semak hasilnya dalam perisian penghiris sebelum mencetak.

## Lihat hasil atau tukar semula

Gunakan [Pemapar STL](../stl-viewer/) untuk membuka fail yang dimuat turun atau [Pemapar OBJ](../obj-viewer/) untuk memeriksa fail asal bersama-sama bahan yang anda sertakan. Gunakan [Penukar STL kepada OBJ](../stl-to-obj-converter/) untuk menukar dalam arah bertentangan.
