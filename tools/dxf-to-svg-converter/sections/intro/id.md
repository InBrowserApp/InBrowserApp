## Konversi gambar DXF ke SVG

Pilih **Buka file DXF** atau seret gambar `.dxf` ASCII ke konverter. Gunakan **Coba contoh** untuk membuka gambar braket dengan profil, lubang bor, garis sumbu, dan label. Alat membaca gambar di browser dan menampilkan pratinjau vektor. Pilih **Unduh SVG** untuk menyimpan geometri ruang model yang dipilih sebagai file SVG mandiri.

## Pilih lapisan yang akan diekspor

Pilih lapisan yang diinginkan di **Lapisan**. Pratinjau diperbarui saat Anda memilih atau membatalkan pilihan suatu lapisan. Misalnya, ekspor garis luar dan lubang untuk membuat ilustrasi, atau sertakan garis sumbu dan label untuk tampilan dengan anotasi. SVG menyimpan lapisan yang dipilih sebagai grup vektor terpisah.

## Pertahankan skala gambar

Jika DXF menetapkan satuan panjang seperti milimeter atau inci, SVG mencatat dimensi fisik dalam milimeter. Geometri gambar mempertahankan skala aslinya di dalam file. Untuk gambar DXF tanpa satuan, atribut viewBox SVG menggunakan koordinat gambar. Pratinjau menyesuaikan diri dengan ruang yang tersedia di layar. [Variabel header DXF](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Ekspor geometri ruang model

Konverter mengekspor garis, garis bersambung (polyline), busur, lingkaran, blok, dan teks yang didukung. Kurva digambar dengan segmen vektor, sementara teks yang didukung diubah menjadi kontur vektor menggunakan font yang tersedia. Uraikan array blok yang tersusun dalam baris dan kolom menjadi referensi blok terpisah di aplikasi CAD sebelum menyimpan DXF. Untuk gambar di lembar tata letak, pindahkan geometri ke ruang model sebelum mengekspor DXF. Untuk memeriksa gambar, geser, perbesar atau perkecil tampilan, dan tampilkan atau sembunyikan lapisan di [Penampil DXF](../dxf-viewer/).
