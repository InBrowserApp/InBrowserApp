## Apakah Subresource Integrity (SRI)?

Subresource Integrity (SRI) adalah ciri keselamatan yang membolehkan pelayar untuk mengesahkan bahawa fail yang mereka ambil (contohnya, dari CDN) tidak diubah suai secara tidak dijangka. Ia berfungsi dengan membandingkan hash kriptografi sumber dengan hash yang disediakan dalam HTML.

**Bagaimana ia berfungsi:**

1. Jana hash kriptografi fail sumber anda
2. Sertakan hash dalam atribut integrity tag script atau link
3. Pelayar mengambil sumber dan mengira hashnya
4. Pelayar membandingkan hash yang dikira dengan hash yang disediakan
5. Jika hash sepadan, sumber dimuatkan; jika tidak, pemuatan disekat

**Faedah:**

- **Keselamatan**: Melindungi daripada pengubahsuaian berniat jahat sumber pihak ketiga
- **Perlindungan CDN**: Memastikan fail yang dihidang CDN tidak diganggu
- **Keselamatan rantaian bekalan**: Mengesahkan integriti kebergantungan luaran
- **Sokongan pelayar**: Disokong secara meluas dalam pelayar moden

**Algoritma yang disokong:**

- SHA-256 (minimum yang disyorkan)
- SHA-384 (disyorkan)
- SHA-512 (keselamatan tertinggi)
