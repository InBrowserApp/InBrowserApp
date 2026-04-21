## What is xxHash (XXH32)?

xxHash is an extremely fast non-cryptographic hash algorithm that focuses on speed and performance while maintaining good distribution properties. XXH32 is the 32-bit variant that produces a 32-bit (4-byte) hash value, typically displayed as an 8-character hexadecimal number.

**Key characteristics:**

- **Extremely fast**: Optimized for speed, much faster than cryptographic hash functions
- **Deterministic**: The same input always produces the same hash
- **Good distribution**: Provides excellent hash distribution for hash tables
- **Non-cryptographic**: Not suitable for security purposes, designed for performance
- **Small output**: 32-bit hash provides compact representation
- **Platform optimized**: Uses SIMD instructions when available for maximum speed

**Common uses:**

- Hash tables and data structures
- File integrity checks (non-security)
- Data deduplication
- Checksums for data transmission
- Performance-critical applications
- Database indexing
- Cache keys generation
