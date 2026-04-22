## What is BLAKE3?

BLAKE3 is a modern cryptographic hash function derived from BLAKE2. It is designed for very high performance and parallelism while maintaining strong security. It produces a default 256-bit hash and supports extendable output length (XOF).

**Key characteristics:**

- **Extendable output length**: Can produce hashes of any length
- **High performance**: Fast and parallelizable on modern CPUs
- **Deterministic**: The same input always produces the same hash
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Irreversible**: Computationally infeasible to reverse the hash to find the original input
- **Collision resistant**: Very difficult to find two different inputs that produce the same hash
- **Keyed hashing**: Supports an optional 32-byte key for MAC functionality
- **Key derivation**: Can derive subkeys from key material and context

**Common uses:**

- File integrity verification
- Content-addressed storage and deduplication
- Digital signatures and certificates
- Password storage and authentication
- Cryptographic protocols and systems
