## What is HMAC?

HMAC (Hash-based Message Authentication Code) is a cryptographic mechanism that combines a secret key with a hash function to verify both the data integrity and authenticity of a message.

**How it works:**

1. The secret key is combined with the message
2. A hash function (like SHA-256) processes the combined data
3. The result is a fixed-size authentication code

**Common use cases:**

- **API Authentication**: Signing API requests to verify the sender
- **JWT Tokens**: Used in HS256/HS384/HS512 algorithms
- **Message Verification**: Ensuring data hasn't been tampered with
- **Webhook Signatures**: Validating webhook payloads

**Security notes:**

- Always use a strong, random secret key
- Keep your secret key confidential
- SHA-256 or higher is recommended for new applications
- SHA-1 is considered weak and should be avoided for security-critical uses
