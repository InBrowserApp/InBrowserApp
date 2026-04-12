## What is NanoID?

NanoID is a compact, URL-safe unique ID generator designed for modern web apps, APIs, and internal tooling. The default format uses 21 characters from a 64-character alphabet, which gives you roughly 126 bits of randomness while still staying short enough for URLs, filenames, and test fixtures.

Everything in this tool runs locally in your browser. Your custom alphabet and generated IDs never leave the page, which makes it practical for quick prototyping, fixture generation, and one-off operational tasks.

**Key points:**

- **URL-safe**: uses A-Z, a-z, 0-9, - and \_.
- **Customizable**: adjust length and alphabet to match constraints.
- **Secure randomness**: uses cryptographic random values in the browser.
- **Plain-text export**: copy or download the current batch when you need seed data, demo content, or import-ready lists.

**Practical guidance:**

- Keep the default 21-character length when you want a strong general-purpose identifier with a very low collision chance.
- Shorter IDs are fine for temporary UI tokens or local mock data, but collision risk rises as you reduce length or generate larger batches.
- A larger alphabet gives more entropy per character, so you can often keep IDs shorter without sacrificing as much uniqueness.
- Custom alphabets should contain only unique characters. Duplicates skew the distribution, so this tool blocks them before generating output.
