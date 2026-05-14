## Hva er CityHash64?

CityHash64 er en rask ikke-kryptografisk hash-algoritme fra Google som produserer en 64-bits (8-byte) verdi. Den er nyttig når du trenger et kompakt, deterministisk fingeravtrykk for tekst eller filer, og hastighet er viktigere enn kryptografisk sikkerhet.

**Nøkkelegenskaper:**

- **Rask og deterministisk**: Samme inndata og seed produserer alltid samme 64-bits hash
- **Ikke-kryptografisk**: Ikke bruk CityHash64 for passord, signaturer, tokener eller manipulasjonssikre integritetssjekker
- **Seed-støtte**: La seed stå tom for standard CityHash64, eller skriv inn en desimal seed eller en heksadesimal seed med `0x` når du trenger et separat hash-rom med seed
- **Lokal behandling**: Tekst og filer hashes i nettleseren; opplastede filer sendes ikke til en server
- **Flere kodinger**: Resultatene vises som heksadesimale, Base64-, desimal- og binærverdier

**Vanlige bruksområder:**

- Hash-tabeller og datastrukturer
- Filfingeravtrykk uten sikkerhetskrav
- Datadeduplisering og gruppering
- Cache-nøkler og sharding-nøkler
- Regresjonsfixturer for systemer som allerede bruker CityHash64
- Databaseindeksering
