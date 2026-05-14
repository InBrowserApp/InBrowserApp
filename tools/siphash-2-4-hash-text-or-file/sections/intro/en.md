## What is SipHash-2-4?

SipHash-2-4 is a fast keyed hash function designed for short messages and hash-table protection. It uses a 128-bit secret key and produces a 64-bit output, usually displayed as a 16-character hexadecimal value.

## When to use it

- Protect server-side hash tables from hash-flooding attacks when the key stays private.
- Build deterministic keyed checksums for cache keys, sharding, or internal lookup tables.
- Compare text snippets or files with the same key when cryptographic authentication is not required.

## Key format

Enter the key as exactly 16 bytes of hexadecimal data, such as `0x000102030405060708090a0b0c0d0e0f`. The `0x` prefix is optional, and the tool accepts spaces, colons, hyphens, and underscores to make long keys easier to read.

## Security notes

SipHash-2-4 is not a replacement for HMAC, digital signatures, or password hashing. Use it for keyed hash-table and checksum workflows, not for proving authenticity across systems that need cryptographic security guarantees.
