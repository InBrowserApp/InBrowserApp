## Bu araç neden kullanışlıdır

Çoğu site büyük bir sitemap sistemine ihtiyaç duymaz. Arama motorlarının ihtiyacı olan şey; kararlı URL’ler, mantıklı güncelleme ipuçları ve kazara biçimlendirme hatası olmayan geçerli bir XML belgesidir. Bu araç bu temel işe odaklanır.

## Neleri kapsar

- Bir sitedeki sayfalar için standart bir `urlset` sitemap oluşturur.
- Büyük siteleri zaten birden çok sitemap dosyasına ayırdıysanız `sitemapindex` belgesi oluşturur.
- Mutlak URL’lerle veya tek bir temel URL’ye bağlanan temiz göreli yollarla çalışır.

## Nelere dikkat edilmeli

- Sitemap konumları geçici yönlendirmelere değil, nihai canonical URL’lere çözülmelidir.
- `lastmod`, `changefreq` ve `priority` yalnızca ipucudur; tarama davranışını garanti etmez.
- Her satır zaten tam URL ise otomatik temel URL birleştirmeyi kapatın ve XML’i açık tutun.
