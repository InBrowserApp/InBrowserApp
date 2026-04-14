## Vad är Adler-32?

Adler-32 är en snabb kontrollsummealgoritm som ger ett 32-bitars värde (vanligtvis 8 hextecken). Den är avsedd för att upptäcka oavsiktliga fel, inte för kryptografisk säkerhet.

**Nyckelpunkter:**

- **Snabb och deterministisk**: Samma indata ger alltid samma utdata
- **Integritetskontroll**: Bra för att upptäcka korruption vid överföring eller lagring
- **Inte kryptografisk**: Använd inte för lösenord, signaturer eller manipuleringsskydd

**Vanliga användningar:**

- Kontroll av filöverföring
- Verifiering av arkiv/paket
- Lätta integritetskontroller
