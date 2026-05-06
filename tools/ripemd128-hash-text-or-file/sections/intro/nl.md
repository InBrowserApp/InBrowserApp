## Wat is RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) is een cryptografische hashfunctie die een hashwaarde van 128 bits (16 bytes) produceert, meestal weergegeven als een 32-karakterig hexadecimaal getal. Het is onderdeel van de in Europa ontwikkelde RIPEMD-familie als alternatief voor MD4/MD5.

**Belangrijkste kenmerken:**

- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer
- **Lawine-effect**: Kleine veranderingen in invoer produceren drastisch verschillende uitvoer
- **Vaste uitvoergrootte**: Produceert altijd een 128-bit hash ongeacht de invoergrootte
- **Eenrichtings**: Het is computationeel onhaalbaar om de oorspronkelijke invoer uit de hash te herstellen

**Veelvoorkomende toepassingen:**

- Gegevensintegriteitscontroles
- Vingerafdrukken en deduplicatie
- Compatibiliteit met legacy-systemen
