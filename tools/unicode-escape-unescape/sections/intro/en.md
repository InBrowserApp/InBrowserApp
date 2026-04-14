## What is Unicode Escaping?

Unicode escaping converts characters into encoded sequences that represent their Unicode code points. This is essential when source code, configuration files, or data formats cannot contain certain characters directly.

**Common escape formats:**

- `\uXXXX` — JavaScript / JSON, used in most programming languages
- `\u{XXXXX}` — ES6+ JavaScript, supports supplementary characters without surrogate pairs
- `&#xXXXX;` / `&#DDDD;` — HTML entities in hexadecimal or decimal form
- `U+XXXX` — Standard Unicode notation used in documentation
- `\xXX` / `%XX` — UTF-8 byte-level encoding, common in URLs and C-like languages
- `\UXXXXXXXX` — Python 8-digit format for any code point
- `0xXXXX` — Hex literal notation

## When to use this tool

- Embedding non-ASCII characters in source code or config files that require ASCII-safe encoding
- Debugging garbled text by inspecting the underlying Unicode code points
- Converting between different escape notations when porting between languages or formats
- Preparing text for JSON, HTML, or URL contexts that need entity-encoded characters

## How it works

Type or paste plain text on the left and the tool escapes non-ASCII characters using the selected format. Paste escaped text on the right and it auto-detects and decodes all supported formats simultaneously. Everything runs locally in the browser.
