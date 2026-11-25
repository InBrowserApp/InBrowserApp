## Baiki fail STL dalam talian

Pilih **Buka fail** atau seret dan lepaskan fail `.stl` ASCII atau binari ke alat ini. Pembaikan berlaku pada peranti anda. Pilih **Cuba contoh** untuk melihat jejaring kecil dengan muka pendua, muka berluas sifar dan muka terbalik. Bandingkan hasilnya, kemudian pilih **Muat turun STL** untuk menyimpan fail binari baharu dengan saiz dan koordinat asal.

## Perubahan apabila jejaring dibaiki

Alat ini membuang segi tiga yang sama sepenuhnya dan segi tiga berluas sifar. Alat membandingkan orientasi muka bersebelahan. Jika salah satu daripada dua orientasi yang konsisten boleh dicapai dengan menterbalikkan lebih sedikit muka, alat memilih orientasi itu. Titik-titik jejaring kekal pada kedudukan asal. Sempadan terbuka, muka dengan orientasi yang tidak jelas dan sambungan bukan manifold mungkin perlu dibaiki secara manual. Lubang, titik yang hampir bertepatan dan persilangan dikekalkan. [Masalah jejaring yang lazim dalam cetakan 3D](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## Bandingkan topologi sebelum dan selepas pembaikan

Semak bilangan segi tiga, muka pendua dan muka berluas sifar. Laporan turut menunjukkan baki tepi dengan orientasi muka tidak konsisten, sempadan terbuka serta tepi dan bucu bukan manifold. Buka fail yang dimuat turun dalam [Pemapar STL](../stl-viewer/) untuk memeriksanya dalam 3D. Bagi luas permukaan atau isi padu tertutup, gunakan [Penyemak Isi Padu dan Topologi Jejaring](../mesh-inspector/). Anda juga boleh memilih **Baiki STL** terus daripada laporan semakan STL yang menunjukkan masalah topologi.
