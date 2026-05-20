## Apa yang dijana oleh alat ini

Penjana ini menukar satu imej kepada himpunan favicon yang lengkap dan moden —
fail `.ico` berbilang saiz untuk pelayar lama, varian PNG 16 / 32 / 180 / 192 / 512,
fail `.svg` asal yang pilihan, `site.webmanifest` untuk PWA,
dan petikan HTML yang anda tampal ke dalam `<head>`. Setiap bait dihasilkan dalam
pelayar anda; tiada muat naik, tiada pelayan, tiada analitis.

## Apa yang ada dalam himpunan

- `favicon.ico` — berbilang imej (16 / 32 / 48) untuk tab pelayar, penanda buku,
  dan pintasan Windows lama.
- `favicon-16x16.png` dan `favicon-32x32.png` — varian PNG moden yang digunakan oleh
  pelayar semasa.
- `favicon.svg` — disertakan hanya apabila imej sumber anda ialah SVG dan
  togol "Gunakan SVG asal" dihidupkan.
- `apple-touch-icon.png` — 180×180, legap, digunakan oleh skrin utama iOS.
- `pwa-192x192.png` dan `pwa-512x512.png` — ikon PWA standard.
- `pwa-maskable-192x192.png` dan `pwa-maskable-512x512.png` — varian
  boleh-bertopeng dengan kawasan selamat yang disyorkan oleh W3C.
- `site.webmanifest` — manifes PWA yang disambungkan dengan ikon di atas.

## Cara pelapik, latar belakang, dan zon selamat boleh-bertopeng berfungsi

Setiap platform mempunyai pelapiknya sendiri ("Margin") supaya anda boleh meninggalkan ruang bernafas
di dalam kanvas ikon. Suis "Tambah latar belakang" menyapukan segi empat sama yang legap
di belakang sumber anda — berguna apabila sumber adalah lutsinar dan
destinasi memerlukan kelegapan (skrin utama Apple) atau sekadar untuk
kontras visual dalam tab pelayar. Ikon PWA boleh-bertopeng menggunakan zon selamat tambahan
di atas margin platform: apa-apa yang berada di luar ~80% tengah mungkin
dipangkas oleh Android, Windows, atau ChromeOS apabila mereka memohon topeng bulat,
bersudut bulat, atau squircle.

## Menyambungkan himpunan ke laman web anda

1. Nyahzip arkib yang dimuat turun ke akar web anda (supaya fail berada di
   `/favicon.ico`, `/site.webmanifest`, dll.).
2. Tampalkan petikan HTML ke dalam `<head>` laman web anda.
3. Jika anda menghidangkan aset dari sub-laluan (contohnya `/static/icons/`),
   tetapkan "Laluan aset" sebelum menjana supaya petikan dan manifes menggunakan
   URL yang betul.
4. Jika anda menyesuaikan manifes melebihi apa yang didedahkan oleh alat ini (contohnya
   untuk menambah `categories` atau `screenshots`), buka `site.webmanifest`
   dalam penyunting teks dan edit terus — ia adalah JSON biasa.
