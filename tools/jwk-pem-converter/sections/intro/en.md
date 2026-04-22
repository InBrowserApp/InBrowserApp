## What is JWK ↔ PEM conversion?

JWK (JSON Web Key) is a JSON-based format for cryptographic keys used in JOSE/JWT systems. A JWK can represent RSA, EC, or OKP keys and may appear inside a JWK Set (JWKS).

PEM is a Base64-encoded ASN.1/DER key wrapped with header lines like BEGIN PUBLIC KEY or BEGIN PRIVATE KEY, and it's common in TLS, OpenSSL, and many SDKs.

This tool converts keys in both directions, preserving the key material while choosing public (SPKI) or private (PKCS8) output. Supported types include RSA, EC (P-256/384/521), and OKP (Ed25519/X25519/Ed448/X448), and everything runs locally in your browser.

Choose JWK → PEM when a library, gateway, or CLI expects OpenSSL-style key files. Choose PEM → JWK when you need to embed a key in JWKS, pass it through JSON-based configuration, or work with browser and serverless runtimes. Private key conversion preserves private material, so only share public output when that is all a consumer needs.

- Use a JWK/JWKS key with systems that only accept PEM.
- Export PEM keys for JWT libraries, API gateways, or key distribution.
- Share public keys safely without exposing private key data.
