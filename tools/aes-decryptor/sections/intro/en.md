AES decryption restores plaintext from data encrypted with the same AES key material. This tool is designed for the JSON envelope produced by the InBrowser.App AES Encryptor. The envelope keeps the algorithm, key derivation settings, salt, IV, ciphertext, and plaintext metadata together, while the password or raw key remains separate.

All work happens locally with the browser Web Crypto API. The encrypted JSON, password, raw key, and decrypted result are not uploaded.

## When To Use This Tool

Use it when someone gives you an `inbrowser-aes-v1` JSON envelope or when you need to recover a note, token, configuration snippet, or file that you encrypted earlier with the matching AES Encryptor page.

If the envelope was created with a password, enter the same password and the tool will reuse the stored PBKDF2 hash, iteration count, salt, AES mode, and key length. If the envelope was created with a raw key, paste the exact hexadecimal key length recorded in the envelope.

## Practical Notes

AES-GCM authenticates the encrypted data, so wrong keys or changed JSON should fail instead of returning altered plaintext. AES-CBC and AES-CTR can decrypt compatible envelopes, but they do not authenticate ciphertext by themselves.

Keep the password or raw key separate from the JSON envelope. Anyone with both the envelope and the key material can recover the plaintext. For file envelopes, the recovered download uses the original filename and media type stored in the JSON.
