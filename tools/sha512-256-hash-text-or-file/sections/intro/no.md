## Hva er SHA-512/256 (FIPS 180-4)?

SHA-512/256 (FIPS 180-4) er en kryptografisk hashfunksjon i SHA-2-familien som gir en 256-bits (32-byte) hashverdi, vanligvis vist som en heksadesimal streng på 64 tegn. Den er basert på SHA-512 med andre startverdier og avkortede utdata, noe som gir en kortere hashverdi samtidig som den interne strukturen til SHA-512 beholdes.

**Viktige egenskaper:**

- **Deterministisk**: Samme inndata gir alltid samme hashverdi
- **Rask beregning**: Rask å beregne for alle typer inndata
- **Skredeffekt**: Små endringer i inndata gir svært forskjellige utdata
- **Irreversibel**: Det er beregningsmessig ugjennomførbart å reversere hashverdien for å finne de opprinnelige inndataene
- **Kollisjonsbestandig**: Svært vanskelig å finne to forskjellige inndata som gir samme hashverdi

**Vanlige bruksområder:**

- Digitale signaturer og sertifikater
- Integritetskontroller og kontrollsummer
- HMAC-konstruksjoner
- Filverifisering og databehandlingskjeder
- Protokoller som krever 256-bits hashverdier
