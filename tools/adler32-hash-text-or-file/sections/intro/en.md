## What is Adler-32?

Adler-32 is a fast checksum algorithm that outputs a 32-bit value (usually 8 hexadecimal characters). It is designed for accidental error detection, not for cryptographic security.

**Key points:**

- **Fast and deterministic**: The same input always returns the same output
- **Integrity check**: Useful for transfer or storage corruption detection
- **Not cryptographic**: Do not use for passwords, signatures, or anti-tampering

**Common uses:**

- File transfer checks
- Archive/package verification
- Lightweight integrity checks
