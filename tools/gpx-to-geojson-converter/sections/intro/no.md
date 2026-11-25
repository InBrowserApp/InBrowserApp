## Slik konverterer du GPX til GeoJSON

Åpne en .gpx-fil eller lim inn GPX-XML, og velg **Konverter til GeoJSON**. Velg **Prøv et eksempel** for å se hvordan et spor, en rute og et veipunkt blir vist i resultatet. Kopier GeoJSON-dataene eller last ned en .geojson-fil til kart- eller GIS-prosjektet ditt. Konverteringen skjer i nettleseren, og inndataene blir på enheten din.

## Slik konverteres spor, ruter og veipunkter

Resultatet er en GeoJSON FeatureCollection. Veipunkter blir punkter, og ruter blir linjer. Har et spor flere sammenhengende segmenter, beholdes de som separate deler. Et segment eller en rute med én posisjon blir et punkt. Beskrivende felt som navn og merknader følger med det tilhørende objektet.

## Koordinater, høyde og tid

I GeoJSON oppgis lengdegrad før breddegrad. Linjer som krysser antimeridianen, deles ved 180° for visning på verdenskart. Hvis det finnes en høydeverdi, blir den en tredje koordinat i meter. Tidspunkter for punkter lagres i objektegenskapene. Tidspunktene langs ruter og sporsegmenter følger koordinatenes rekkefølge, slik at de kan kobles til riktig posisjon. Du kan åpne resultatet i [GeoJSON-viser](../geojson-viewer/) eller utforske den opprinnelige GPX-filen i [GPX-viser med høydeprofil](../gpx-viewer/).
