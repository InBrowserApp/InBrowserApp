## What is RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) is a cryptographic hash function that produces a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal number. It is part of the RIPEMD family developed in Europe as an alternative to MD4/MD5.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Fixed output size**: Always produces a 128-bit hash regardless of input size
- **One-way**: Computationally infeasible to recover the original input from the hash

**Common uses:**

- Data integrity checks
- Fingerprinting and deduplication
- Legacy system compatibility
