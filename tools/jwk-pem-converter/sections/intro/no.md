## Hva er JWK ↔ PEM-konvertering?

JWK (JSON Web Key) er et JSON-basert format for kryptografiske nøkler brukt i JOSE/JWT-systemer. Det kan representere RSA-, EC- eller OKP-nøkler og kan forekomme i et JWK Set (JWKS).

PEM er en Base64-kodet ASN.1/DER-nøkkel med overskriftslinjer som BEGIN PUBLIC KEY eller BEGIN PRIVATE KEY, og er vanlig i TLS, OpenSSL og mange SDK-er.

Dette verktøyet konverterer nøkler begge veier og bevarer nøkkelmaterialet når du velger offentlig (SPKI) eller privat (PKCS8) utdata. Det støtter RSA, EC (P-256/384/521) og OKP (Ed25519/X25519/Ed448/X448), og alt kjører lokalt i nettleseren.

Velg JWK → PEM når et bibliotek, en gateway eller en CLI forventer nøkkelfiler i OpenSSL-stil. Velg PEM → JWK når du må legge en nøkkel inn i et JWKS, sende den gjennom JSON-basert konfigurasjon eller bruke den i nettleser- eller serverless-miljøer. Konvertering av private nøkler bevarer det private materialet, så del bare offentlig utdata hvis det er nok.

- Bruk en JWK/JWKS-nøkkel i systemer som bare aksepterer PEM.
- Eksporter PEM-nøkler for JWT-biblioteker, API-gateways eller nøkkeldistribusjon.
- Del offentlige nøkler trygt uten å eksponere private nøkkeldata.
