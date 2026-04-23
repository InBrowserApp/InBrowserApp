## What is Data URI?

Data URI (or data URL) embeds small files directly inside text. Format: `data:[mime][;charset][;base64],data`.

**Common uses:**

- Inline images or fonts in HTML/CSS
- Store small assets in JSON/configs

**Notes:**

- Best for small files; large strings can slow pages
- Base64 is common for binary data

### Example

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Everything before the comma describes the file, such as its MIME type and whether it uses Base64. Everything after the comma is the encoded payload.

### When to use this converter

- Turn a local file into an embeddable string for HTML, CSS, JSON, or email markup
- Create a quick self-contained demo without hosting the asset anywhere else
- Inspect the detected MIME type before pasting the result into another tool

### Practical limits

- Data URIs work best for small files such as icons, tiny images, or short snippets
- Base64 adds roughly 33% overhead, so the final string is larger than the original file
- Very long strings can be awkward to paste into forms, configs, or editors with size limits
