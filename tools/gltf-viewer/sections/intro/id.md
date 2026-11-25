## Buka model GLB atau glTF secara online

Pilih **Buka file** atau seret model ke penampil. File `.glb` mengemas adegan glTF dalam wadah biner dan biasanya memuat tekstur serta geometri dalam satu file. File `.gltf` mendeskripsikan adegan dalam JSON dan dapat merujuk ke file pendamping. Jika hasil ekspor menyertakan file seperti `model.bin` dan `albedo.png`, pilih file tersebut bersama `model.gltf`. Penampil membaca file langsung di perangkat Anda.

## Periksa material dan putar animasi

Seret untuk memutar, gulir atau gunakan dua jari untuk memperbesar atau memperkecil, lalu pilih **Tampilkan seluruh model** untuk melihat adegan secara utuh lagi. Aktifkan **Rangka kawat** untuk memeriksa segitiga yang membentuk permukaan model. Jika file memuat klip animasi, pilih klip lalu pilih **Putar animasi**. Pilih **Coba contoh** untuk membuka model contoh beranimasi.

## Buka model dengan file pendamping yang hilang

Jika file merujuk ke buffer atau gambar eksternal, pilih model dan file terkait secara bersamaan. Gunakan nama file aslinya. Jika model menggunakan ekstensi kompresi tekstur yang tidak dapat dibuka oleh penampil, ekspor ulang dengan tekstur PNG atau JPEG. Lihat [spesifikasi glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) untuk mengetahui cara kedua format mengemas data.

## Lihat format file 3D terkait

Gunakan [Penampil OBJ](../obj-viewer/) untuk melihat mesh Wavefront dengan material MTL atau [Penampil STL](../stl-viewer/) untuk memeriksa mesh segitiga sebelum mencetaknya dalam 3D.

- [Penampil 3MF](../3mf-viewer/)

Gunakan [Konverter glTF ke GLB](../gltf-to-glb-converter/) untuk menyematkan buffer dan tekstur yang dirujuk oleh model glTF dalam satu file GLB.
