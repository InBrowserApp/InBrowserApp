## Hva er SHA-256?

SHA-256 (Secure Hash Algorithm 256-bit) er en kryptografisk hash-funksjon som produserer en 256-bits (32-byte) hash-verdi, vanligvis gjengitt som et 64-tegn heksadesimalt tall. Det er en del av SHA-2-familien av hash-funksjoner designet av NSA og publisert av NIST.

**Nøkkelegenskaper:**

- **Deterministisk**: Samme inndata produserer alltid samme hash
- **Rask beregning**: Rask å beregne for enhver gitt inndata
- **Snøskredeffekt**: Små endringer i inndata produserer drastisk forskjellige utdata
- **Irreversibel**: Beregningsmessig umulig å reversere hashen for å finne opprinnelig inndata
- **Kollisjonsresistent**: Svært vanskelig å finne to forskjellige inndata som produserer samme hash

**Vanlige bruksområder:**

- Digitale signaturer og sertifikater
- Blokkjede og kryptovalutaer (Bitcoin bruker SHA-256)
- Passordlagring (med passende salting)
- Filintegritetsverifisering
- Proof-of-work algoritmer
