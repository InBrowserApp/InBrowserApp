## Hva er xxHash (XXH3 128)?

XXH3 er den moderne xxHash-algoritmen, utviklet for svært høy hastighet og god distribusjon. XXH3 128 produserer en 128-bits hashverdi (16 byte), vanligvis vist som en heksadesimal streng på 32 tegn. Det er en ikke-kryptografisk hash og støtter også valgfri seed for reproduserbar hashing.

**Viktige egenskaper:**

- **Svært rask**: Optimalisert for høy ytelse på store inndata
- **Deterministisk**: Samme inndata og samme seed gir alltid samme hash
- **Ikke-kryptografisk**: Ikke egnet til sikkerhetsformål
- **God distribusjon**: Nyttig for hashtabeller og indeksering
- **Seed-støtte**: Valgfri seed hjelper med å variere hashutdata

**Vanlige bruksområder:**

- Hashtabeller og datastrukturer
- Kontroller av filintegritet (ikke sikkerhet)
- Deduplisering og chunking av data
- Buffernøkler og databaseindeksering
- Datapipelines med høy gjennomstrømning
