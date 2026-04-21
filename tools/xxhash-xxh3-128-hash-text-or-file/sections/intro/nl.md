## Wat is xxHash (XXH3 128)?

XXH3 is het moderne xxHash-algoritme, ontworpen voor zeer hoge snelheid en uitstekende verdeling. XXH3 128 levert een 128-bits hashwaarde (16 bytes), meestal weergegeven als een hexadecimale tekenreeks van 32 tekens. Het is een niet-cryptografische hash en ondersteunt een optionele seed voor reproduceerbare hashing.

**Belangrijkste kenmerken:**

- **Extreem snel**: Geoptimaliseerd voor hoge prestaties bij grote invoer
- **Deterministisch**: Dezelfde invoer en seed leveren altijd dezelfde hash op
- **Niet-cryptografisch**: Niet geschikt voor beveiligingsdoeleinden
- **Goede verdeling**: Handig voor hashtabellen en indexering
- **Met seed**: Een optionele seed helpt hash-uitvoer te variëren

**Veelvoorkomende toepassingen:**

- Hashtabellen en datastructuren
- Bestandsintegriteitscontroles (niet voor beveiliging)
- Deduplicatie en chunking van data
- Cachesleutels en database-indexering
- Data-pipelines met hoge doorvoer
