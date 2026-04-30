## Mengapa alat ini berguna

Sebagian besar situs tidak memerlukan sistem sitemap yang besar. Mesin pencari membutuhkan dokumen XML yang valid dengan URL stabil, petunjuk pembaruan yang wajar, dan tanpa kesalahan format yang tidak disengaja. Alat ini berfokus pada tugas inti itu.

## Yang dicakup

- Membuat sitemap `urlset` standar untuk halaman di satu situs.
- Membuat dokumen `sitemapindex` ketika situs besar sudah dibagi menjadi beberapa berkas sitemap.
- Bekerja dengan URL absolut atau path relatif rapi yang digabungkan dengan satu URL dasar.

## Yang perlu diperhatikan

- Lokasi sitemap sebaiknya mengarah ke URL canonical final, bukan redirect sementara.
- `lastmod`, `changefreq`, dan `priority` adalah petunjuk, bukan jaminan perilaku crawling.
- Jika setiap baris sudah berupa URL lengkap, matikan penggabungan URL dasar otomatis agar XML tetap eksplisit.
