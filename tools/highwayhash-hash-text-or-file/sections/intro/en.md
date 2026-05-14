## What is HighwayHash?

HighwayHash is a fast keyed hash function designed by Google for high-throughput fingerprinting and integrity checks. It uses a 256-bit key and can produce 64-bit, 128-bit, or 256-bit output from the same text or file input.

## When to use it

- Build deterministic keyed checksums for cache keys, object IDs, sharding, or internal lookup tables.
- Compare files or text payloads with the same key when speed matters more than broad cryptographic compatibility.
- Generate 128-bit or 256-bit fingerprints when a larger non-password hash is useful for integrity workflows.

## Key and output options

Enter the key as exactly 32 bytes of hexadecimal data, such as `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. The `0x` prefix is optional, and the tool accepts spaces, colons, hyphens, and underscores to make long keys easier to read. Leaving the key blank uses the library default key, which is convenient for quick checks but should not be treated as secret.

## Security notes

HighwayHash is not a replacement for HMAC, digital signatures, or password hashing. Use it for fast keyed fingerprints and checksum workflows, not for proving authenticity across systems that need standard cryptographic verification.
