## Was ist PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) leitet aus einem Passwort mit Salt und vielen Iterationen einen kryptografischen Schlüssel ab. Es verlangsamt Brute-Force-Angriffe und erzeugt unterschiedliche Schlüssel, wenn sich das Salt ändert.

**Kernpunkte:**

- Verwendet HMAC mit einem gewählten Hash (SHA-1/SHA-256 usw.)
- Mehr Iterationen erhöhen den Rechenaufwand
- Die Ausgabelänge ist konfigurierbar

**Best Practices:**

- Verwenden Sie ein einzigartiges, zufälliges Salt
- Bevorzugen Sie höhere Iterationen bei akzeptabler Performance
- Für neue Systeme Argon2 oder scrypt in Betracht ziehen
