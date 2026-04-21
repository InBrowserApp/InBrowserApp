## Cos'è un generatore di robots.txt?

Un generatore di robots.txt aiuta a combinare regole user-agent, percorsi allow/disallow e link alla sitemap per creare il file robots.txt. Pubblicalo nella root del sito come /robots.txt affinché i crawler possano leggerlo.

### Cosa ti aiuta a fare questo generatore

- Creare regole separate per motori di ricerca, crawler IA o bot personalizzati
- Aggiungere `Allow`, `Disallow`, sitemap e direttive avanzate opzionali in un unico punto
- Copiare o scaricare un file `robots.txt` pronto da pubblicare

### Esempio

```text
User-agent: *
Disallow: /admin/
Allow: /admin/help/
Sitemap: https://example.com/sitemap.xml
```

Questo esempio chiede ai crawler di evitare gran parte di `/admin/`, lascia `/admin/help/` scansionabile e indica dove si trova la sitemap.

### Note importanti

- Pubblica il file in `/robots.txt` nella radice del sito
- `robots.txt` è pubblico e indicativo, non un controllo di accesso
- `Host` e `Crawl-delay` non sono supportati da tutti i crawler
