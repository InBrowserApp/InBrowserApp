## robots.txt oluşturucu nedir?

robots.txt oluşturucu, user-agent kurallarını, allow/disallow yollarını ve sitemap bağlantılarını birleştirerek robots.txt dosyası oluşturmanıza yardımcı olur. Dosyayı sitenin köküne /robots.txt olarak yayımlayın ki tarama botları okuyabilsin.

### Bu oluşturucu ne yapmanıza yardımcı olur

- Arama motorları, yapay zeka tarayıcıları veya özel botlar için ayrı kurallar oluşturmak
- `Allow`, `Disallow`, sitemap ve isteğe bağlı gelişmiş yönergeleri tek yerde eklemek
- Yayınlamaya hazır bir `robots.txt` dosyasını kopyalamak veya indirmek

### Örnek

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Bu örnek, tarayıcılardan `/admin/` bölümünün çoğundan kaçınmalarını ister, `/admin/help/` yolunu taranabilir bırakır ve sitemap konumunu gösterir.

### Önemli notlar

- Dosyayı site kökünüzde `/robots.txt` olarak yayınlayın
- `robots.txt` herkese açıktır ve yalnızca yönlendiricidir; erişim kontrolü değildir
- `Host` ve `Crawl-delay` her tarayıcı tarafından desteklenmez
