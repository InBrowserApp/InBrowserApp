## What is a text or file hash?

A hash function turns text or file bytes into a fixed-length digest. The same input and algorithm always produce the same digest, so hashes are useful when you need a repeatable fingerprint without uploading private data.

## When to use this tool

Use this tool to verify download checksums, compare whether two files are identical, record a quick fingerprint for a text snippet, or debug systems that publish SHA digests. Importing a file hashes the file bytes directly, while text mode hashes the UTF-8 text shown in the editor.

## Choosing an algorithm

SHA-256 is a solid default for new integrity checks. SHA-384 and SHA-512 provide longer SHA-2 digests when another system expects those formats. SHA-1 is included for legacy comparison, but it should not be used for new security-sensitive designs.

## Privacy and limitations

Hashing runs locally in your browser through Web Crypto, and files are not uploaded. A hash is not encryption: it cannot protect a secret by itself, and password storage needs a dedicated password hashing function with a salt and work factor.
