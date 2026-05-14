## What is scrypt?

scrypt is a memory-hard password-based key derivation function (KDF). It turns a password and salt into deterministic key bytes while intentionally spending CPU time and memory, which makes large-scale password guessing more expensive than simple hashing.

**Key points:**

- Uses `N` (cost factor), `r` (block size), and `p` (parallelism)
- Higher `N` and `r` settings increase memory and compute cost
- Produces the same derived key only when the password, salt, parameters, and output length match

**Best practices:**

- Use a unique random salt for every password or secret
- Store `N`, `r`, `p`, salt format, and output length next to the derived key
- Tune parameters on the slowest device you need to support before using them in production
