## Wat is xxHash (XXH3 64)?

XXH3 is het moderne xxHash-algoritme, ontworpen voor zeer hoge snelheid en een
uitstekende verdeling. XXH3 64 levert een hashwaarde van 64 bits (8 bytes) op,
meestal weergegeven als een hexadecimale reeks van 16 tekens. Het is een
niet-cryptografische hash met ondersteuning voor een optionele seed voor
reproduceerbare hashing.

**Belangrijkste kenmerken:**

- **Extreem snel**: Geoptimaliseerd voor prestaties bij grote invoer
- **Deterministisch**: Dezelfde invoer en seed leveren altijd dezelfde hash op
- **Niet-cryptografisch**: Niet geschikt voor beveiligingsdoeleinden
- **Goede verdeling**: Zeer geschikt voor hashtabellen en indexering
- **Met seed**: Een optionele seed om verschillende hashuitvoer te verkrijgen

**Veelvoorkomende toepassingen:**

- Hashtabellen en gegevensstructuren
- Bestandsintegriteitscontroles (zonder beveiligingsdoel)
- Gegevens ontdubbelen en in blokken verdelen
- Cachesleutels en database-indexering
- Gegevenspijplijnen met een hoge doorvoer
