## Vad är JWK ↔ PEM-konvertering?

JWK (JSON Web Key) är nyckelmaterial i JSON-form som används av JOSE/JWT, JWKS-endpoints och serverless- eller webbläsarkonfiguration. Det är lätt för programvara att läsa, men mindre accepterat av CLI:er och infrastruktur som förväntar sig nyckelfiler.

PEM kapslar in DER-nyckeldata med BEGIN/END-etiketter, formatet som OpenSSL, TLS-verktyg, API-gateways och många SDK:er vanligtvis efterfrågar.

Den här konverteraren kopplar ihop formaten lokalt i webbläsaren. Den hanterar RSA-, EC- (P-256/384/521) och OKP-nyckelcontainrar, låter dig välja publik SPKI- eller privat PKCS8-PEM när du startar från JWK, och kan omvandla stödda PEM-block tillbaka till snygg eller kompakt JWK JSON.

Använd publik utdata när du bara behöver verifiering eller distribution. Privata konverteringar visar privat nyckelmaterial på skärmen och i nedladdningar, så behandla resultatet som en hemlighet och stäng fliken när du är klar.

- Flytta nycklar mellan JWKS/JSON-konfiguration och OpenSSL-liknande PEM-filer.
- Extrahera en publik nyckel innan du delar den med JWT-verifierare, gateways eller klienter.
- Konvertera lokalt utan att ladda upp nyckelmaterial till en server.
