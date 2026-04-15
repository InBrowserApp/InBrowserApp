## What is SHA-224?

SHA-224 (Secure Hash Algorithm 224-bit) is a cryptographic hash function that produces a 224-bit (28-byte) hash value, typically rendered as a 56-character hexadecimal number. It is part of the SHA-2 family of hash functions designed by the NSA and published by NIST.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Irreversible**: Computationally infeasible to reverse the hash to find the original input
- **Collision resistant**: Very difficult to find two different inputs that produce the same hash

**Common uses:**

- Digital signatures and certificates
- Blockchain and cryptocurrency (some systems use SHA-224)
- Password storage (with proper salting)
- File integrity verification
- Proof of work algorithms
