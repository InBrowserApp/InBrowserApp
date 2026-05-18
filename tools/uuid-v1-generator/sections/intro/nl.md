Genereer UUID v1-identificaties lokaal in uw browser wanneer u waarden nodig hebt die de aanmaaktijd en een node-identificatie bevatten. Deze tool is nuttig voor legacy-integraties, database-imports, geordende fixtures en systemen die nog steeds RFC 4122 versie 1 UUIDs verwachten.

## Wanneer UUID v1 Helpt

UUID v1 slaat een tijdstempel, een kloksequentie en een 48-bit nodewaarde op in een standaard UUID-tekenreeks van 36 tekens. Daardoor zijn gegenereerde IDs grofweg sorteerbaar op aanmaaktijd, terwijl ze nog steeds passen in systemen die gewone UUID-kolommen, URLs, logs en API-payloads accepteren.

## Privacy En Node-Identificaties

Klassieke UUID v1-generatie gebruikte een echt MAC-adres van een netwerkkaart, waardoor hardware-informatie kan worden blootgegeven. Deze tool begint in plaats daarvan met een lokaal beheerd willekeurig MAC-adres. U kunt een specifieke nodewaarde invoeren wanneer u een legacy-systeem moet matchen, maar vermijd het gebruik van echte hardwareadressen in openbare voorbeelden of gedeelde gegevens.

## Kloksequentie En Batchgeneratie

De kloksequentie is een 14-bit waarde die botsingen helpt voorkomen wanneer dezelfde node rond hetzelfde tijdstip IDs genereert. Batchgeneratie houdt alle IDs in dezelfde milliseconde en verhoogt de 100-nanoseconde tick voor elke rij, zodat elke waarde in het resultaat uniek blijft.
