## Membuka IPA dan membaca metadata aplikasi utama

Seret dan lepaskan file `.ipa` iOS atau pilih **Buka file IPA**. Penampil membaca daftar properti aplikasi utama dari jalur seperti `Payload/Trail Notes.app/Info.plist`. Coba IPA contoh untuk melihat kolom yang tersedia sebelum membuka file Anda sendiri. Ekstraksi arsip dan pembacaan daftar properti berlangsung di browser Anda.

## Memahami ID bundel, versi, dan platform

ID bundel yang tersimpan di `CFBundleIdentifier` mengidentifikasi bundel aplikasi. Versi di `CFBundleShortVersionString` adalah versi rilis, sedangkan `CFBundleVersion` mengidentifikasi build. Gunakan `MinimumOSVersion` untuk memeriksa versi sistem minimum dan `CFBundleSupportedPlatforms` untuk melihat nama platform yang tercatat dalam paket. Nama tampilan berasal dari `CFBundleDisplayName` atau `CFBundleName`.

## Memeriksa dan mengekspor Info.plist

Pilih **Info.plist** untuk melihat seluruh daftar properti sebagai XML yang bisa dibaca, termasuk kunci yang tidak ditampilkan dalam ringkasan. Penampil bisa membaca daftar properti biner dan XML. Pilih **Salin XML** untuk menggunakan bentuk yang bisa dibaca di alat lain, atau **Unduh Info.plist** untuk menyimpan file dalam bentuk aslinya. Jalur di dalam arsip yang ditampilkan menunjukkan bundel aplikasi asal metadata tersebut.

[Referensi daftar properti informasi Apple](https://developer.apple.com/documentation/bundleresources/information-property-list)
