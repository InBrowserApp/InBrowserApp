## What is SHA-512/256 (FIPS 180-4)?

SHA-512/256 (FIPS 180-4) is a SHA-2 cryptographic hash function that outputs a 256-bit (32-byte) digest, typically rendered as a 64-character hexadecimal string. It is based on SHA-512 with different initial values and a truncated output, providing a shorter digest while keeping SHA-512's internal structure.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Irreversible**: Computationally infeasible to reverse the hash to find the original input
- **Collision resistant**: Very difficult to find two different inputs that produce the same hash

**Common uses:**

- Digital signatures and certificates
- Integrity checks and checksums
- HMAC constructions
- File verification and data pipelines
- Protocols that require 256-bit hashes
