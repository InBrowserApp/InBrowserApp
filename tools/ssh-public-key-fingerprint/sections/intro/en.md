## What is an SSH public key fingerprint?

An SSH public key fingerprint is a short digest of the public key blob. It gives you a compact value to compare before trusting a key in `authorized_keys`, a server inventory, or a deployment workflow.

OpenSSH commonly shows SHA-256 fingerprints such as `SHA256:...`. Older documentation and some audits still use colon-separated MD5 fingerprints. This tool shows both so you can match modern SSH output and legacy records without sending the key anywhere.

Paste a single public key, several `authorized_keys` lines, or an SSH2 public key block. The parser skips comments and authorized_keys options, reads the real SSH key blob, and calculates the fingerprints locally in your browser.

- Verify that a copied public key matches the fingerprint shared by a teammate.
- Compare `authorized_keys` entries against a server access list.
- Inspect key type, key size, curve, and comment before copying a fingerprint.
