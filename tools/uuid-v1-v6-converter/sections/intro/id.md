UUID v1 dan UUID v6 memuat informasi inti yang sama: stempel waktu, clock sequence, dan pengidentifikasi node. UUID v1 menyimpan stempel waktu dalam urutan bidang UUID historis, sedangkan UUID v6 menyusun ulang bit stempel waktu tersebut sehingga pengurutan leksikografis sederhana mengikuti waktu pembuatan dengan lebih alami.

Gunakan alat ini saat Anda perlu memindahkan pengidentifikasi antar sistem yang mengharapkan tata letak UUID berbasis waktu yang berbeda. Tempel UUID v1 untuk mendapatkan padanan UUID v6, atau tempel UUID v6 untuk memulihkan representasi UUID v1. Konversinya deterministik dan mempertahankan clock sequence serta byte node tanpa perubahan.

## Kapan menggunakannya

- Memigrasikan rekaman dari penyimpanan UUID v1 lama ke UUID v6 sambil mempertahankan metadata identitas.
- Men-debug database, log, atau antrean yang mencampur nilai UUID v1 dan UUID v6.
- Memeriksa apakah nilai UUID v6 dipetakan kembali ke nilai UUID v1 yang diharapkan oleh integrasi lama.

## Format input

Konverter ini menerima string UUID kanonis dengan tanda hubung, string UUID ringkas 32 karakter, UUID huruf besar, nilai `urn:uuid:`, dan UUID yang dibungkus kurung kurawal. Hasil selalu dinormalisasi ke bentuk UUID kanonis huruf kecil.

## Catatan privasi dan kompatibilitas

UUID v1 dan UUID v6 dapat mengodekan waktu pembuatan dan informasi node. Perlakukan keduanya sebagai pengidentifikasi operasional, bukan rahasia, dan hindari mengeksposnya saat metadata stempel waktu atau node dapat bersifat sensitif. Alat ini berjalan secara lokal di browser Anda dan tidak mengunggah UUID Anda.
