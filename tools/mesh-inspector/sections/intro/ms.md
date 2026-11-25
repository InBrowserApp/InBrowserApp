## Semak jejaring STL atau OBJ dalam talian

Pilih **Buka fail** atau seret dan lepaskan model `.stl` atau `.obj` ke alat penyemak. Alat membaca jejaring pada peranti anda dan memaparkan luas permukaan, isi padu tertutup dan masalah topologi. Pilih **Cuba contoh** untuk menyemak pendakap pemasangan dengan jejaring tertutup sebelum membuka fail sendiri.

## Baca luas permukaan dan isi padu

Koordinat STL dan OBJ tidak menetapkan unit ukuran fizikal yang seragam. Tetapkan **Unit koordinat** kepada unit yang digunakan ketika mengeksport model. Luas permukaan menggunakan unit persegi, manakala isi padu menggunakan unit padu. Pemilihan unit hanya melabelkan koordinat yang disimpan tanpa mengubah skalanya. Pendakap contoh mempunyai isi padu 16,016 mm³ jika koordinatnya mewakili milimeter.

Penyemak mengira isi padu berdasarkan orientasi muka apabila jejaring lulus semakan topologi. Permukaan yang bersilang dengan dirinya sendiri dan cangkerang yang berorientasi salah atau bertindih masih boleh menjejaskan anggaran itu. Bandingkan hasil yang penting dengan model pepejal asal.

## Fahami hasil semakan topologi

- **Tepi sempadan** hanya dimiliki oleh satu segi tiga. Tepi sempadan membentuk garis sempadan terbuka, termasuk di sekeliling lubang.
- **Tepi bukan manifold** dimiliki oleh lebih daripada dua segi tiga. Pada **bucu bukan manifold**, kumpulan muka yang terpisah bertemu pada bucu yang sama.
- **Orientasi muka yang tidak konsisten** bermaksud urutan bucu pada dua segi tiga merentasi tepi kongsi dalam arah yang sama. Muka bersebelahan dengan orientasi yang betul merentasi tepi itu dalam arah yang bertentangan.
- **Muka berluas sifar** tidak mempunyai luas. **Muka pendua** mengulangi segi tiga yang sama.

Penyemak mengira kedudukan yang bertepatan sepenuhnya sebagai satu bucu. Cangkerang dikira berdasarkan sambungan antara segi tiga melalui tepi yang dikongsi. Jika ada kecacatan topologi, penyemak masih memaparkan luas permukaan dan bilangan masalah. Gunakan bilangan ini untuk mengenal pasti perkara yang perlu dibaiki sebelum menggunakan nilai isi padu.

## Periksa atau tukar model

Gunakan [Pemapar STL](../stl-viewer/) atau [Pemapar OBJ](../obj-viewer/) untuk memeriksa model dalam 3D, termasuk rangka dawainya. Gunakan [Penukar OBJ kepada STL](../obj-to-stl-converter/) jika alat seterusnya dalam aliran kerja anda memerlukan fail STL.
