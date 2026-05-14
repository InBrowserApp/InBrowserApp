## What is RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) is a cryptographic hash function that produces a 320-bit (40-byte) hash value, typically rendered as an 80-character hexadecimal number. It is part of the RIPEMD family developed in Europe as an alternative to MD4/MD5.

Use this tool when you need to calculate a RIPEMD-320 digest for pasted text, copied configuration data, or a local file. The calculation runs in your browser, so the file content does not need to be uploaded to a server.

**Key characteristics:**

- **Deterministic**: The same input always produces the same hash
- **Fast computation**: Quick to compute for any given input
- **Avalanche effect**: Small changes in input produce drastically different outputs
- **Fixed output size**: Always produces a 320-bit hash regardless of input size
- **One-way**: Computationally infeasible to recover the original input from the hash

**Common uses:**

- Data integrity checks
- Fingerprinting and deduplication
- Legacy system compatibility

**Security note:**

RIPEMD-320 is mainly useful when a protocol, archive, checksum list, or legacy system already specifies it. For new security-sensitive designs, prefer a currently standardized hash such as SHA-256, SHA-512, SHA-3, or BLAKE3 unless RIPEMD compatibility is required.
