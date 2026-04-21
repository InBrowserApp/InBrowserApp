## Apakah penjana robots.txt?

Penjana robots.txt membantu menggabungkan peraturan user-agent, laluan allow/disallow dan pautan sitemap untuk menghasilkan fail robots.txt. Terbitkan fail ini di akar laman sebagai /robots.txt supaya perayap boleh membacanya.

### Apa yang penjana ini bantu anda lakukan

- Cipta peraturan berasingan untuk enjin carian, crawler AI atau bot tersuai
- Tambah `Allow`, `Disallow`, sitemap dan arahan lanjutan pilihan di satu tempat
- Salin atau muat turun fail `robots.txt` yang sedia untuk diterbitkan

### Contoh

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Contoh ini meminta crawler mengelakkan kebanyakan `/admin/`, mengekalkan `/admin/help/` sebagai boleh dirangkak, dan menunjukkan lokasi sitemap.

### Nota penting

- Terbitkan fail di `/robots.txt` pada akar laman anda
- `robots.txt` bersifat umum dan hanya sebagai panduan, bukan kawalan akses
- Tidak semua crawler menyokong `Host` dan `Crawl-delay`
