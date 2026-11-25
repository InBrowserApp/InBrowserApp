## Cara mengonversi GPX ke GeoJSON

Buka berkas .gpx atau tempel XML GPX, lalu pilih **Konversi ke GeoJSON**. Pilih **Coba contoh** untuk melihat hasil yang berisi jejak, rute, dan titik penanda. Salin GeoJSON atau unduh berkas .geojson untuk proyek pemetaan atau GIS Anda. Konversi berlangsung di browser dan data masukan tetap berada di perangkat Anda.

## Cara jejak, rute, dan titik penanda dikonversi

Hasilnya berupa FeatureCollection GeoJSON. Titik penanda menjadi titik dan rute menjadi garis. Jika suatu jejak terdiri dari beberapa segmen, setiap segmen tetap disimpan secara terpisah. Segmen atau rute yang hanya memiliki satu posisi menjadi titik. Informasi deskriptif seperti nama dan catatan tetap disimpan bersama fitur masing-masing.

## Koordinat, elevasi, dan waktu

GeoJSON menyimpan posisi dalam urutan bujur, lalu lintang. Garis yang melintasi antimeridian dipisah pada bujur 180° agar dapat ditampilkan pada peta dunia. Elevasi, jika tersedia, menjadi koordinat ketiga dalam meter. Waktu pada titik disimpan dalam properti fitur. Waktu di sepanjang rute dan segmen jejak tetap diurutkan sesuai koordinat agar dapat dicocokkan dengan posisi. Buka hasilnya di [Penampil GeoJSON](../geojson-viewer/) atau lihat GPX aslinya di [Penampil GPX dan Profil Elevasi](../gpx-viewer/).
