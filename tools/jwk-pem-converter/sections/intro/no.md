## Hva er JWK ↔ PEM-konvertering?

JWK (JSON Web Key) er nøkkelmateriale i JSON-form som brukes av JOSE/JWT, JWKS-endepunkter og serverless- eller nettleserkonfigurasjon. Det er lett for programvare å lese, men mindre akseptert av CLI-er og infrastruktur som forventer nøkkelfiler.

PEM pakker DER-nøkkeldata inn med BEGIN/END-etiketter, formatet OpenSSL, TLS-verktøy, API-gatewayer og mange SDK-er vanligvis ber om.

Denne konverteren bygger bro mellom formatene lokalt i nettleseren. Den håndterer RSA-, EC- (P-256/384/521) og OKP-nøkkelcontainere, lar deg velge offentlig SPKI- eller privat PKCS8-PEM når du starter fra JWK, og kan gjøre støttede PEM-blokker om til pen eller kompakt JWK JSON.

Bruk offentlig utdata når du bare trenger verifisering eller distribusjon. Private konverteringer viser privat nøkkelmateriale på skjermen og i nedlastinger, så behandle resultatet som en hemmelighet og lukk fanen når du er ferdig.

- Flytt nøkler mellom JWKS/JSON-konfigurasjon og OpenSSL-lignende PEM-filer.
- Trekk ut en offentlig nøkkel før du deler med JWT-verifikatorer, gatewayer eller klienter.
- Konverter lokalt uten å laste opp nøkkelmateriale til en server.
