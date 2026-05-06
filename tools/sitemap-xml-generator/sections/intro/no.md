## Hvorfor dette verktøyet er nyttig

De fleste nettsteder trenger ikke et stort sitemap-system. Søkemotorer trenger et gyldig XML-dokument med stabile URL-er, fornuftige oppdateringshint og ingen tilfeldige formateringsfeil. Dette verktøyet fokuserer på den kjerneoppgaven.

## Hva det dekker

- Bygg en standard `urlset`-sitemap for sider på ett nettsted.
- Bygg et `sitemapindex`-dokument når store nettsteder allerede er delt opp i flere sitemapfiler.
- Arbeid med absolutte URL-er eller rene relative stier som slås sammen med én basis-URL.

## Hva du bør passe på

- Sitemap-plasseringer bør peke til endelige kanoniske URL-er, ikke midlertidige videresendinger.
- `lastmod`, `changefreq` og `priority` er hint, ikke garantier for crawling-atferd.
- Hvis hver rad allerede er en full URL, slå av automatisk basis-URL-sammenslåing og hold XML-en eksplisitt.
