## What this tool does

SVG optimizer ini memampatkan satu fail SVG setempat atau dokumen SVG yang
ditampal dalam pelayar anda. Ia menggunakan pas pembersihan SVGO untuk membuang
komen, metadata, atribut berlebihan, ketepatan yang tidak perlu, dan markup lain
yang tidak mengubah imej yang kelihatan.

## Why it helps

Fail SVG yang dieksport daripada alat reka bentuk sering mengandungi metadata
editor, laluan yang panjang, ID yang tidak digunakan, dan komen.
Mengoptimumkannya boleh mengurangkan saiz muat turun, memperbaik pemuatan
halaman, dan menjadikan kod SVG sebaris lebih mudah disemak sebelum dihantar
dalam laman web, app, email, atau halaman dokumentasi.

## How it works

Muat naik fail `.svg` atau tampal markup SVG, pilih praset selamat atau laraskan
pas SVGO secara individu, kemudian jalankan pengoptimuman. Alat ini menunjukkan
pratonton asal dan yang dioptimumkan, penjimatan bait, dan markup akhir supaya
anda boleh menyalinnya atau memuat turun fail `.optimized.svg`. SVG tidak perlu
meninggalkan peranti anda.

## Practical notes

- Kekalkan praset selamat apabila SVG bergantung pada CSS luaran, ID berskrip,
  atau rujukan simbol yang tidak mudah anda periksa.
- Gunakan praset agresif untuk ikon, logo, dan ilustrasi ringkas yang dieksport
  apabila membuang dimensi dan menjadikan gaya sebaris boleh diterima.
- Pratonton imej yang dioptimumkan sebelum menggantikan karya sumber,
  terutamanya apabila sumber menggunakan mask, gradient, filter, atau aset
  terpaut.
