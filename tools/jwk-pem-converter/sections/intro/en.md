## What is JWK ↔ PEM conversion?

JWK (JSON Web Key) is JSON-shaped key material used by JOSE/JWT, JWKS endpoints, and serverless or browser configuration. It is easy for software to read, but less accepted by CLIs and infrastructure that expect key files.

PEM wraps DER key data with BEGIN/END labels, which is what OpenSSL, TLS tooling, API gateways, and many SDKs usually ask for.

This converter bridges those formats locally in your browser. It handles RSA, EC (P-256/384/521), and OKP key containers, lets you choose public SPKI or private PKCS8 PEM when starting from JWK, and can turn supported PEM blocks back into pretty or compact JWK JSON.

Use public output when you only need verification or distribution. Private conversions expose private key material on screen and in downloads, so treat the result like a secret and close the tab when you are done.

- Move keys between JWKS/JSON config and OpenSSL-style PEM files.
- Extract a public key before sharing with JWT verifiers, gateways, or clients.
- Convert locally without uploading key material to a server.
