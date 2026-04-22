## Hva er PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) avleder en kryptografisk nøkkel fra et passord ved hjelp av salt og mange iterasjoner. Den bremser brute‑force‑angrep og gir ulike nøkler når saltet endres.

**Hovedpunkter:**

- Bruker HMAC med valgt hash (SHA-1/SHA-256 osv.)
- Flere iterasjoner øker beregningskostnaden
- Utdata‑lengden kan konfigureres

**Beste praksis:**

- Bruk et unikt, tilfeldig salt
- Velg flere iterasjoner innen akseptabel ytelse
- For nye systemer, vurder Argon2 eller scrypt
