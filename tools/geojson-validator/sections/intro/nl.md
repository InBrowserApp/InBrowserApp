## Een GeoJSON-bestand controleren

Open een .geojson- of .json-bestand, of plak een GeoJSON-document en klik op **GeoJSON valideren**. Kies **Voorbeeld proberen** om een geldige FeatureCollection te bekijken. Je kunt de invoer aanpassen en opnieuw controleren. Bestanden en geplakte tekst blijven in je browser.

## Wat de validator controleert

De validator controleert eerst de JSON-syntaxis en vervolgens de GeoJSON-structuur, waaronder FeatureCollection, Feature, GeometryCollection en de afzonderlijke geometrietypen. Posities gebruiken WGS 84, met de lengtegraad vóór de breedtegraad. De validator controleert het coördinatenbereik, het minimale aantal posities in lijnen en ringen, of ringen gesloten zijn, de objecteigenschappen en de opbouw van begrenzingsvakken. Lege objectcollecties en objecten met null als geometrie zijn geldig.

## Een probleem vinden en oplossen

Een foutpad zoals `$.features[0].geometry.coordinates` verwijst naar de coördinaten van het eerste object. Zoek het aangegeven veld, pas het aan en valideer de invoer opnieuw. Het resultaat gaat over de bestandsstructuur. Voor de topologie van geometrieën, zoals zelfdoorsnijdingen en overlappingen, voer je een aparte GIS-controle uit. Open een geldig resultaat in de [GeoJSON-viewer](../geojson-viewer/) om het op de kaart te bekijken.
