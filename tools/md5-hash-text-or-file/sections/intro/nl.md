## Wat is MD5?

MD5 (Message Digest Algorithm 5) is een veel gebruikte cryptografische hashfunctie die een 128-bit (16-byte) hashwaarde produceert, doorgaans weergegeven als een 32-karakter hexadecimaal getal. Het is ontworpen door Ron Rivest in 1991 als opvolger van MD4.

**Belangrijkste kenmerken:**

- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer
- **Lawine-effect**: Kleine veranderingen in invoer produceren drastisch verschillende uitvoer
- **Vaste uitvoergrootte**: Produceert altijd een 128-bit hash ongeacht invoergrootte
- **Botsingsgevoelig**: Bekende kwetsbaarheden maken het mogelijk om botsingen te vinden

**Beveiligingsstatus:**
⚠️ **MD5 is cryptografisch gebroken en mag niet worden gebruikt voor beveiligingskritische toepassingen**. Botsingsaanvallen werden gedemonstreerd in 2004, en praktische botsingsgeneratie werd haalbaar met moderne rekenkracht.

**Veelvoorkomende toepassingen (huidig en historisch):**

- Bestandsintegriteitsverificatie (niet beveiligingskritisch)
- Checksums voor detectie van gegevenscorruptie
- Legacy systemen die MD5 vereisen
- Database sleutelgeneratie (niet-cryptografisch)
- Sommige oudere protocollen en systemen

**Aanbevolen alternatieven:**

- SHA-256 of SHA-3 voor nieuwe toepassingen
- SHA-512 voor hoge beveiligingseisen
- BLAKE2 voor hoge prestatie toepassingen
