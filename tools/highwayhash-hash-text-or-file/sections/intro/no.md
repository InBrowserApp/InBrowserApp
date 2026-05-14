## Hva er HighwayHash?

HighwayHash er en rask nøkkelbasert hash-funksjon utviklet av Google for fingeravtrykk og integritetskontroller med høy gjennomstrømming. Den bruker en 256-biters nøkkel og kan produsere 64-biters, 128-biters eller 256-biters utdata fra samme tekst- eller filinndata.

## Når bør den brukes

- Bygg deterministiske nøkkelbaserte sjekksummer for cache-nøkler, objekt-ID-er, sharding eller interne oppslagstabeller.
- Sammenlign filer eller tekstdata med samme nøkkel når hastighet er viktigere enn bred kryptografisk kompatibilitet.
- Generer 128-biters eller 256-biters fingeravtrykk når en større hash som ikke er for passord, er nyttig i integritetsarbeidsflyter.

## Nøkkel- og utdataalternativer

Skriv inn nøkkelen som nøyaktig 32 byte med heksadesimale data, for eksempel `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. `0x`-prefikset er valgfritt, og verktøyet godtar mellomrom, kolon, bindestreker og understreker for å gjøre lange nøkler enklere å lese. Hvis nøkkelen står tom, brukes bibliotekets standardnøkkel, som er praktisk for raske kontroller, men ikke bør behandles som hemmelig.

## Sikkerhetsmerknader

HighwayHash er ikke en erstatning for HMAC, digitale signaturer eller passordhashing. Bruk den til raske nøkkelbaserte fingeravtrykk og sjekksumarbeidsflyter, ikke til å bevise autentisitet på tvers av systemer som trenger standard kryptografisk verifisering.
