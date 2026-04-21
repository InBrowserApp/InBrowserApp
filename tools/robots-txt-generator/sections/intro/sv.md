## Vad är en robots.txt-generator?

En robots.txt-generator hjälper dig att kombinera user-agent-regler, allow/disallow-sökvägar och sitemap-länkar för att skapa en robots.txt-fil. Publicera den i webbplatsens rot som /robots.txt så att crawlers kan läsa den.

### Det här hjälper generatorn dig att göra

- Skapa separata regler för sökmotorer, AI-crawlers eller egna botar
- Lägga till `Allow`, `Disallow`, sitemap och valfria avancerade direktiv på ett ställe
- Kopiera eller ladda ner en `robots.txt` som är redo att publiceras

### Exempel

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

I det här exemplet ombeds crawlers att undvika större delen av `/admin/`, samtidigt som `/admin/help/` förblir möjlig att crawla, och sitemapens plats anges.

### Viktiga noteringar

- Publicera filen som `/robots.txt` i webbplatsens rot
- `robots.txt` är offentlig och vägledande, inte åtkomstkontroll
- `Host` och `Crawl-delay` stöds inte av alla crawlers
