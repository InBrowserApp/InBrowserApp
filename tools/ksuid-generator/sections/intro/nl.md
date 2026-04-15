Genereer KSUID's lokaal in je browser zonder de huidige batch naar een andere dienst te sturen. Deze tool is handig wanneer je identifiers nodig hebt die uniek blijven in gedistribueerde systemen en zich tegelijk ongeveer op aanmaaktijd laten sorteren voor logs, feeds, imports of geordende records.

## Waarom KSUID Gebruiken

KSUID combineert een 32-bits tijdstempel met 128 bits willekeur en encodeert het resultaat als een Base62-tekenreeks van 27 tekens. Daardoor blijft elke ID compact, URL-vriendelijk en eenvoudig op te slaan, terwijl de ingebedde tijdstempel ervoor zorgt dat nieuwere waarden meestal achter oudere waarden terechtkomen.

## Kies Huidige Of Aangepaste Tijd

Gebruik de huidige tijd wanneer je nieuwe ID's nodig hebt voor productiedata, demo's of gewone batchgeneratie. Schakel naar een aangepaste tijdstempel wanneer je reproduceerbare fixtures, achteraf aangevulde records, migratievoorbeelden of testgevallen nodig hebt die uit een specifiek moment lijken te komen.

## Wat Je Vóór Het Exporteren Moet Weten

KSUID bewaart alleen precisie op secondenniveau, dus invoer met milliseconden wordt naar beneden afgerond naar het begin van die seconde. ID's die in dezelfde seconde worden gemaakt, blijven uniek, maar hun uiteindelijke volgorde hangt ook af van de willekeurige payload. Zie KSUID daarom als tijd-sorteerbaar en niet als strikt opeenvolgend.
