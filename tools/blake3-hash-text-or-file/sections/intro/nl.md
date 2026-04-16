## Wat is BLAKE3?

BLAKE3 is een moderne cryptografische hashfunctie die is afgeleid van BLAKE2. Het is ontworpen voor zeer hoge prestaties en parallelisme terwijl sterke veiligheid behouden blijft. Het produceert standaard een 256-bit hash en ondersteunt een uitbreidbare uitvoerlengte (XOF).

**Belangrijkste kenmerken:**

- **Uitbreidbare uitvoerlengte**: Kan hashes van elke lengte produceren
- **Hoge prestaties**: Snel en paralleliseerbaar op moderne CPU's
- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Lawine-effect**: Kleine veranderingen in de invoer produceren drastisch verschillende uitvoer
- **Onomkeerbaar**: Computationeel onhaalbaar om de hash om te keren om de oorspronkelijke invoer te vinden
- **Botsingsbestendig**: Zeer moeilijk om twee verschillende invoeren te vinden die dezelfde hash produceren
- **Sleutel-hashing**: Ondersteunt een optionele 32-byte sleutel voor MAC-functionaliteit
- **Sleutelafleiding**: Kan subsleutels afleiden uit sleutelmaterialen en context

**Veelvoorkomende toepassingen:**

- Bestandsintegriteitsverificatie
- Content-adressering opslag en deduplicatie
- Digitale handtekeningen en certificaten
- Wachtwoordopslag en authenticatie
- Cryptografische protocollen en systemen
