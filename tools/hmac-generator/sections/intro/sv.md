## Vad är HMAC?

HMAC (Hash-based Message Authentication Code) är en kryptografisk mekanism som kombinerar en hemlig nyckel med en hashfunktion för att verifiera både dataintegritet och äkthet hos ett meddelande.

**Hur det fungerar:**

1. Den hemliga nyckeln kombineras med meddelandet
2. En hashfunktion (som SHA-256) bearbetar den kombinerade datan
3. Resultatet är en autentiseringskod med fast storlek

**Vanliga användningsfall:**

- **API-autentisering**: Signering av API-förfrågningar för att verifiera avsändaren
- **JWT-tokens**: Används i HS256/HS384/HS512-algoritmer
- **Meddelandeverifiering**: Säkerställa att data inte har manipulerats
- **Webhook-signaturer**: Validering av webhook-nyttolaster

**Säkerhetsanteckningar:**

- Använd alltid en stark, slumpmässig hemlig nyckel
- Håll din hemliga nyckel konfidentiell
- SHA-256 eller högre rekommenderas för nya applikationer
- SHA-1 anses vara svag och bör undvikas för säkerhetskritiska användningsområden
