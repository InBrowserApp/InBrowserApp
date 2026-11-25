## Så konverterar du GPX till GeoJSON

Öppna en .gpx-fil eller klistra in GPX-XML och välj **Konvertera till GeoJSON**. Välj **Prova ett exempel** för att se hur ett spår, en rutt och en waypoint visas i resultatet. Kopiera GeoJSON-data eller ladda ned en .geojson-fil till ditt kart- eller GIS-projekt. Konverteringen sker i webbläsaren och indata stannar på din enhet.

## Så konverteras spår, rutter och waypoints

Resultatet är en GeoJSON FeatureCollection. Waypoints blir punkter och rutter blir linjer. Om ett spår innehåller flera sammanhängande segment hålls de åtskilda. Ett segment eller en rutt med en position blir en punkt. Beskrivande fält som namn och anteckningar följer med respektive objekt.

## Koordinater, höjd och tid

GeoJSON anger longitud före latitud. Linjer som korsar antimeridianen delas vid 180° för visning på världskartor. Om höjden finns med blir den en tredje koordinat i meter. Punkternas tider sparas i objektens attribut. Tider längs rutter och spårsegment följer koordinaternas ordning, så att varje tid kan kopplas till rätt position. Öppna resultatet med [GeoJSON-visare](../geojson-viewer/) eller utforska den ursprungliga GPX-filen med [GPX-visare och höjdprofil](../gpx-viewer/).
