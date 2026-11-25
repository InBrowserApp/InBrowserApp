## Slik kontrollerer du en GeoJSON-fil

Åpne en .geojson- eller .json-fil, eller lim inn et GeoJSON-dokument og velg **Valider GeoJSON**. Velg **Prøv et eksempel** for å se en gyldig FeatureCollection. Du kan redigere inndataene og kontrollere dem på nytt. Filer og innlimt tekst blir i nettleseren.

## Hva validatoren kontrollerer

Verktøyet kontrollerer først JSON-syntaksen og deretter GeoJSON-strukturen, inkludert FeatureCollection, Feature, GeometryCollection og enkeltgeometrier. Posisjoner bruker WGS 84 med lengdegrad før breddegrad. Validatoren kontrollerer koordinatintervallene, minste antall posisjoner i linjer og ringer, om ringene er lukket, objektegenskaper og oppbygningen av omsluttende bokser. Tomme objektsamlinger og null som objektgeometri er gyldige.

## Finn og rett en feil

En feilsti som `$.features[0].geometry.coordinates` peker på koordinatene til det første objektet. Gå til det angitte feltet, rett feilen og valider på nytt. Resultatet gjelder filstrukturen. Topologiske forhold som selvkryss og overlapp kontrolleres separat i GIS. Åpne et gyldig resultat i [GeoJSON-viser](../geojson-viewer/) for å se det på kartet.
