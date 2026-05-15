The hash tools collection brings the migrated hashing utilities together so you can choose the right algorithm before opening a specific tool. It covers everyday file digests, legacy compatibility checks, keyed message authentication, Subresource Integrity strings, password hashing, password verification, and fast non-cryptographic checksums.

## When to use these tools

Use the cryptographic digest tools when you need a repeatable fingerprint for text or a file, such as comparing a downloaded archive against a published SHA-256 checksum. Use HMAC when the result must prove that someone with a shared secret created or approved the message. Use Argon2, bcrypt, PBKDF2, or scrypt for password and key-derivation workflows, where configurable cost matters more than raw speed.

## Choosing safely

Not every hash is suitable for security. MD4, MD5, and SHA-1 are useful for legacy systems and compatibility checks, but they should not be used for new security-sensitive integrity designs. CRC, Adler-32, MurmurHash, CityHash, and xxHash are fast checksums or bucketing hashes, not tamper-resistant signatures. When you are not sure, prefer SHA-256 for public checksums, HMAC-SHA-256 for keyed verification, and Argon2id or bcrypt for password storage.

## Privacy and workflow

The individual tools in this collection run in the browser. Text and files are processed locally by the selected tool unless that tool explicitly documents a public lookup behavior, which the hash tools do not need. For sensitive material, clear generated values after use and avoid pasting secrets into shared or recorded browser sessions.
