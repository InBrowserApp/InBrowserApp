## Co to jest generator robots.txt?

Generator robots.txt pomaga łączyć reguły User-agent, ścieżki Allow/Disallow i linki do sitemap, aby utworzyć plik robots.txt. Umieść go w katalogu głównym witryny jako /robots.txt, aby roboty mogły go odczytać.

### Do czego pomaga ten generator

- Tworzyć osobne reguły dla wyszukiwarek, crawlerów AI lub własnych botów
- Dodawać `Allow`, `Disallow`, sitemapę i opcjonalne zaawansowane dyrektywy w jednym miejscu
- Skopiować lub pobrać gotowy do publikacji plik `robots.txt`

### Przykład

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

W tym przykładzie crawlery proszone są o omijanie większości `/admin/`, pozostawienie `/admin/help/` dostępnym do indeksowania oraz skorzystanie z mapy witryny.

### Ważne uwagi

- Opublikuj plik pod adresem `/robots.txt` w katalogu głównym witryny
- `robots.txt` jest publiczny i ma charakter wskazówki, a nie kontroli dostępu
- Nie każdy crawler obsługuje `Host` i `Crawl-delay`
