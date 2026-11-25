## Så öppnar du en GeoPackage-fil

Välj eller släpp en .gpkg-fil. Använd **Lager eller tabell** för att växla mellan filens olika delar. Välj **Prova ett exempel** för att öppna ett paket med ett punktlager och ett polygonlager. GeoPackage-filen öppnas lokalt på din enhet. När sidan har laddats fungerar den inbyggda kartan offline, utan att hämta kartplattor från nätet.

## Utforska vektorlager och attribut

Kartvyn anpassas till det valda vektorlagret. Klicka på en punkt, linje eller polygon, eller välj ett objekt i listan **Objekt** för att se dess attribut. Om lagret anger ett koordinatreferenssystem som stöds placerar visaren objekten på kartan med WGS 84. Du kan också välja en tabell utan geometri och bläddra bland enskilda poster. Förhandsvisningen visar högst 500 poster per lager så att kartan svarar snabbt även med stora filer.

## Vad innehåller en GeoPackage-fil?

GeoPackage är ett OGC-format som samlar geografiska data i en enda SQLite-fil. Ett paket kan innehålla flera vektorlager, vanliga attributtabeller och tabeller med kartplattor. Innehåll med kartplattor finns med i lagerlistan. Välj ett vektorlager för att visa geometrier på kartan. Om du har en Esri Shapefile med separata tillhörande filer kan du använda [Shapefile-visare](../shapefile-viewer/).
