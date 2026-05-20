## Wat is een nil UUID?

Een nil UUID is de gestandaardiseerde UUID waarvan alle 128 bits nul zijn. De canonieke tekstvorm is `00000000-0000-0000-0000-000000000000`, en deze wordt vaak gebruikt om aan te geven dat er nog geen UUID is toegewezen.

## Wanneer gebruik je deze?

Gebruik een nil UUID wanneer een API, databasekolom, fixture of configuratiebestand een UUID-vormige waarde vereist, maar de echte identifier bewust ontbreekt. Deze is nuttig als placeholder in tests, importsjablonen, migratiescripts en protocollen die een expliciete lege UUID-waarde definiëren.

## Waar moet je op letten?

Behandel de nil UUID niet als een gegenereerde unieke identifier. Het is elke keer dezelfde waarde, dus als je deze opslaat waar een echte object-ID wordt verwacht, kan dat ontbrekende data verbergen, aannames over uniciteit doorbreken of records verbonden laten lijken terwijl ze dat niet zijn.
