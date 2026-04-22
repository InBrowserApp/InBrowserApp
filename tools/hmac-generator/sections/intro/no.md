## Hva er HMAC?

HMAC (Hash-based Message Authentication Code) er en kryptografisk mekanisme som kombinerer en hemmelig nøkkel med en hash-funksjon for å verifisere både dataintegritet og autentisitet til en melding.

**Hvordan det fungerer:**

1. Den hemmelige nøkkelen kombineres med meldingen
2. En hash-funksjon (som SHA-256) behandler de kombinerte dataene
3. Resultatet er en autentiseringskode med fast størrelse

**Vanlige brukstilfeller:**

- **API-autentisering**: Signering av API-forespørsler for å verifisere avsenderen
- **JWT-tokens**: Brukt i HS256/HS384/HS512-algoritmer
- **Meldingsverifisering**: Sikre at data ikke har blitt manipulert
- **Webhook-signaturer**: Validering av webhook-payloads

**Sikkerhetsmerknader:**

- Bruk alltid en sterk, tilfeldig hemmelig nøkkel
- Hold din hemmelige nøkkel konfidensiell
- SHA-256 eller høyere anbefales for nye applikasjoner
- SHA-1 anses som svak og bør unngås for sikkerhetskritiske bruksområder
