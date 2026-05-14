## What is an X.509 certificate parser?

An X.509 certificate is a signed document that binds a public key to an identity such as a domain, service, organization, or person. TLS certificates, certificate-chain files, and many S/MIME or signing workflows use this format.

This parser reads certificate and public-key material directly in your browser. It can inspect PEM blocks, binary DER files, and base64 DER text, then show the subject, issuer, serial number, validity window, signature algorithm, public-key algorithm, fingerprints, and common extensions.

Use it when you need to compare a certificate fingerprint, check whether a certificate is for the expected host, inspect Subject Alternative Names, confirm key usage, or extract public-key details while debugging TLS and deployment issues.

The tool does not validate trust chains or contact certificate authorities. It shows what is encoded in the certificate or public key you provide, so use a dedicated TLS scanner when you need revocation, chain, hostname, or live endpoint validation.

- Compare SHA-256 or SHA-1 fingerprints before installing or rotating certificates.
- Review SAN, key usage, extended key usage, and basic constraints without uploading certificate material.
- Inspect standalone SPKI public keys when a service gives you only a public-key PEM or DER file.
