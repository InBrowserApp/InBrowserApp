## Wat is RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) is een cryptografische hashfunctie die een 320-bit (40-byte) hashwaarde produceert, meestal weergegeven als een hexadecimaal getal van 80 tekens. Het is onderdeel van de RIPEMD-familie, die in Europa is ontwikkeld als alternatief voor MD4/MD5.

Gebruik deze tool wanneer je een RIPEMD-320-digest moet berekenen voor geplakte tekst, gekopieerde configuratiegegevens of een lokaal bestand. De berekening wordt in je browser uitgevoerd, zodat de bestandsinhoud niet naar een server hoeft te worden geüpload.

**Belangrijkste kenmerken:**

- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer
- **Avalanche-effect**: Kleine wijzigingen in de invoer leveren drastisch andere uitvoer op
- **Vaste uitvoergrootte**: Produceert altijd een 320-bit hash, ongeacht de invoergrootte
- **Eénrichtingsfunctie**: Het is computationeel onhaalbaar om de oorspronkelijke invoer uit de hash te herstellen

**Veelvoorkomende toepassingen:**

- Controle van gegevensintegriteit
- Vingerafdrukken en deduplicatie
- Compatibiliteit met oudere systemen

**Beveiligingsopmerking:**

RIPEMD-320 is vooral nuttig wanneer een protocol, archief, checksumlijst of ouder systeem dit al voorschrijft. Geef bij nieuwe beveiligingsgevoelige ontwerpen de voorkeur aan een momenteel gestandaardiseerde hash zoals SHA-256, SHA-512, SHA-3 of BLAKE3, tenzij RIPEMD-compatibiliteit vereist is.
