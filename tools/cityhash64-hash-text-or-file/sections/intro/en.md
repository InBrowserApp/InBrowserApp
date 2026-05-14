## What is CityHash64?

CityHash64 is a fast non-cryptographic hash algorithm from Google that produces a 64-bit (8-byte) value. It is useful when you need a compact, deterministic fingerprint for text or files and speed matters more than cryptographic security.

**Key characteristics:**

- **Fast and deterministic**: The same input and seed always produce the same 64-bit hash
- **Non-cryptographic**: Do not use CityHash64 for passwords, signatures, tokens, or tamper-proof integrity checks
- **Seed-aware**: Leave the seed blank for standard CityHash64, or enter a decimal or `0x` hexadecimal seed when you need a separate seeded hash space
- **Local processing**: Text and files are hashed in the browser; uploaded files are not sent to a server
- **Multiple encodings**: Results are shown as hexadecimal, Base64, decimal, and binary values

**Common uses:**

- Hash tables and data structures
- Non-security file fingerprints
- Data deduplication and bucketing
- Cache keys and sharding keys
- Regression fixtures for systems that already use CityHash64
- Database indexing
