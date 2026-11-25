## Tukar model glTF kepada satu fail GLB

Gunakan **Buka fail** untuk memilih model `.gltf` bersama-sama penimbal `.bin` dan teksturnya. Jika tekstur berada dalam subfolder, gunakan **Buka folder** supaya penukar dapat mengikuti laluan fail dalam model. Penukar turut menerima fail glTF yang sudah mengandungi data terbenam. Pilih **Cuba contoh** untuk membungkus model piramid beranimasi, kemudian pilih **Muat turun GLB**. Fail diproses dalam pelayar anda.

## Tambah penimbal atau tekstur yang tiada

Fail JSON `.gltf` boleh merujuk kepada aset seperti `model.bin` atau `textures/albedo.png`. Penukar menyenaraikan laluan fail yang tiada. Pilih **Tambah fail** untuk menyertakan aset tersebut sambil mengekalkan model dalam paparan. Kekalkan nama fail asal. Jika ada fail dengan nama yang sama dalam folder berlainan, pilih folder yang mengandungi model dan fail yang dirujuk supaya penukar dapat membaca laluannya.

## Kongsi dan periksa GLB

GLB membenamkan geometri, tekstur yang disokong dan data piawai lain yang dirujuk oleh model. Jejaring, bahan dan klip animasi turut dikekalkan. Pembungkusan mengekalkan pengekodan tekstur dan pemampatan jejaring asal, jadi perisian sasaran perlu menyokong format tersebut. Tekstur PNG dan JPEG serasi dengan paling banyak perisian glTF. Buka fail yang dimuat turun sahaja dalam [Pemapar GLB / glTF](../gltf-viewer/) untuk memeriksa saiz, bahan dan animasinya. [Format fail glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
