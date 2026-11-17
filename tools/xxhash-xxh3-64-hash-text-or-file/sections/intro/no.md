## Hva er xxHash (XXH3 64)?

XXH3 er den moderne xxHash-algoritmen, utviklet for svært høy hastighet og utmerket fordeling. XXH3 64 gir en 64-bits (8-byte) hashverdi, vanligvis vist som en heksadesimal streng på 16 tegn. Den er en ikke-kryptografisk hashfunksjon og støtter en valgfri startverdi for reproduserbar hashing.

**Viktige egenskaper:**

- **Ekstremt rask**: Optimalisert for ytelse med store inndata
- **Deterministisk**: Samme inndata og startverdi gir alltid samme hashverdi
- **Ikke-kryptografisk**: Ikke egnet til sikkerhetsformål
- **God fordeling**: Velegnet til hashtabeller og indeksering
- **Med startverdi**: Valgfri startverdi for å variere hashverdiene

**Vanlige bruksområder:**

- Hashtabeller og datastrukturer
- Filintegritetskontroller uten sikkerhetsformål
- Duplikatfjerning og oppdeling av data i blokker
- Hurtigbuffernøkler og databaseindeksering
- Databehandlingskjeder med høy gjennomstrømning
