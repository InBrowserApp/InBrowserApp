## Så kontrollerar du en GeoJSON-fil

Öppna en .geojson- eller .json-fil, eller klistra in ett GeoJSON-dokument och välj **Validera GeoJSON**. Välj **Prova ett exempel** för att se en giltig FeatureCollection. Du kan redigera innehållet och kontrollera det igen. Filer och inklistrad text stannar i webbläsaren.

## Det här kontrollerar valideraren

Verktyget kontrollerar först JSON-syntaxen och sedan GeoJSON-strukturen, inklusive FeatureCollection, Feature, GeometryCollection och de enskilda geometrityperna. Positioner använder WGS 84 med longitud före latitud. Valideraren kontrollerar koordinatintervall, minsta antal positioner i linjer och ringar, att ringar är slutna, objektens attribut och hur omslutande rutor är uppbyggda. Tomma objektsamlingar och null som objektgeometri är giltiga.

## Hitta och rätta ett fel

En sökväg i ett felmeddelande, till exempel `$.features[0].geometry.coordinates`, pekar på koordinaterna för det första objektet. Gå till det angivna fältet, rätta felet och validera igen. Resultatet gäller filstrukturen. Geometrisk topologi, till exempel självskärningar och överlappningar, kontrolleras separat i GIS. Öppna ett giltigt resultat med [GeoJSON-visare](../geojson-viewer/) för att granska det på kartan.
