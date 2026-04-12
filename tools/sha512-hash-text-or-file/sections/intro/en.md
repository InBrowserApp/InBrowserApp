## What is SHA-512?

SHA-512 (Secure Hash Algorithm 512-bit) is a cryptographic hash function that produces a 512-bit (64-byte) hash value, typically rendered as a 128-character hexadecimal number. It is part of the SHA-2 family of hash functions designed by the NSA and published by NIST.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Irreversible**: Computationally infeasible to reverse the hash to find the original input
- **Collision resistant**: Very difficult to find two different inputs that produce the same hash

**Common uses:**

- Digital signatures and certificates
- Blockchain and cryptocurrency (Bitcoin uses SHA-256, but SHA-512 is used in other systems)
- Password storage (with proper salting)
- File integrity verification
- Proof of work algorithms
