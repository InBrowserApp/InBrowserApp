Samlingen med hash-verktøy samler de migrerte hashing-verktøyene slik at du kan velge riktig algoritme før du åpner et bestemt verktøy. Den dekker vanlige fil-digester, kompatibilitetssjekker for eldre systemer, nøkkelbasert meldingsautentisering, Subresource Integrity-strenger, passordhashing, passordverifisering og raske ikke-kryptografiske kontrollsummer.

## Når du bør bruke disse verktøyene

Bruk de kryptografiske digest-verktøyene når du trenger et gjentakbart fingeravtrykk for tekst eller en fil, for eksempel når du sammenligner et nedlastet arkiv mot en publisert kontrollsum med SHA-256. Bruk HMAC når resultatet må bevise at noen med en delt hemmelighet opprettet eller godkjente meldingen. Bruk Argon2, bcrypt, PBKDF2 eller scrypt for passord- og nøkkelavledningsarbeid, der konfigurerbar kostnad betyr mer enn rå hastighet.

## Velg trygt

Ikke alle hasher egner seg for sikkerhet. MD4, MD5 og SHA-1 er nyttige for eldre systemer og kompatibilitetssjekker, men de bør ikke brukes i nye integritetsløsninger der sikkerhet er viktig. CRC, Adler-32, MurmurHash, CityHash og xxHash er raske kontrollsummer eller hasher for gruppering, ikke tuklingsbestandige signaturer. Når du er usikker, velg SHA-256 for offentlige kontrollsummer, HMAC-SHA-256 for nøkkelbasert verifisering og Argon2id eller bcrypt for passordlagring.

## Personvern og arbeidsflyt

De enkelte verktøyene i denne samlingen kjører i nettleseren. Tekst og filer behandles lokalt av det valgte verktøyet, med mindre verktøyet eksplisitt dokumenterer en offentlig oppslagsfunksjon, noe hash-verktøyene ikke trenger. For sensitivt materiale bør du tømme genererte verdier etter bruk og unngå å lime inn hemmeligheter i delte eller opptatte nettleserøkter.
