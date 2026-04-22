## Vad är JWK ↔ PEM-konvertering?

JWK (JSON Web Key) är ett JSON-baserat format för kryptografiska nycklar som används i JOSE/JWT-system. Det kan representera RSA-, EC- eller OKP-nycklar och kan förekomma i en JWK Set (JWKS).

PEM är en Base64-kodad ASN.1/DER-nyckel med rubriker som BEGIN PUBLIC KEY eller BEGIN PRIVATE KEY och är vanlig i TLS, OpenSSL och många SDK:er.

Det här verktyget konverterar nycklar åt båda håll och bevarar nyckelmaterialet när du väljer offentlig (SPKI) eller privat (PKCS8) utdata. Stöd för RSA, EC (P-256/384/521) och OKP (Ed25519/X25519/Ed448/X448), och allt körs lokalt i webbläsaren.

Välj JWK → PEM när ett bibliotek, en gateway eller ett CLI-verktyg förväntar sig nyckelfiler i OpenSSL-stil. Välj PEM → JWK när du behöver lägga in en nyckel i en JWKS, skicka den via JSON-baserad konfiguration eller använda den i webbläsar- eller serverless-miljöer. Konvertering av privata nycklar bevarar det privata materialet, så dela bara den publika utdata om det räcker.

- Använd en JWK/JWKS-nyckel i system som bara accepterar PEM.
- Exportera PEM-nycklar för JWT-bibliotek, API-gateways eller nyckeldistribution.
- Dela offentliga nycklar säkert utan att exponera privata nyckeldata.
