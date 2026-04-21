## What is xxHash (XXH64)?

xxHash is an extremely fast non-cryptographic hash algorithm that focuses on speed and performance while maintaining good distribution properties. XXH64 is the 64-bit variant that produces a 64-bit (8-byte) hash value, typically displayed as a 16-character hexadecimal number.

**Key characteristics:**

- **Extremely fast**: Optimized for speed, much faster than cryptographic hash functions
- **Deterministic**: The same input always produces the same hash
- **Good distribution**: Provides excellent hash distribution for hash tables
- **Non-cryptographic**: Not suitable for security purposes, designed for performance
- **Larger output**: 64-bit hash provides better collision resistance than 32-bit variants
- **Platform optimized**: Uses SIMD instructions when available for maximum speed

**Common uses:**

- Hash tables and data structures
- File integrity checks (non-security)
- Data deduplication
- Checksums for data transmission
- Performance-critical applications
- Database indexing
- Cache keys generation
