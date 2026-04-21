## What is SHAKE256 (FIPS 202)?

SHAKE256 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, SHAKE256 can output any number of bits; its security strength is 256 bits. It is standardized by NIST in FIPS 202 and is based on the Keccak sponge construction.

**Key characteristics:**

- **XOF output**: Produce variable-length digests
- **Deterministic**: Same input always yields the same output for the same length
- **Sponge construction**: Built on Keccak
- **Strong security**: 256-bit security strength
- **Flexible**: Useful when you need more (or less) output than fixed-size hashes

**Common uses:**

- Variable-length cryptographic digests
- Key-derivation and protocol hashing
- Checksums and data integrity workflows
