## Cara memeriksa berkas GeoJSON

Buka berkas .geojson atau .json, atau tempel dokumen GeoJSON lalu pilih **Validasi GeoJSON**. Pilih **Coba contoh** untuk melihat FeatureCollection yang valid. Anda dapat menyunting masukan dan memeriksanya kembali. Berkas dan teks yang ditempel tetap berada di browser.

## Apa yang diperiksa validator?

Alat ini memeriksa sintaks JSON terlebih dahulu, lalu struktur GeoJSON, termasuk FeatureCollection, Feature, GeometryCollection, dan setiap jenis geometri. Posisi memakai koordinat WGS 84 dengan urutan bujur lalu lintang. Validator memeriksa rentang koordinat, jumlah posisi minimum pada garis dan cincin, apakah cincin tertutup, properti fitur, serta struktur kotak pembatas. Koleksi fitur kosong dan geometri fitur bernilai null tetap valid.

## Temukan dan perbaiki masalah

Jalur kesalahan seperti `$.features[0].geometry.coordinates` menunjuk ke koordinat fitur pertama. Perbaiki kolom yang ditunjukkan, lalu validasi kembali. Hasilnya menjelaskan struktur berkas. Topologi geometri, seperti perpotongan dengan dirinya sendiri atau tumpang tindih, diperiksa secara terpisah dengan alat GIS. Untuk melihat hasil yang valid pada peta, buka di [Penampil GeoJSON](../geojson-viewer/).
