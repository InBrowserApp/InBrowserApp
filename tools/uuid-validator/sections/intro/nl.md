## Wat is een UUID-validator?

Een UUID-validator controleert of een identifier is geschreven in de standaard UUID-vorm van 36 tekens, zoals `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Dat is handig wanneer je ID's uit logs, API's, databases, testfixtures of gebruikersinvoer wilt controleren voordat je erop vertrouwt in code.

### Ondersteunde invoer

Deze tool valideert canonieke UUID-tekst met vijf hexadecimale groepen in de `8-4-4-4-12`-indeling. Hoofdletters worden geaccepteerd en genormaliseerd naar kleine letters. De nil-UUID (`00000000-0000-0000-0000-000000000000`) en max-UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) worden behandeld als geldige speciale waarden.

### Validatiedetails

Voor standaard-UUID's controleert de validator de versie-nibble en de variantbits. Versies 1 tot en met 8 worden herkend, waaronder oudere RFC 4122 UUID's en nieuwere RFC 9562-indelingen zoals UUID v6, v7 en v8. Het resultatenpaneel splitst de UUID ook op in vijf segmenten, zodat je de exacte bytes kunt bekijken die worden gevalideerd.

### Privacy

Validatie wordt volledig in je browser uitgevoerd. De UUID die je plakt wordt niet geüpload, dus de tool is veilig te gebruiken met interne identifiers, databasesleutels en voorbeeldlogs uit productie die lokaal moeten blijven.
