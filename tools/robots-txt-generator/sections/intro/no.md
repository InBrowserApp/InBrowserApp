## Hva er en robots.txt-generator?

En robots.txt-generator hjelper deg å kombinere user-agent-regler, allow/disallow-stier og sitemap-lenker for å lage en robots.txt-fil. Publiser den i rotkatalogen som /robots.txt slik at crawlere kan lese den.

### Hva denne generatoren hjelper deg med

- Lage separate regler for søkemotorer, AI-crawlere eller egendefinerte boter
- Legge til `Allow`, `Disallow`, sitemap og valgfrie avanserte direktiver på ett sted
- Kopiere eller laste ned en `robots.txt` som er klar til publisering

### Eksempel

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Dette eksemplet ber crawlere om å unngå mesteparten av `/admin/`, lar `/admin/help/` fortsatt være crawlbar og peker dem til sitemapet.

### Viktige merknader

- Publiser filen som `/robots.txt` i rotmappen på nettstedet ditt
- `robots.txt` er offentlig og veiledende, ikke tilgangskontroll
- `Host` og `Crawl-delay` støttes ikke av alle crawlere
