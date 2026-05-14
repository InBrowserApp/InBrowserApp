## What is a JWT decoder and verifier?

A JSON Web Token is a compact string with three base64url segments: a header, a payload, and a signature. This tool decodes the header and payload in your browser so you can inspect the token structure without sending it to a server.

Signature verification checks whether the token was signed with the key and algorithm you expect. Use a shared secret for HS256, HS384, or HS512 tokens. Use a PEM public key, JWK, or JWKS for RS, PS, and ES tokens.

## When to use it

Use the decoder when debugging authentication flows, checking OAuth or OpenID Connect claims, comparing environments, or confirming that a backend is issuing the expected audience, issuer, subject, expiration, and key identifier values.

Use verification when you have the matching secret or public key and need to confirm that the header, payload, and signature still belong together. The tool also highlights `exp`, `nbf`, and `iat` so common clock and expiry issues are visible immediately.

## Security notes

JWT payloads are only encoded, not encrypted. Anyone with the token can read its claims unless the token is a separate encrypted JWE, which this tool does not process.

Do not paste production tokens or private secrets on shared machines. The tool runs locally in your browser and does not store the token or verification material, but the safest workflow is still to use short-lived test tokens and public keys whenever possible.
