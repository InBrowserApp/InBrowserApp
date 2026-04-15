## Vad är PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) härleder en kryptografisk nyckel från ett lösenord med salt och många iterationer. Det bromsar brute‑force‑attacker och ger olika nycklar när saltet ändras.

**Nyckelpunkter:**

- Använder HMAC med vald hash (SHA-1/SHA-256 osv.)
- Fler iterationer ökar beräkningskostnaden
- Utmatningslängden är konfigurerbar

**Bästa praxis:**

- Använd ett unikt, slumpmässigt salt
- Välj fler iterationer inom acceptabel prestanda
- För nya system, överväg Argon2 eller scrypt
