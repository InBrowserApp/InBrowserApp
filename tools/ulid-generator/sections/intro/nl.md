Genereer ULID's lokaal in je browser voor records, gebeurtenissen, logs, fixtures en gedistribueerde systemen die compacte identifiers met op tijd sorteerbare voorvoegsels nodig hebben. Elke waarde wordt op dit apparaat gemaakt en kan worden gekopieerd of gedownload zonder de batch naar een andere service te sturen.

## Waarom ULID gebruiken

ULID staat voor Universally Unique Lexicographically Sortable Identifier. Het combineert een 48-bits Unix-milliseconde-tijdstempel met 80 bits aan willekeurigheid en codeert het resultaat vervolgens als een Crockford Base32-tekenreeks van 26 tekens. Die vorm maakt ULID's URL-veilig, databasevriendelijk en van nature sorteerbaar op aanmaaktijd.

## Huidige of aangepaste tijd

Gebruik de huidige tijd voor normale applicatierecords, importsleutels en testgegevens die moeten weergeven wanneer ze zijn gemaakt. Schakel over naar een aangepaste tijdstempel wanneer je deterministisch ogende voorbeelden, aangevulde rijen, opnieuw afgespeelde gebeurtenissen of fixtures nodig hebt die rond een specifiek moment moeten sorteren.

## Monotone batches

Wanneer de monotone batchmodus is ingeschakeld, verhogen ID's die voor dezelfde milliseconde zijn gegenereerd hun willekeurige segment, zodat de batch van boven naar beneden lexicografisch gesorteerd blijft. Schakel dit uit wanneer je wilt dat elke rij in plaats daarvan een nieuw willekeurig segment gebruikt. In beide modi blijft de tijdstempel zichtbaar in de eerste tien tekens.
