## Wat is JWK ↔ PEM-conversie?

JWK (JSON Web Key) is sleutelmaterial in JSON-vorm dat wordt gebruikt door JOSE/JWT, JWKS-endpoints en serverless- of browserconfiguratie. Software kan het makkelijk lezen, maar CLI’s en infrastructuur die sleutelbestanden verwachten accepteren het minder vaak.

PEM verpakt DER-sleuteldata met BEGIN/END-labels. Dat is het formaat waar OpenSSL, TLS-tools, API-gateways en veel SDKs meestal om vragen.

Deze converter verbindt die formaten lokaal in je browser. Hij verwerkt RSA-, EC- (P-256/384/521) en OKP-sleutelcontainers, laat je vanuit JWK kiezen tussen publieke SPKI- of private PKCS8-PEM, en kan ondersteunde PEM-blokken terugzetten naar nette of compacte JWK JSON.

Gebruik publieke uitvoer wanneer je alleen verificatie of distributie nodig hebt. Private conversies tonen private sleuteldata op het scherm en in downloads, dus behandel het resultaat als een geheim en sluit het tabblad wanneer je klaar bent.

- Verplaats sleutels tussen JWKS/JSON-configuratie en OpenSSL-achtige PEM-bestanden.
- Extraheer een publieke sleutel voordat je die deelt met JWT-verifiers, gateways of clients.
- Converteer lokaal zonder sleutelmaterial naar een server te uploaden.
