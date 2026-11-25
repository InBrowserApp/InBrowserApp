## Buka model GLB atau glTF dalam talian

Pilih **Buka fail** atau seret dan lepaskan model ke pemapar. Fail `.glb` membungkus adegan glTF dalam bekas binari dan lazimnya menyertakan tekstur serta geometri dalam satu fail. Fail `.gltf` menghuraikan adegan dalam JSON dan boleh merujuk kepada fail iringan. Jika hasil eksport mengandungi fail seperti `model.bin` dan `albedo.png`, pilih fail tersebut bersama-sama `model.gltf`. Pemapar membaca fail pada peranti anda.

## Periksa bahan dan mainkan animasi

Seret untuk putar, tatal atau cubit untuk zum, dan pilih **Papar seluruh model** untuk melihat semula keseluruhan adegan. Hidupkan **Rangka dawai** untuk memeriksa segi tiga yang membentuk permukaan model. Jika fail mengandungi klip animasi, pilih klip dan tekan **Mainkan animasi**. Pilih **Cuba contoh** untuk membuka model contoh beranimasi.

## Buka model dengan fail iringan yang tiada

Jika fail merujuk kepada penimbal atau imej luaran, pilih model dan fail yang sepadan sekali gus. Kekalkan nama fail asal. Jika model menggunakan sambungan pemampatan tekstur yang tidak dapat dibuka oleh pemapar, eksport semula dengan tekstur PNG atau JPEG. Rujuk [spesifikasi glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) untuk mengetahui cara kedua-dua format membungkus data.

## Lihat format fail 3D berkaitan

Gunakan [Pemapar OBJ](../obj-viewer/) untuk melihat jejaring Wavefront dengan bahan MTL atau [Pemapar STL](../stl-viewer/) untuk memeriksa jejaring segi tiga sebelum mencetaknya dalam 3D.

- [Pemapar 3MF](../3mf-viewer/)
