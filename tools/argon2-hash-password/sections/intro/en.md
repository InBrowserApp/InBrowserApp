## What is Argon2?

Argon2 is a password hashing algorithm designed to make offline password cracking expensive. It combines repeated computation with a configurable memory cost, so attackers need both time and memory for every password guess.

**Why Argon2id is usually the default:**

- It balances resistance to side-channel attacks and GPU cracking better than using Argon2i or Argon2d for most password storage systems
- The encoded output stores the algorithm, version, memory, iteration, parallelism, salt, and hash in one portable string
- A unique random salt prevents identical passwords from producing identical stored hashes
- Memory and iteration settings can be increased as your verification environment gets faster

**How to use this tool:**

1. Enter the password you want to hash.
2. Keep the generated salt or create a new random salt.
3. Choose the Argon2 variant and tune memory, iterations, parallelism, and hash length for the system that will verify the hash.
4. Generate the encoded hash and store that full string in your application database.

**Security notes:**

- Do not store or log the plain password.
- Use a new random salt for every password.
- Use the optional secret only if your verifier also has that same secret; otherwise the hash cannot be verified later.
- Prefer the highest memory and iteration settings that keep sign-in latency acceptable for real users.
