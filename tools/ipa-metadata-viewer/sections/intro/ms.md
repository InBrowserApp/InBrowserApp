## Membuka IPA dan membaca metadata aplikasi utama

Seret dan lepaskan fail `.ipa` iOS atau pilih **Buka fail IPA**. Pemapar membaca senarai sifat aplikasi utama daripada laluan seperti `Payload/Trail Notes.app/Info.plist`. Cuba IPA contoh untuk melihat medan yang tersedia sebelum membuka fail anda sendiri. Arkib diekstrak dan senarai sifat dibaca dalam pelayar anda.

## Memahami pengecam himpunan, versi dan platform

Pengecam himpunan yang disimpan dalam `CFBundleIdentifier` mengenal pasti himpunan aplikasi. Versi dalam `CFBundleShortVersionString` ialah versi keluaran, manakala `CFBundleVersion` mengenal pasti binaan. Gunakan `MinimumOSVersion` untuk menyemak versi sistem minimum dan `CFBundleSupportedPlatforms` untuk menyemak nama platform yang direkodkan dalam pakej. Nama paparan diperoleh daripada `CFBundleDisplayName` atau `CFBundleName`.

## Menyemak dan mengeksport Info.plist

Pilih **Info.plist** untuk melihat senarai sifat lengkap sebagai XML yang boleh dibaca, termasuk kekunci yang tidak disenaraikan dalam ringkasan. Pemapar boleh membaca senarai sifat binari dan XML. Pilih **Salin XML** untuk menggunakan bentuk yang boleh dibaca dalam alat lain, atau **Muat turun Info.plist** untuk menyimpan fail dalam bentuk asalnya. Laluan dalam arkib yang dipaparkan menunjukkan himpunan aplikasi asal metadata tersebut.

[Rujukan senarai sifat maklumat Apple](https://developer.apple.com/documentation/bundleresources/information-property-list)
