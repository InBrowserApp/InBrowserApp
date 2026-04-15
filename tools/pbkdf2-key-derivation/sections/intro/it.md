## Cos'è PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) deriva una chiave crittografica da una password usando un salt e molte iterazioni. Rallenta gli attacchi brute‑force e produce chiavi diverse quando il salt cambia.

**Punti chiave:**

- Usa HMAC con un hash scelto (SHA-1/SHA-256/ecc.)
- Più iterazioni aumentano il costo di calcolo
- La lunghezza dell’output è configurabile

**Buone pratiche:**

- Usa un salt unico e casuale
- Preferisci più iterazioni entro limiti di performance accettabili
- Per sistemi nuovi considera Argon2 o scrypt
