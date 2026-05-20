## What is a CSR?

A Certificate Signing Request (CSR) is a small PKCS#10 document that a certificate authority (CA) needs in order to issue a TLS or code-signing certificate. It bundles together the public half of a key pair, the identity you want the CA to attest to (the Subject), and any extra identifiers like DNS names or IP addresses (the Subject Alternative Names, or SAN), all signed by the matching private key.

This tool builds the CSR entirely in your browser using the Web Crypto API and [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Nothing about your key or your request is sent to a server.

## When to use this tool

- Request a TLS certificate from a public CA (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, etc.) when their workflow asks you to paste your own CSR.
- Generate a CSR for an internal certificate authority — ACME-based, smallstep, EJBCA, AD CS — without trusting a hosted form.
- Re-issue a certificate with the same private key by importing an existing PKCS#8 PEM key and only signing a new CSR.

## How to fill in the form

- **Key source** — pick *Generate new* to create a fresh key pair, or *Import existing* to paste an unencrypted PKCS#8 PEM key. Encrypted keys, legacy `RSA PRIVATE KEY`, and `EC PRIVATE KEY` blocks are not accepted; convert them with `openssl pkcs8 -topk8 -nocrypt` first.
- **Algorithm** — RSA is the broadest compatibility default. ECDSA produces smaller signatures and is widely supported by modern CAs and TLS clients.
- **Subject** — most public CAs ignore everything but the Common Name and treat the DNS SAN list as authoritative, but private CAs may still need a full DN.
- **SAN entries** — list the hostnames, IPs, email addresses, or URIs you want the certificate to cover. One per line, or comma-separated.

## What to keep in mind

- The private key shown alongside the CSR is generated locally and never leaves your browser. Save it before closing the tab — without the matching private key, the signed certificate is unusable.
- Public CAs require the Common Name (or at least one SAN entry) to be a DNS name they can validate against. IP-address SANs are mostly useful for internal certificates.
- The generated private key is unencrypted. Add a passphrase with `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` if you need one before storing it.
- Only RSA (2048/3072/4096) and ECDSA (P-256/P-384/P-521) are supported. EdDSA is intentionally omitted because acceptance across browsers and CAs is still inconsistent.
