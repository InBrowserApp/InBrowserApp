## What is xxHash (XXH3 128)?

XXH3 is the modern xxHash algorithm designed for very high speed and excellent distribution. XXH3 128 outputs a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal string. It is a non-cryptographic hash and supports optional seeding for reproducible hashing.

**Key characteristics:**

- **Extremely fast**: Optimized for performance on large inputs
- **Deterministic**: The same input and seed always produce the same hash
- **Non-cryptographic**: Not suitable for security purposes
- **Good distribution**: Great for hash tables and indexing
- **Seeded**: Optional seed to diversify hash outputs

**Common uses:**

- Hash tables and data structures
- File integrity checks (non-security)
- Data deduplication and chunking
- Cache keys and database indexing
- High-throughput data pipelines
