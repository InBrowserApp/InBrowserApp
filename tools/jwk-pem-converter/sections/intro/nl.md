## Wat is JWK ↔ PEM-conversie?

JWK (JSON Web Key) is een JSON-formaat voor cryptografische sleutels dat wordt gebruikt in JOSE/JWT-systemen. Het kan RSA-, EC- of OKP-sleutels representeren en kan voorkomen in een JWK Set (JWKS).

PEM is een Base64-gecodeerde ASN.1/DER-sleutel met kopregels zoals BEGIN PUBLIC KEY of BEGIN PRIVATE KEY, en is gebruikelijk in TLS, OpenSSL en veel SDK's.

Deze tool converteert sleutels in beide richtingen en behoudt het sleutelmateriaal wanneer je publieke (SPKI) of private (PKCS8) output kiest. Ondersteunde formaten zijn RSA, EC (P-256/384/521) en OKP-sleutelcontainers, en alles draait lokaal in je browser.

Kies JWK → PEM wanneer een bibliotheek, gateway of CLI OpenSSL-achtige sleutelbestanden verwacht. Kies PEM → JWK wanneer je een sleutel in een JWKS moet opnemen, via JSON-configuratie moet doorgeven of in browser- of serverless-omgevingen wilt gebruiken. Bij het converteren van een private sleutel blijft het private materiaal behouden, dus deel alleen de publieke uitvoer als dat voldoende is.

- Gebruik een JWK/JWKS-sleutel met systemen die alleen PEM accepteren.
- Exporteer PEM-sleutels voor JWT-bibliotheken, API-gateways of sleutel-distributie.
- Deel publieke sleutels veilig zonder private-sleuteldata bloot te leggen.
