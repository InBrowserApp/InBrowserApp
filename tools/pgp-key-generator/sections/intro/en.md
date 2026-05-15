# PGP Key Generator

Use this tool to create an OpenPGP key pair directly in your browser. It produces an armored public key, private key, revocation certificate, key ID, and fingerprint so you can set up encrypted mail, file encryption, release signing, or account recovery workflows without sending the key material to a server.

## When to use it

PGP keys are useful when you need asymmetric cryptography: other people use your public key to encrypt data for you or verify signatures, while your private key decrypts data and creates signatures. A browser-based generator is convenient for short setup sessions, demos, or local workflows where you want the result immediately.

## How to generate a key pair

Enter a name, email, or both so the key has a recognizable user ID. Add an optional comment if you want to separate work, project, or release-signing keys. Choose ECC for modern OpenPGP software, or RSA when you need compatibility with older tools. A passphrase is optional, but strongly recommended for any private key you intend to keep.

## Key types and expiration

ECC uses Curve25519 and is the default because it is compact and fast. RSA is available at 2048, 3072, and 4096 bits for compatibility. Expiration is set in days; use 0 only for keys that you actively manage and can revoke. Shorter expiration periods reduce long-term risk and make rotation habits easier.

## Handling private keys safely

Download the public key, private key, and revocation certificate as separate files. Back up the private key in an encrypted password manager or secure offline storage, and keep the revocation certificate somewhere separate so you can retire the key if the private key is lost or exposed. Before publishing a public key, compare the fingerprint through a trusted channel.
