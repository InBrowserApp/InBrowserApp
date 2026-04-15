## Wat is RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) is een cryptografische hashfunctie die een 160-bit (20-byte) hashwaarde produceert, doorgaans weergegeven als een 40-karakter hexadecimaal getal. Het werd ontwikkeld in 1996 door Hans Dobbertin, Antoon Bosselaers en Bart Preneel als onderdeel van het Europese RACE-project.

**Belangrijkste kenmerken:**

- **Deterministisch**: Dezelfde invoer produceert altijd dezelfde hash
- **Snelle berekening**: Redelijk snel te berekenen voor elke gegeven invoer
- **Lawine-effect**: Kleine veranderingen in invoer produceren drastisch verschillende uitvoer
- **Vaste uitvoergrootte**: Produceert altijd een 160-bit hash ongeacht invoergrootte
- **Twee-lijn parallelle structuur**: Gebruikt twee parallelle berekeningslijnen voor verbeterde beveiliging

**Beveiligingsstatus:**
✅ **RIPEMD-160 wordt beschouwd als cryptografisch veilig** zonder bekende praktische aanvallen. Het biedt een goede veiligheidsmarge en wordt nog steeds aanbevolen voor cryptografische toepassingen waar een 160-bit hash voldoende is.

**Veelvoorkomende toepassingen:**

- Bitcoin-adresgeneratie (Base58Check-codering)
- Digitale handtekeningen en certificaten
- Gegevensintegriteitsverificatie
- Cryptografische protocollen die 160-bit hashes vereisen
- Alternatief voor SHA-1 indien nodig

**Vergelijking met andere algoritmen:**

- Veiliger dan MD5 en SHA-1
- Kleinere uitvoer dan SHA-256 (160-bit vs 256-bit)
- Goede prestatiekenmerken
- Goed bestudeerd en vertrouwd in de cryptografische gemeenschap

**Aanbevolen voor:**

- Toepassingen die 160-bit hashbeveiliging vereisen
- Bitcoin-gerelateerde cryptografische bewerkingen
- Legacy systeemcompatibiliteit waar RIPEMD-160 is gespecificeerd
