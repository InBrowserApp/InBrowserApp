# CSR Generator

A Certificate Signing Request (CSR) is a PKCS#10 message that contains your public key, identifying Subject fields, optional extensions such as Subject Alternative Names, and a signature made with the matching private key. Certificate authorities use the CSR to issue an X.509 certificate without ever receiving your private key.

This generator creates CSRs directly in your browser. You can generate a new RSA or ECDSA key pair, or import an existing unencrypted PEM private key when you need to renew a certificate for a key that is already deployed.

## When to use it

Use a CSR when you need a certificate authority to issue or renew a TLS, S/MIME, client authentication, or internal service certificate. The CSR proves possession of the private key and carries the public identity information that should appear in the certificate.

For public TLS certificates, put hostnames in Subject Alternative Names. The Common Name is still useful for readability and legacy systems, but modern clients validate DNS names and IP addresses from SAN.

## How to generate a CSR

Choose whether to generate a fresh key or import an existing private key. Fill in the Subject fields that matter for your certificate request, then add SAN entries for DNS names, IP addresses, email addresses, or URIs. Generate the CSR and send only the CSR PEM to your certificate authority.

If this tool generates a new key, download and store the private key before leaving the page. If you import a key, the tool generates only the CSR and does not re-export the imported private key.

## Key and format notes

RSA 2048 bits is widely compatible; 3072 or 4096 bits may be preferred for longer-lived internal certificates. ECDSA P-256 is compact and broadly supported, while P-384 or P-521 may be required by stricter policies. The imported-key path supports unencrypted PKCS#8, RSA PRIVATE KEY, and EC PRIVATE KEY PEM blocks.

Private keys are sensitive. Do not paste them into untrusted websites, do not send them to certificate authorities, and do not commit them to source control. This tool runs locally in the browser, but your operational process still needs secure key storage and rotation.
