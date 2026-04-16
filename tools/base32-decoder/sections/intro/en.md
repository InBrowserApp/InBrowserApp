## What is Base32?

Base32 is useful when a text-only or case-insensitive channel needs to carry binary data, such as OTP secrets, DNS-safe tokens, or exported configuration values. It is an encoding layer, not a security layer.

## When to use it

- Decoding Base32 secrets or tokens back into their original bytes.
- Inspecting values copied from TOTP setup, integration exports, or config files.
- Checking whether pasted Base32 data has valid characters and padding before use.

## What to keep in mind

- Base32 expands data more than Base64.
- It does not encrypt or hide the original value.
- Some systems omit `=` padding, but invalid characters still cause decode errors.
