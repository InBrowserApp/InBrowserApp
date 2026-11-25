## Membuka APK dan membaca manifesnya

Seret dan lepaskan file `.apk` Android atau pilih **Buka APK atau manifes**. Penampil membuka `AndroidManifest.xml` dari paket, termasuk XML biner terkompilasi yang ada di sebagian besar APK. Anda juga bisa membuka manifes biner atau teks yang sudah diekstrak. Coba APK contoh untuk melihat ringkasan dan XML hasil dekode. File tetap berada di browser Anda.

## Memahami kolom paket, versi, dan SDK

**Nama paket** mengidentifikasi aplikasi Android. Nama versi adalah label rilis yang dilihat pengguna, sedangkan kode versi adalah angka yang digunakan Android untuk mengurutkan update. SDK minimum adalah level API Android terendah yang dinyatakan dalam manifes, dan SDK target menunjukkan level API yang ditargetkan aplikasi. Kolom yang tidak dicantumkan dalam manifes ditandai sebagai tidak ditentukan.

## Memeriksa izin dan mengekspor AndroidManifest.xml

Ringkasan menampilkan nama izin yang dideklarasikan oleh paket. Android menentukan izin yang benar-benar diberikan di perangkat berdasarkan versi OS, setelan aplikasi, dan pilihan pengguna. Buka **XML manifes** untuk membaca komponen, filter intent, dan deklarasi izin bersyarat. Gunakan **Salin XML** atau **Unduh XML** untuk menyimpan file hasil dekode. Referensi ke resource yang dikompilasi mungkin ditampilkan sebagai ID seperti `@0x7f010001`.

[Struktur dan elemen manifes Android](https://developer.android.com/guide/topics/manifest/manifest-intro)
