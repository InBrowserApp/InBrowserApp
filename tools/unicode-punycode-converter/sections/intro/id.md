## Mengonversi domain Unicode dan Punycode

Tempel domain seperti `bücher.com` ke **Domain Unicode** untuk mendapatkan `xn--bcher-kva.com` di **Domain ASCII**. Tempel domain `xn--` ke **Domain ASCII** untuk membacanya dalam Unicode. Kedua kolom diperbarui saat Anda mengetik, dan hasil dari keduanya bisa disalin.

## Kapan menggunakan setiap bentuk domain

Punycode mewakili karakter non-ASCII pada nama domain internasional (IDN) dengan huruf, angka, dan tanda hubung ASCII. Label yang dikonversi diawali `xn--`, sementara label ASCII biasa seperti `com` tetap sama. Gunakan bentuk ASCII di pengaturan DNS atau hosting yang memerlukannya, dan bentuk Unicode untuk membaca nama domain dari log atau file konfigurasi.

## Masukan yang diterima konverter

Masukkan nama host saja. Untuk `https://bücher.com/catalog`, tempel `bücher.com`. Subdomain didukung, jadi `www.bücher.com` menjadi `www.xn--bcher-kva.com`.
