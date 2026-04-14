## What is Subresource Integrity (SRI)?

Subresource Integrity (SRI) is a security feature that enables browsers to verify that files they fetch (e.g., from a CDN) haven’t been unexpectedly modified. It works by comparing the cryptographic hash of a resource with a hash provided in the HTML.

**How it works:**

1. Generate a cryptographic hash of your resource file
2. Include the hash in the integrity attribute of script or link tags
3. Browser fetches the resource and calculates its hash
4. Browser compares calculated hash with provided hash
5. If hashes match, resource loads; if not, loading is blocked

**Benefits:**

- **Security**: Protects against malicious modifications of third-party resources
- **CDN protection**: Ensures CDN-served files haven’t been tampered with
- **Supply chain security**: Validates integrity of external dependencies
- **Browser support**: Widely supported across modern browsers

**Supported algorithms:**

- SHA-256 (recommended minimum)
- SHA-384 (recommended)
- SHA-512 (highest security)
