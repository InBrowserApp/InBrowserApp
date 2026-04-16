## What is Base32?

Base32 is a binary-to-text encoding that uses the letters A-Z and digits 2-7. It is commonly used in OTP seeds, DNS-safe tokens, and transfer formats that need case-insensitive text.

## When to use it

- Decoding Base32 secrets or exported values back into their original bytes.
- Inspecting data copied from TOTP provisioning or integration flows.
- Verifying whether pasted Base32 text has valid characters and padding.

## What to keep in mind

- Base32 is an encoding layer, not encryption.
- It expands data more than Base64 and may include optional `=` padding.
- Whitespace is often ignored, but invalid characters still break decoding.
