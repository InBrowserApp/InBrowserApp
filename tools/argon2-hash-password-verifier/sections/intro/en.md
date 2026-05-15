## What is Argon2 verification?

Argon2 verification checks whether a plain password produces the same encoded Argon2 hash that was stored earlier. The encoded hash contains the Argon2 variant, cost parameters, salt, and digest, so a verifier can repeat the same work without needing separate settings.

## When to use this tool

- Confirm that a copied password and stored Argon2 hash belong together
- Debug login or migration issues when moving password records between systems
- Inspect the variant and cost parameters inside an encoded Argon2 hash
- Test hashes that use an optional server-side secret, often called a pepper

## How to verify safely

1. Paste the password you want to check.
2. Paste the full encoded hash, such as a string beginning with `$argon2id$`.
3. Enter the secret only if the original hash was created with one.
4. Run verification and read the match, mismatch, or invalid-hash result.

## Security notes

Verification happens locally in your browser, but pasted passwords and hashes can still remain in browser memory until you reset the form or close the tab. Avoid using production credentials on shared devices. For new password storage systems, Argon2id is usually the preferred Argon2 variant because it balances side-channel and GPU resistance.
