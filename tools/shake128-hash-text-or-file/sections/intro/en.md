## What is SHAKE128 (FIPS 202)?

SHAKE128 (FIPS 202) is an extendable-output function (XOF) in the SHA-3 family. Unlike fixed-length hash functions, it can return any number of output bits while offering 128-bit security strength. It is standardized by NIST and built on the Keccak sponge construction.

That flexibility matters when a protocol, file format, or internal checksum rule expects a specific digest length. In this tool you can hash plain text or uploaded files and choose the output length in bits, as long as it is a multiple of 8.

Common uses include protocol hashing, key derivation, variable-length cryptographic digests, and data-integrity workflows where the same input and output length must always produce the same result.
