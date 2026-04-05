## What is Base64?

Base64 is useful when a text-based channel needs to carry binary-friendly payloads, such as email bodies, JSON blobs, or small data URLs. It is an encoding layer, not a security layer.

## When to use it

- Quick debugging when an API returns or expects Base64 strings.
- Converting browser text into a safe transport format for logs or payloads.
- Checking whether a pasted Base64 blob decodes into the content you expect.

## What to keep in mind

- Base64 increases size by roughly one third.
- It does not encrypt or hide the original value.
- Invalid padding or broken copy-paste usually shows up as a decode error.
