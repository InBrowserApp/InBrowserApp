## Hva er BLAKE3?

BLAKE3 er en moderne kryptografisk hash-funksjon avledet fra BLAKE2. Den er designet for svært høy ytelse og parallellisme samtidig som sikkerheten er sterk. Den gir som standard en 256-bits hash og støtter utvidbar utdatalengde (XOF).

**Nøkkelegenskaper:**

- **Utvidbar utdatalengde**: Kan produsere hasher av hvilken som helst lengde
- **Høy ytelse**: Rask og parallelliserbar på moderne CPU-er
- **Deterministisk**: Samme inndata produserer alltid samme hash
- **Snøskredeffekt**: Små endringer i inndata gir drastisk ulike utdata
- **Irreversibel**: Beregningsmessig umulig å reversere hashen for å finne opprinnelig inndata
- **Kollisjonsresistent**: Svært vanskelig å finne to ulike inndata som produserer samme hash
- **Nøkkel-hashing**: Støtter en valgfri 32-byte-nøkkel for MAC-funksjonalitet
- **Nøkkelavledning**: Kan avlede undernøkler fra nøkkelmateriale og kontekst

**Vanlige bruksområder:**

- Filintegritetsverifisering
- Innholdsadressert lagring og deduplisering
- Digitale signaturer og sertifikater
- Passordlagring og autentisering
- Kryptografiske protokoller og systemer
