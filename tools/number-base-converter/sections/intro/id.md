Konversikan bilangan bulat langsung di browser antara biner, oktal, desimal, heksadesimal, Base32, Base36, Base62, Base64, dan basis khusus dari 2 sampai 64. Semua perhitungan berjalan lokal dengan BigInt, jadi Anda bisa memeriksa nilai besar tanpa mengirimkannya ke server.

## Kapan digunakan

Alat ini berguna ketika bilangan bulat yang sama muncul di log, protokol, ID, atau spesifikasi dengan alfabet yang berbeda. Mengubah satu bidang akan langsung menghitung ulang bidang lainnya, sehingga cocok untuk debugging, dokumentasi, dan verifikasi manual.

## Perbedaan antar basis

Sampai basis 36, huruf diterima tanpa membedakan huruf besar dan kecil. Basis yang lebih tinggi memperlakukan huruf besar dan kecil sebagai digit yang berbeda, dan baris Base64 di sini memakai alfabet numerik `A-Z a-z 0-9 + /`, bukan encoding teks Base64 berbasis byte.

## Hal yang perlu diperhatikan

Hanya bilangan bulat non-negatif yang didukung. Nol di depan dianggap sebagai format, sehingga hasil konversi dinormalisasi dan bisa kehilangan padding yang Anda ketik.
