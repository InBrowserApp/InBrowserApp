## Cara menyemak fail GeoJSON

Buka fail .geojson atau .json, atau tampal dokumen GeoJSON dan pilih **Sahkan GeoJSON**. Pilih **Cuba contoh** untuk melihat FeatureCollection yang sah. Anda boleh menyunting input dan menyemaknya semula. Fail dan teks yang ditampal kekal dalam pelayar anda.

## Apakah yang diperiksa oleh pengesah?

Alat ini menyemak sintaks JSON dahulu, kemudian struktur GeoJSON termasuk FeatureCollection, Feature, GeometryCollection dan setiap jenis geometri. Kedudukan menggunakan koordinat WGS 84 dengan longitud dahulu, diikuti latitud. Pengesah menyemak julat koordinat, bilangan kedudukan minimum bagi garisan dan gelang, sama ada gelang tertutup, sifat ciri dan struktur kotak sempadan. Koleksi ciri kosong dan geometri ciri bernilai null adalah sah.

## Cari dan betulkan masalah

Laluan ralat seperti `$.features[0].geometry.coordinates` merujuk kepada koordinat ciri pertama. Betulkan medan yang ditunjukkan, kemudian sahkan semula. Hasil pengesahan menerangkan struktur fail. Topologi geometri, seperti persilangan dengan dirinya sendiri atau pertindihan, perlu disemak secara berasingan dengan alat GIS. Untuk melihat hasil yang sah pada peta, buka dalam [Pemapar GeoJSON](../geojson-viewer/).
