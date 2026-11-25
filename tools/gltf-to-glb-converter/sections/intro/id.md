## Konversi model glTF menjadi satu file GLB

Gunakan **Buka file** untuk memilih model `.gltf` beserta buffer `.bin` dan teksturnya. Jika tekstur berada dalam subfolder, gunakan **Buka folder** agar konverter bisa mengikuti jalur file dalam model. Konverter juga menerima file glTF yang datanya sudah disematkan. Pilih **Coba contoh** untuk mengemas piramida beranimasi, lalu pilih **Unduh GLB**. File diproses di browser Anda.

## Tambahkan buffer atau tekstur yang belum ditemukan

File JSON `.gltf` dapat merujuk ke aset seperti `model.bin` atau `textures/albedo.png`. Konverter menampilkan jalur file yang belum ditemukan. Pilih **Tambahkan file** untuk menyertakan aset yang diperlukan tanpa menutup model. Pertahankan nama file aslinya. Jika ada file dengan nama yang sama di folder berbeda, pilih folder yang memuat model dan file yang dirujuk agar jalurnya dapat dibaca.

## Bagikan dan periksa GLB

GLB menyematkan geometri, tekstur yang didukung, dan data standar lain yang dirujuk oleh model. Mesh, material, dan klip animasi ikut disertakan. Pengemasan mempertahankan pengodean tekstur dan kompresi mesh aslinya, sehingga aplikasi tujuan harus mendukung format tersebut. Tekstur PNG dan JPEG kompatibel dengan paling banyak aplikasi glTF. Cukup buka file unduhan di [Penampil GLB / glTF](../gltf-viewer/) untuk memeriksa dimensi, material, dan animasi. [Format file glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
