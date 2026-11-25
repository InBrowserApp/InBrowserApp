## Cara menukar GPX kepada GeoJSON

Buka fail .gpx atau tampal XML GPX dan pilih **Tukar kepada GeoJSON**. Pilih **Cuba contoh** untuk melihat trek, laluan dan titik laluan dalam hasilnya. Salin GeoJSON atau muat turun fail .geojson untuk projek pemetaan atau GIS anda. Penukaran berjalan dalam pelayar dan input kekal pada peranti anda.

## Cara trek, laluan dan titik laluan ditukar

Hasilnya ialah FeatureCollection GeoJSON. Titik laluan menjadi titik dan laluan menjadi garisan. Jika trek terdiri daripada beberapa segmen, setiap segmen kekal berasingan. Segmen atau laluan dengan satu kedudukan sahaja menjadi titik. Medan penerangan seperti nama dan nota kekal bersama ciri masing-masing.

## Koordinat, ketinggian dan masa

GeoJSON menyimpan kedudukan dengan longitud dahulu, diikuti latitud. Garisan yang melintasi antimeridian dipecahkan pada longitud 180° untuk dipaparkan pada peta dunia. Jika ketinggian tersedia, nilainya menjadi koordinat ketiga dalam meter. Masa bagi titik disimpan dalam sifat ciri. Masa sepanjang laluan dan segmen trek mengikut urutan koordinat supaya dapat dipadankan dengan kedudukan. Anda boleh membuka hasil dalam [Pemapar GeoJSON](../geojson-viewer/) atau meneroka GPX asal dalam [Pemapar GPX dan Profil Ketinggian](../gpx-viewer/).
