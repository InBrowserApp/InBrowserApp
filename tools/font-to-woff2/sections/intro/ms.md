## Cara menukar TTF atau OTF kepada WOFF2

Pilih satu atau lebih fail fon TrueType (`.ttf`) atau OpenType (`.otf`), atau seret fail ke dalam penukar. Penukaran bermula sebaik sahaja fail ditambahkan. Apabila fon siap, bandingkan saiz fail asal dan WOFF2, kemudian pilih **Muat turun WOFF2**. Contohnya, `Inter-Regular.ttf` menjadi `Inter-Regular.woff2`. Semua pemprosesan fon berlaku dalam pelayar anda, jadi fail kekal pada peranti anda.

## Mengapa menggunakan WOFF2 untuk fon web?

WOFF2 (Web Open Font Format 2) membungkus data fon dengan pemampatan Brotli. Berbanding dengan menghantar fail TTF atau OTF asal, WOFF2 biasanya memindahkan lebih sedikit bait. Penjimatan bergantung pada fon tersebut. Penukaran format mengekalkan set glif penuh dan paksi fon berubah, jadi satu fail fon berubah masih boleh merangkumi pelbagai ketebalan. Jika laman anda hanya menggunakan set aksara tertentu, gunakan [penjana subset fon](../font-subset-generator/) untuk mengurangkan saiz fail dengan lebih lanjut.

## Cara menggunakan fail WOFF2 dalam CSS

Letakkan fail yang dimuat turun dalam folder fon laman anda dan rujuk fail itu dengan `@font-face`. Padankan laluan, ketebalan dan gaya dengan fail yang digunakan. Contoh ini memuatkan fon biasa dari `/fonts/` dan memaparkan teks dengan fon sandaran semasa pemuatan.

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

Untuk fon berubah, gunakan julat ketebalan yang benar-benar disokong oleh fon tersebut, seperti `font-weight: 100 900;`. Semak lesen fon sebelum mengehoskannya di laman web, dan uji bahasa serta ketebalan yang digunakan pada halaman anda. Lihat [rujukan @font-face MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face).
