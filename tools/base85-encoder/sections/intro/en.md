## What is Base85?

Base85 is a binary-to-text encoding that turns 4 bytes into 5 printable characters. It is denser than Base64, and this tool lets you choose either ASCII85 or Z85 depending on the format your receiver expects.

## When to use it

- Encode raw bytes, text, or files for text-only channels while keeping the output relatively compact.
- Use ASCII85 when you need a flexible Base85 format that can handle trailing partial bytes.
- Use Z85 when you need ZeroMQ-compatible Base85 text and your input length is an exact multiple of 4 bytes.

## What to keep in mind

- Base85 is an encoding format, not encryption.
- ASCII85 and Z85 use different alphabets, so they are not interchangeable.
- Z85 rejects source data whose byte length is not divisible by 4, while ASCII85 can encode partial trailing blocks.
