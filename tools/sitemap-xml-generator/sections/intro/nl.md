## Waarom dit hulpmiddel nuttig is

De meeste sites hebben geen groot sitemapsysteem nodig. Zoekmachines hebben een geldig XML-document nodig met stabiele URL’s, zinvolle update-hints en geen toevallige opmaakfouten. Dit hulpmiddel richt zich op dat kernwerk.

## Wat het dekt

- Bouw een standaard `urlset`-sitemap voor pagina’s op één site.
- Bouw een `sitemapindex`-document wanneer je grote sites al in meerdere sitemapbestanden splitst.
- Werk met absolute URL’s of nette relatieve paden die aan één basis-URL worden gekoppeld.

## Waarop letten

- Sitemaplocaties moeten naar de uiteindelijke canonieke URL’s leiden, niet naar tijdelijke redirects.
- `lastmod`, `changefreq` en `priority` zijn hints, geen garanties voor crawlers.
- Als elke rij al een volledige URL is, schakel automatisch koppelen aan de basis-URL uit en houd de XML expliciet.
