## Wat is PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) leidt een cryptografische sleutel af uit een wachtwoord met een salt en veel iteraties. Het vertraagt brute‑force‑aanvallen en levert verschillende sleutels op wanneer de salt verandert.

**Belangrijke punten:**

- Gebruikt HMAC met een gekozen hash (SHA-1/SHA-256/etc.)
- Meer iteraties verhogen de rekenkosten
- Uitvoerlengte is configureerbaar

**Best practices:**

- Gebruik een unieke, willekeurige salt
- Kies meer iteraties binnen acceptabele prestaties
- Overweeg Argon2 of scrypt voor nieuwe systemen
