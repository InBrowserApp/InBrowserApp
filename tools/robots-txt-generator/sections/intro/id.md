## Apa itu generator robots.txt?

Generator robots.txt membantu menggabungkan aturan user-agent, jalur allow/disallow, dan tautan sitemap untuk membuat berkas robots.txt. Publikasikan di root situs sebagai /robots.txt agar crawler dapat membacanya.

### Apa yang bisa dibantu generator ini

- Membuat aturan terpisah untuk mesin pencari, crawler AI, atau bot khusus
- Menambahkan `Allow`, `Disallow`, sitemap, dan direktif lanjutan opsional di satu tempat
- Menyalin atau mengunduh file `robots.txt` yang siap dipublikasikan

### Contoh

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Contoh ini meminta crawler menghindari sebagian besar `/admin/`, tetap mengizinkan `/admin/help/` dirayapi, dan menunjukkan lokasi sitemap.

### Catatan penting

- Publikasikan file di `/robots.txt` pada root situs Anda
- `robots.txt` bersifat publik dan hanya sebagai panduan, bukan kontrol akses
- Tidak semua crawler mendukung `Host` dan `Crawl-delay`
