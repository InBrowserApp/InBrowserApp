## Så öppnar du en Shapefile

Dra ett ZIP-arkiv som innehåller en Esri Shapefile till visaren. Du kan också välja .shp-filen och de tillhörande filerna samtidigt. Om ZIP-arkivet innehåller flera Shapefiler använder du **Lager** för att växla mellan dem. Välj **Prova ett exempel** för att utforska en datamängd med två lager, ett med punkter och ett med polygoner. Webbläsaren läser filerna lokalt på enheten.

## Vilka Shapefile-filer behöver du?

.shp-filen innehåller geometrin och räcker för att visa ett lager med geografiska koordinater. Om de finns, ta även med .dbf-filen för attributen, .prj-filen för koordinatreferenssystemet och .cpg-filen för attributtextens teckenkodning. Filer för samma lager ska ligga tillsammans och ha samma namn före filändelsen. Du kan behålla .shx-indexet i ZIP-arkivet eller ta med det när du väljer filerna.

## Utforska kartan och attributen

Kartvyn anpassas till det aktuella lagret och fungerar offline. Använd kartkontrollerna för att zooma eller för att visa hela lagret igen. Välj en geometri på kartan eller ett objekt i listan **Objekt** för att se dess attribut. Om det finns en .prj-fil som stöds kan visaren omvandla projicerade koordinater till kartans koordinatsystem. I annat fall tolkas koordinater inom giltigt intervall för longitud och latitud som WGS 84. Om lagret använder en kartprojektion öppnar du det på nytt med dess .prj-fil så att det placeras rätt.
