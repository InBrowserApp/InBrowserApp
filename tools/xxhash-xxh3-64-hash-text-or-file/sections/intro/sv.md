## Vad är xxHash (XXH3 64)?

XXH3 är den moderna xxHash-algoritmen, utformad för mycket hög hastighet och utmärkt fördelning. XXH3 64 ger ett hashvärde på 64 bitar (8 byte), vanligen återgivet som en hexadecimal sträng med 16 tecken. Det är en icke-kryptografisk hashfunktion med stöd för ett valfritt startvärde som ger reproducerbar hashning.

**Viktiga egenskaper:**

- **Extremt snabb**: Optimerad för prestanda med stora indata
- **Deterministisk**: Samma indata och startvärde ger alltid samma hashvärde
- **Icke-kryptografisk**: Inte lämplig för säkerhetsändamål
- **Bra fördelning**: Utmärkt för hashtabeller och indexering
- **Startvärde**: Ett valfritt startvärde gör det möjligt att variera hashvärdena

**Vanliga användningsområden:**

- Hashtabeller och datastrukturer
- Integritetskontroll av filer (utan säkerhetskrav)
- Datadeduplicering och uppdelning i block
- Cachenycklar och databasindexering
- Dataflöden med hög genomströmning
