## What It Does

Verify whether a plain text password matches a bcrypt password hash. This is useful when you are debugging login code, checking imported user records, or confirming that a password migration kept hashes compatible.

## Accepted Input

Paste a standard bcrypt hash such as `$2b$10$...` and enter the password candidate you want to test. The verifier accepts `$2a$`, `$2b$`, and `$2y$` prefixes with cost values from `04` through `31`.

## Reading The Result

A matching result means bcrypt accepted the password for that hash, including the salt and cost embedded in the hash string. A mismatch means the password did not verify; it does not prove that the hash itself is insecure. Invalid hash errors usually mean the prefix, cost, length, or bcrypt base64 characters are malformed.

## Privacy And Security Notes

- Verification runs locally in your browser.
- Passwords and hashes are not stored in local storage.
- bcrypt is designed for password storage, not general-purpose file checksums.
- Use this tool for debugging and validation, not as the only audit of a production authentication system.
