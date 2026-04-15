## What is MD5?

MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal number. It was designed by Ron Rivest in 1991 as a successor to MD4.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Fixed output size**: Always produces a 128-bit hash regardless of input size
- **Collision vulnerable**: Known vulnerabilities make it possible to find collisions

**Security status:**
⚠️ **MD5 is cryptographically broken and should not be used for security-critical applications**. Collision attacks were demonstrated in 2004, and practical collision generation became feasible with modern computing power.

**Common uses (current and historical):**

- File integrity verification (non-security critical)
- Checksums for data corruption detection
- Legacy systems requiring MD5
- Database key generation (non-cryptographic)
- Some older protocols and systems

**Recommended alternatives:**

- SHA-256 or SHA-3 for new applications
- SHA-512 for high-security requirements
- BLAKE2 for high-performance applications
