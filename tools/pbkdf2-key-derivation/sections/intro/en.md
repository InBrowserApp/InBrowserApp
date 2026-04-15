## What is PBKDF2?

PBKDF2 (Password-Based Key Derivation Function 2) derives a cryptographic key from a password using a salt and many iterations. It slows down brute-force attacks and produces different keys when the salt changes.

**Key points:**

- Uses HMAC with a chosen hash (SHA-1/SHA-256/etc.)
- Iterations increase computation cost
- Output length is configurable

**Best practices:**

- Use a unique, random salt
- Prefer higher iterations within acceptable performance
- For new systems, consider memory-hard KDFs like Argon2 or scrypt
