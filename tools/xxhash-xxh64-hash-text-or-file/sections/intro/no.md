## Hva er xxHash (XXH64)?

xxHash er en ekstremt rask ikke-kryptografisk hash-algoritme som fokuserer på hastighet og ytelse mens den opprettholder gode distribusjonsegenskaper. XXH64 er 64-bits varianten som produserer en 64-bits (8-byte) hash-verdi, vanligvis vist som et 16-tegn heksadesimalt tall.

**Nøkkelegenskaper:**

- **Ekstremt rask**: Optimalisert for hastighet, mye raskere enn kryptografiske hash-funksjoner
- **Deterministisk**: Samme inndata produserer alltid samme hash
- **God distribusjon**: Gir utmerket hash-distribusjon for hash-tabeller
- **Ikke-kryptografisk**: Ikke egnet for sikkerhetsformål, designet for ytelse
- **Større utdata**: 64-bits hash gir bedre kollisjonsresistens enn 32-bits varianter
- **Plattformoptimalisert**: Bruker SIMD-instruksjoner når tilgjengelig for maksimal hastighet

**Vanlige bruksområder:**

- Hash-tabeller og datastrukturer
- Filintegritetssjekker (ikke-sikkerhet)
- Datadeduplisering
- Sjekksummer for dataoverføring
- Ytelseskritiske applikasjoner
- Databaseindeksering
- Cache-nøkkelgenerering
