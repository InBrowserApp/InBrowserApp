## Cara mengonversi TTF atau OTF ke WOFF2

Pilih satu atau beberapa file font TrueType (`.ttf`) atau OpenType (`.otf`), atau seret dan letakkan file di area konversi. Proses dimulai begitu file ditambahkan. Setelah font siap, bandingkan ukuran file asli dan WOFF2, lalu pilih **Unduh WOFF2**. Misalnya, `Inter-Regular.ttf` menjadi `Inter-Regular.woff2`. Semua pemrosesan dilakukan di browser, sehingga file tetap berada di perangkat Anda.

## Mengapa memakai WOFF2 untuk font web?

WOFF2 (Web Open Font Format 2) mengemas data font dengan kompresi Brotli. Dibandingkan dengan file TTF atau OTF asli, WOFF2 biasanya membutuhkan lebih sedikit data untuk dikirim. Penghematannya bergantung pada font. Konversi format mempertahankan semua glif dan sumbu variasi, sehingga satu file font variabel tetap dapat mencakup berbagai ketebalan. Jika situs Anda hanya menggunakan karakter tertentu, gunakan [pembuat subset font](../font-subset-generator/) untuk memperkecil file lagi.

## Cara memakai file WOFF2 di CSS

Simpan file yang diunduh ke folder font situs, lalu gunakan `@font-face` untuk memuatnya. Sesuaikan jalur, ketebalan, dan gaya dengan file yang digunakan. Contoh ini memuat font dengan ketebalan normal dari folder `/fonts/` dan memakai font cadangan selama pemuatan.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

Untuk font variabel, gunakan rentang ketebalan yang didukung oleh font tersebut, misalnya `font-weight: 100 900;`. Periksa lisensi font sebelum menggunakannya di situs web, lalu uji bahasa dan ketebalan yang dipakai pada halaman Anda. Lihat [referensi @font-face dari MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
