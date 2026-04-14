## Apa itu Subresource Integrity (SRI)?

Subresource Integrity (SRI) adalah fitur keamanan yang memungkinkan browser untuk memverifikasi bahwa file yang mereka ambil (misalnya, dari CDN) tidak dimodifikasi secara tidak terduga. Ini bekerja dengan membandingkan hash kriptografi dari sumber daya dengan hash yang disediakan dalam HTML.

**Cara kerjanya:**

1. Buat hash kriptografi dari file sumber daya Anda
2. Sertakan hash dalam atribut integrity dari tag script atau link
3. Browser mengambil sumber daya dan menghitung hashnya
4. Browser membandingkan hash yang dihitung dengan hash yang disediakan
5. Jika hash cocok, sumber daya dimuat; jika tidak, pemuatan diblokir

**Manfaat:**

- **Keamanan**: Melindungi terhadap modifikasi berbahaya dari sumber daya pihak ketiga
- **Perlindungan CDN**: Memastikan file yang disajikan CDN tidak diutak-atik
- **Keamanan rantai pasokan**: Memvalidasi integritas dependensi eksternal
- **Dukungan browser**: Didukung secara luas di browser modern

**Algoritma yang didukung:**

- SHA-256 (minimum yang direkomendasikan)
- SHA-384 (direkomendasikan)
- SHA-512 (keamanan tertinggi)
