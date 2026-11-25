## Periksa mesh STL atau OBJ secara online

Pilih **Buka file** atau seret model `.stl` atau `.obj` ke alat pemeriksa. Alat membaca mesh di perangkat Anda dan menampilkan luas permukaan, volume tertutup, serta masalah topologi yang ditemukan. Pilih **Coba contoh** untuk memeriksa braket pemasangan dengan mesh tertutup sebelum membuka file sendiri.

## Baca luas permukaan dan volume

Koordinat STL dan OBJ tidak menetapkan satuan fisik yang seragam. Atur **Satuan koordinat** sesuai satuan yang Anda pakai saat mengekspor model. Luas menggunakan satuan persegi dan volume menggunakan satuan kubik. Pemilihan satuan hanya memberi label pada koordinat yang tersimpan tanpa mengubah skalanya. Volume braket contoh adalah 16.016 mm³ jika koordinatnya menggunakan milimeter.

Luas permukaan adalah jumlah luas segitiga pada file masukan, sehingga luas muka duplikat ikut dihitung lagi. Pemeriksa menghitung volume berdasarkan orientasi muka setelah mesh lulus pemeriksaan topologi. Permukaan yang berpotongan dengan dirinya sendiri, selubung yang berorientasi salah, atau selubung yang tumpang tindih masih dapat memengaruhi perkiraan volume. Jika hasilnya penting, bandingkan dengan model solid asli.

## Pahami hasil pemeriksaan topologi

- **Tepi batas** hanya dimiliki oleh satu segitiga. Tepi batas membentuk garis batas terbuka, termasuk di sekeliling lubang.
- **Tepi nonmanifold** dimiliki oleh lebih dari dua segitiga. **Titik sudut nonmanifold** merupakan ujung tepi tersebut atau tempat beberapa kelompok muka yang terpisah bertemu.
- **Orientasi muka yang tidak konsisten** terjadi ketika urutan titik sudut pada dua segitiga mengikuti tepi bersama dengan arah yang sama. Jika orientasi muka yang bertetangga benar, arahnya saling berlawanan pada tepi tersebut.
- **Muka degenerat** memiliki luas nol. **Muka duplikat** mengulang segitiga yang sama.

Pemeriksa menganggap posisi yang persis sama sebagai satu titik sudut. Jumlah selubung dihitung berdasarkan hubungan antarsegitiga melalui tepi yang sama. Jika ada masalah topologi, pemeriksa tetap menampilkan luas permukaan dan jumlah masalahnya. Gunakan jumlah tersebut untuk mengetahui apa yang perlu diperbaiki sebelum menggunakan hasil volume.

## Periksa atau konversi model

Gunakan [Penampil STL](../stl-viewer/) atau [Penampil OBJ](../obj-viewer/) untuk memeriksa model dalam 3D, termasuk melihat rangka kawatnya. Gunakan [Konverter OBJ ke STL](../obj-to-stl-converter/) jika alat berikutnya dalam alur kerja Anda memerlukan file STL.
