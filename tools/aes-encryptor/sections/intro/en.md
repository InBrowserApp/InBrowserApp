# What Is AES Encryption?

AES is a symmetric encryption algorithm, which means the same secret is used to encrypt and decrypt the data. This tool runs entirely in your browser and uses the Web Crypto API, so plaintext, passwords, and selected files are not uploaded.

The default mode is AES-GCM because it encrypts and authenticates the output. Authentication matters: if the ciphertext, salt, or IV changes later, decryption should fail instead of returning altered data. AES-CBC and AES-CTR are available for compatibility, but they do not authenticate ciphertext by themselves.

## When To Use This Tool

Use it when you need to protect a note, token, configuration snippet, or small file before storing or sharing it through another channel. The output is a JSON envelope containing the mode, key derivation settings, salt, IV, and ciphertext, so those parameters stay together for the matching decrypt step.

For password-based encryption, the password is processed with PBKDF2 and a random salt. Increase the iteration count when you can tolerate slower encryption and decryption. For raw-key encryption, paste a hexadecimal key with exactly the selected length: 32 hex characters for 128-bit, 48 for 192-bit, or 64 for 256-bit.

## Practical Notes

Keep the password or raw key separate from the encrypted JSON. Anyone with both the JSON and the key material can decrypt the data. If you encrypt a file, download the JSON result and keep the original filename separately if that context matters.

Do not reuse a manual IV with the same key. This tool generates a fresh IV and salt for each run, which is the safer default. Prefer AES-GCM unless another system specifically requires AES-CBC or AES-CTR.
