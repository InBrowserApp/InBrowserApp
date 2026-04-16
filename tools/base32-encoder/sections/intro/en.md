## What is Base32?

Base32 is useful when a text-only or case-insensitive channel needs to carry binary data, such as OTP secrets, DNS-safe tokens, or exported configuration values. It is an encoding layer, not a security layer.

## When to use it

- Encode bytes, text, or files before sending them through text-only channels.
- Prepare OTP secrets, exported settings, or binary blobs for systems that expect Base32 input.
- Convert raw file bytes into a copyable string for transport, logging, or manual entry.

## What to keep in mind

- Base32 expands data more than Base64.
- It does not encrypt or hide the original value.
- Some systems require `=` padding, while others accept unpadded output, so match the receiver.
