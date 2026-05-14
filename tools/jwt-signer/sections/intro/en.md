## What is a JWT signer?

A JWT signer creates a compact JSON Web Token by serializing a header and payload, then signing them with a secret or private key. The result is the three-part `header.payload.signature` token used by many API, OAuth, and session systems.

## When to use this tool

- Create local test tokens for API development, staging environments, and demos.
- Compare how different algorithms change the token header and signature.
- Add claims such as `sub`, `iss`, `aud`, `exp`, `iat`, `scope`, or custom application fields without writing a throwaway script.
- Generate tokens with HMAC shared secrets or with RSA/ECDSA private keys in PKCS#8 PEM or JWK form.

## What to check before using a signed token

- Match the algorithm to the key type: `HS*` uses a shared secret, `RS*` and `PS*` use RSA private keys, and `ES*` uses EC private keys.
- Add expiry and audience claims when the receiving service expects them.
- Keep production private keys out of shared browsers and machines. This tool runs locally, but it cannot protect keys from an already compromised device.
- Remember that signing is not encryption. Anyone who receives the token can decode the header and payload.
