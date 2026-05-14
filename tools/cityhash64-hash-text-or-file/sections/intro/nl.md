## Wat is CityHash64?

CityHash64 is een snel, niet-cryptografisch hash-algoritme van Google dat een 64-bits waarde (8 bytes) produceert. Het is nuttig wanneer je een compacte, deterministische vingerafdruk voor tekst of bestanden nodig hebt en snelheid belangrijker is dan cryptografische beveiliging.

**Belangrijkste kenmerken:**

- **Snel en deterministisch**: Dezelfde invoer en seed leveren altijd dezelfde 64-bits hash op
- **Niet-cryptografisch**: Gebruik CityHash64 niet voor wachtwoorden, handtekeningen, tokens of manipulatiebestendige integriteitscontroles
- **Seed-ondersteuning**: Laat de seed leeg voor standaard CityHash64, of voer een decimale seed of een hexadecimale seed met `0x` in wanneer je een aparte seeded hashruimte nodig hebt
- **Lokale verwerking**: Tekst en bestanden worden in de browser gehasht; geuploade bestanden worden niet naar een server verzonden
- **Meerdere coderingen**: Resultaten worden weergegeven als hexadecimale, Base64-, decimale en binaire waarden

**Veelvoorkomende toepassingen:**

- Hashtabellen en datastructuren
- Bestandsvingerafdrukken zonder beveiligingsdoel
- Gegevensontdubbeling en bucketing
- Cachesleutels en shardingsleutels
- Regressiefixtures voor systemen die CityHash64 al gebruiken
- Database-indexering
