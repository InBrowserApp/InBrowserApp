## Hva er et JWT-signeringsverktøy?

Et JWT-signeringsverktøy oppretter et kompakt JSON Web Token ved å serialisere en header og payload, og deretter signere dem med en hemmelighet eller privat nøkkel. Resultatet er tokenet i tre deler `header.payload.signature` som brukes av mange API-, OAuth- og sesjonssystemer.

## Når du bør bruke dette verktøyet

- Opprett lokale testtoken for API-utvikling, stagingmiljøer og demoer.
- Sammenlign hvordan ulike algoritmer endrer token-headeren og signaturen.
- Legg til claims som `sub`, `iss`, `aud`, `exp`, `iat`, `scope` eller egendefinerte applikasjonsfelt uten å skrive et engangsskript.
- Generer token med delte HMAC-hemmeligheter eller med private RSA/ECDSA-nøkler i PKCS#8 PEM- eller JWK-format.

## Hva du bør sjekke før du bruker et signert token

- Sørg for at algoritmen passer med nøkkeltypen: `HS*` bruker en delt hemmelighet, `RS*` og `PS*` bruker private RSA-nøkler, og `ES*` bruker private EC-nøkler.
- Legg til utløps- og audience-claims når mottakertjenesten forventer dem.
- Hold private produksjonsnøkler unna delte nettlesere og maskiner. Dette verktøyet kjører lokalt, men det kan ikke beskytte nøkler mot en enhet som allerede er kompromittert.
- Husk at signering ikke er kryptering. Alle som mottar tokenet, kan dekode headeren og payloaden.
