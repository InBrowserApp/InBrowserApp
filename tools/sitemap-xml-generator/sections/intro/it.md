## Perché questo strumento è utile

La maggior parte dei siti non ha bisogno di un sistema sitemap enorme. I motori di ricerca hanno bisogno di un documento XML valido con URL stabili, indicazioni di aggiornamento sensate e nessun errore di formattazione accidentale. Questo strumento si concentra su quel compito essenziale.

## Cosa copre

- Creare una sitemap `urlset` standard per le pagine di un sito.
- Creare un documento `sitemapindex` quando un sito grande è già diviso in più file sitemap.
- Usare URL assoluti oppure percorsi relativi puliti uniti a un URL di base.

## A cosa fare attenzione

- Le posizioni nella sitemap dovrebbero puntare agli URL canonici finali, non a redirect temporanei.
- `lastmod`, `changefreq` e `priority` sono suggerimenti, non garanzie sul comportamento di scansione.
- Se ogni riga è già un URL completo, disattiva l’unione automatica con l’URL di base per mantenere l’XML esplicito.
