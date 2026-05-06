## Varför verktyget är användbart

De flesta webbplatser behöver inget stort sitemap-system. Sökmotorer behöver ett giltigt XML-dokument med stabila URL:er, rimliga uppdateringssignaler och inga oavsiktliga formateringsfel. Det här verktyget fokuserar på den kärnuppgiften.

## Vad det täcker

- Skapa en standard-`urlset`-sitemap för sidor på en webbplats.
- Skapa ett `sitemapindex`-dokument när stora webbplatser redan är uppdelade i flera sitemapfiler.
- Arbeta med absoluta URL:er eller rena relativa sökvägar som slås ihop med en bas-URL.

## Att tänka på

- Sitemap-platser bör leda till slutliga kanoniska URL:er, inte till temporära omdirigeringar.
- `lastmod`, `changefreq` och `priority` är signaler, inte garantier för crawlning.
- Om varje rad redan är en fullständig URL, stäng av automatisk sammanslagning med bas-URL och håll XML:en explicit.
