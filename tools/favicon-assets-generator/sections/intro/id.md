## Apa yang dihasilkan alat ini

Generator ini mengubah satu gambar menjadi paket favicon modern yang lengkap —
`.ico` multi-ukuran untuk peramban lawas, varian PNG 16 / 32 / 180 / 192 / 512,
`.svg` asli opsional, `site.webmanifest` untuk PWA, dan cuplikan HTML yang
Anda tempel ke `<head>`. Setiap byte diproduksi di peramban Anda; tanpa
unggahan, tanpa server, tanpa analitik.

## Apa saja isi paketnya

- `favicon.ico` — multi-gambar (16 / 32 / 48) untuk tab peramban, markah,
  dan pintasan Windows lama.
- `favicon-16x16.png` dan `favicon-32x32.png` — varian PNG modern yang
  digunakan peramban saat ini.
- `favicon.svg` — disertakan hanya jika gambar sumber Anda berupa SVG dan
  sakelar "Gunakan SVG asli" diaktifkan.
- `apple-touch-icon.png` — 180×180, opak, digunakan layar utama iOS.
- `pwa-192x192.png` dan `pwa-512x512.png` — ikon PWA standar.
- `pwa-maskable-192x192.png` dan `pwa-maskable-512x512.png` — varian
  maskable dengan zona aman yang direkomendasikan W3C.
- `site.webmanifest` — manifes PWA yang sudah terhubung ke ikon-ikon di atas.

## Cara kerja padding, latar belakang, dan zona aman maskable

Setiap platform memiliki padding sendiri ("Margin") sehingga Anda dapat
menyisakan ruang napas di dalam kanvas ikon. Sakelar "Tambahkan latar
belakang" mengecat persegi opak di belakang sumber Anda — berguna ketika
sumbernya transparan dan tujuannya membutuhkan opasitas (layar utama Apple)
atau sekadar untuk kontras visual pada tab peramban. Ikon PWA maskable
menggunakan zona aman tambahan di atas margin platform: apa pun di luar
sekitar 80% bagian tengah dapat dipotong oleh Android, Windows, atau ChromeOS
saat mereka menerapkan mask berbentuk lingkaran, membulat, atau squircle.

## Memasang paket ke situs Anda

1. Ekstrak arsip yang diunduh ke akar web Anda (sehingga berkas berada di
   `/favicon.ico`, `/site.webmanifest`, dll.).
2. Tempel cuplikan HTML ke `<head>` situs Anda.
3. Jika Anda menyajikan aset dari sub-path (misalnya `/static/icons/`),
   atur "Asset path" sebelum membuat paket agar cuplikan dan manifes
   menggunakan URL yang benar.
4. Jika Anda menyesuaikan manifes melampaui yang diekspos alat ini
   (misalnya untuk menambahkan `categories` atau `screenshots`), buka
   `site.webmanifest` di editor teks dan ubah langsung — isinya JSON biasa.
