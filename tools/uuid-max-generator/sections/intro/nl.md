## Wat Is Een Max UUID?

Een max UUID is de gestandaardiseerde UUID waarvan alle 128 bits op een staan. De canonieke tekstvorm is `ffffffff-ffff-ffff-ffff-ffffffffffff`, en de waarde wordt vaak gebruikt om de hoogst mogelijke UUID-waarde aan te duiden.

## Wanneer Je Hem Gebruikt

Gebruik een max UUID wanneer een API, databasequery, fixture of bereikcontrole een UUID-vormige bovengrens of sentinelwaarde nodig heeft. Dit is nuttig in tests, migratiescripts, paginatiecursors en protocollen die een expliciete maximale UUID-waarde definieren.

## Waar Je Op Moet Letten

Behandel de max UUID niet als een gegenereerde unieke identifier. Het is elke keer dezelfde waarde, dus als je hem opslaat waar een echte object-ID wordt verwacht, kan dat sentinel-logica verbergen, aannames over uniciteit breken of records onverwacht aan het einde laten sorteren.
