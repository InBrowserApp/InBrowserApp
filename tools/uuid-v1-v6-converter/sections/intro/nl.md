UUID v1 en UUID v6 bevatten dezelfde kerninformatie: een tijdstempel, een kloksequentie en een node-ID. UUID v1 slaat de tijdstempel op in de historische UUID-veldvolgorde, terwijl UUID v6 die tijdstempelbits zo herschikt dat eenvoudige lexicografische sortering natuurlijker de aanmaaktijd volgt.

Gebruik deze tool wanneer je identifiers moet overzetten tussen systemen die verschillende tijdgebaseerde UUID-indelingen verwachten. Plak een UUID v1 om het equivalent in UUID v6 te krijgen, of plak een UUID v6 om de UUID v1-weergave te herstellen. De conversie is deterministisch en laat de kloksequentie en node-bytes ongewijzigd.

## Wanneer je deze gebruikt

- Records migreren van oudere UUID v1-opslag naar UUID v6, met behoud van identiteitsmetadata.
- Fouten opsporen in databases, logs of wachtrijen die UUID v1- en UUID v6-waarden mengen.
- Controleren of een UUID v6-waarde terugleidt naar de UUID v1-waarde die een oudere integratie verwacht.

## Invoerformaat

De converter accepteert canonieke UUID-tekenreeksen met koppeltekens, compacte UUID-tekenreeksen van 32 tekens, UUID's in hoofdletters, `urn:uuid:`-waarden en UUID's tussen accolades. Resultaten worden altijd genormaliseerd naar canonieke UUID-vorm in kleine letters.

## Opmerkingen over privacy en compatibiliteit

UUID v1 en UUID v6 kunnen aanmaaktijd en node-informatie coderen. Behandel ze als operationele identifiers, niet als geheimen, en voorkom dat je ze blootstelt wanneer metadata over tijdstempel of node gevoelig kan zijn. Deze tool wordt lokaal in je browser uitgevoerd en uploadt je UUID's niet.
