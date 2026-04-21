## Wat is xxHash (XXH64)?

xxHash is een extreem snelle niet-cryptografische hash-algoritme dat zich richt op snelheid en prestaties terwijl het goede distributie-eigenschappen behoudt. XXH64 is de 64-bits variant die een 64-bits (8-byte) hash-waarde produceert, doorgaans weergegeven als een 16-karakter hexadecimaal getal.

**Belangrijkste kenmerken:**

- **Extreem snel**: Geoptimaliseerd voor snelheid, veel sneller dan cryptografische hash-functies
- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Goede distributie**: Biedt uitstekende hash-distributie voor hash-tabellen
- **Niet-cryptografisch**: Niet geschikt voor beveiligingsdoeleinden, ontworpen voor prestaties
- **Grotere uitvoer**: 64-bits hash biedt betere botsingsbestendigheid dan 32-bits varianten
- **Platform geoptimaliseerd**: Gebruikt SIMD-instructies wanneer beschikbaar voor maximale snelheid

**Veelvoorkomende toepassingen:**

- Hash-tabellen en datastructuren
- Bestandsintegriteitscontroles (niet-beveiliging)
- Data-deduplicatie
- Checksums voor datatransmissie
- Prestatiekritieke toepassingen
- Database-indexering
- Cache-sleutelgeneratie
