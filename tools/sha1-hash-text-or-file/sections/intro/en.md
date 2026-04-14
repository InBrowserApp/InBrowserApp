## What is SHA-1?

SHA-1 (Secure Hash Algorithm 1) is a cryptographic hash function that produces a 160-bit (20-byte) hash value, typically rendered as a 40-character hexadecimal number. It was designed by the NSA and published by NIST in 1995 as part of the Digital Signature Standard.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Irreversible**: Computationally infeasible to reverse the hash to find the original input
- **Collision vulnerable**: Known vulnerabilities make it possible to find collisions

**Security status:**
⚠️ **SHA-1 is cryptographically broken and should not be used for security-critical applications**. Theoretical attacks were demonstrated in 2005, and practical collision attacks were achieved in 2017.

**Common uses (historical):**

- Digital signatures and certificates (deprecated)
- Git version control system (for compatibility)
- Legacy systems requiring SHA-1
- File integrity verification (non-security critical)
- Proof of work algorithms (some older cryptocurrencies)

**Recommended alternatives:**

- SHA-256 or SHA-3 for new applications
- SHA-512 for high-security requirements
