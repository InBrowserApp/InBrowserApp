## Was ist ein robots.txt-Generator?

Ein robots.txt-Generator hilft, User-Agent-Regeln, Allow/Disallow-Pfade und Sitemap-Links zu kombinieren, um eine robots.txt zu erstellen. Veröffentlichen Sie sie im Stammverzeichnis der Website als /robots.txt, damit Crawler sie lesen können.

### Wobei dir dieser Generator hilft

- Eigene Regeln für Suchmaschinen, KI-Crawler oder benutzerdefinierte Bots erstellen
- `Allow`, `Disallow`, Sitemap und optionale erweiterte Direktiven an einer Stelle hinzufügen
- Eine veröffentlichungsfertige `robots.txt` kopieren oder herunterladen

### Beispiel

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Dieses Beispiel bittet Crawler, den größten Teil von `/admin/` zu meiden, lässt `/admin/help/` crawlbar und verweist auf die Sitemap.

### Wichtige Hinweise

- Veröffentliche die Datei unter `/robots.txt` im Stamm deiner Website
- `robots.txt` ist öffentlich und nur ein Hinweis, keine Zugriffskontrolle
- `Host` und `Crawl-delay` werden nicht von jedem Crawler unterstützt
