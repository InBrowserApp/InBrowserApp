## GPX omzetten naar GeoJSON

Open een .gpx-bestand of plak GPX-XML en klik op **Omzetten naar GeoJSON**. Kies **Voorbeeld proberen** om te zien hoe een track, een route en een waypoint in het resultaat worden opgenomen. Kopieer de GeoJSON-gegevens of download een .geojson-bestand voor je kaart- of GIS-project. De conversie gebeurt in de browser, zodat de invoer op je apparaat blijft.

## Zo worden tracks, routes en waypoints omgezet

Het resultaat is een GeoJSON FeatureCollection. Waypoints worden punten en routes worden lijnen. Als een track uit meerdere segmenten bestaat, blijven die van elkaar gescheiden. Een segment of route met één positie wordt een punt. Beschrijvende gegevens zoals namen en notities blijven bij het bijbehorende GeoJSON-object.

## Coördinaten, hoogte en tijd

GeoJSON geeft bij elke positie eerst de lengtegraad en daarna de breedtegraad. Lijnen die de antimeridiaan kruisen, worden bij 180° gesplitst voor weergave op wereldkaarten. Als er een hoogte beschikbaar is, wordt die als derde coördinaat in meters opgenomen. Tijdstippen van punten komen in de objecteigenschappen. De tijdstippen langs routes en tracksegmenten houden de volgorde van de coördinaten, zodat je bij elk tijdstip de juiste positie kunt terugvinden. Open het resultaat in de [GeoJSON-viewer](../geojson-viewer/) of verken de oorspronkelijke GPX in de [GPX-viewer met hoogteprofiel](../gpx-viewer/).
