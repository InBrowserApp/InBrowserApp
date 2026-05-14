## Hva er SipHash-2-4?

SipHash-2-4 er en rask nøkkelbasert hash-funksjon utviklet for korte meldinger og beskyttelse av hash-tabeller. Den bruker en hemmelig 128-bits nøkkel og produserer 64-bits utdata, vanligvis vist som en 16-tegns heksadesimal verdi.

## Når bør den brukes

- Beskytt hash-tabeller på serversiden mot hash-flooding-angrep når nøkkelen holdes privat.
- Bygg deterministiske nøkkelbaserte sjekksummer for cache-nøkler, sharding eller interne oppslagstabeller.
- Sammenlign tekstutdrag eller filer med samme nøkkel når kryptografisk autentisering ikke kreves.

## Nøkkelformat

Skriv inn nøkkelen som nøyaktig 16 byte med heksadesimale data, for eksempel `0x000102030405060708090a0b0c0d0e0f`. `0x`-prefikset er valgfritt, og verktøyet godtar mellomrom, kolon, bindestreker og understreker for å gjøre lange nøkler enklere å lese.

## Sikkerhetsmerknader

SipHash-2-4 er ikke en erstatning for HMAC, digitale signaturer eller passordhashing. Bruk den til nøkkelbaserte hash-tabell- og sjekksumarbeidsflyter, ikke til å bevise autentisitet på tvers av systemer som trenger kryptografiske sikkerhetsgarantier.
