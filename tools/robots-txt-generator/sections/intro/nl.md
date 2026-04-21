## Wat is een robots.txt-generator?

Een robots.txt-generator helpt om user-agentregels, allow/disallow-paden en sitemaplinks te combineren tot een robots.txt-bestand. Publiceer het in de hoofdmap van de site als /robots.txt zodat crawlers het kunnen lezen.

### Waar deze generator je mee helpt

- Aparte regels maken voor zoekmachines, AI-crawlers of aangepaste bots
- `Allow`, `Disallow`, sitemap en optionele geavanceerde directives op één plek toevoegen
- Een publicatieklare `robots.txt` kopiëren of downloaden

### Voorbeeld

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

In dit voorbeeld wordt crawlers gevraagd het grootste deel van `/admin/` te vermijden, blijft `/admin/help/` crawlbaar en wordt naar de sitemap verwezen.

### Belangrijke opmerkingen

- Publiceer het bestand als `/robots.txt` in de hoofdmap van je site
- `robots.txt` is openbaar en adviserend, geen toegangscontrole
- `Host` en `Crawl-delay` worden niet door elke crawler ondersteund
