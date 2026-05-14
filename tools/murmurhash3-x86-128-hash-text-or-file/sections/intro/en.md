## What is MurmurHash3 (x86 128-bit)?

MurmurHash3 is a fast non-cryptographic hash algorithm designed for
repeatable, well-distributed checksums. The x86 128-bit variant returns a
16-byte value, usually shown as 32 hexadecimal characters, which makes it a
better fit than 32-bit hashes when you want a wider identifier for large sets
of records, files, or cache keys.

**Where it helps:**

- **Hash tables and sharding**: Create stable keys for buckets, partitions, or
  lookup tables.
- **Deduplication**: Compare large text or file sets with compact 128-bit
  fingerprints before doing deeper checks.
- **Cache keys**: Produce deterministic identifiers for build artifacts,
  transformed data, or generated content.
- **Non-security integrity checks**: Detect accidental changes during storage or
  transfer when cryptographic guarantees are not required.

**Seed behavior:**

The optional seed is a 32-bit unsigned value. Use the same seed when you need
results to match another system, and leave it at `0` when you do not have a
specific compatibility requirement. Decimal values and `0x` hexadecimal values
are accepted; larger values wrap to the same 32-bit range used by the
algorithm.

**Safety notes:**

MurmurHash3 is not a password hashing, signing, or tamper-proof verification
algorithm. Use SHA-256, HMAC, or a password hashing tool when the output needs
security properties. This tool is best for local, offline, performance-oriented
hashing where speed and stable distribution matter more than attack resistance.
