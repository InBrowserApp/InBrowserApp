## What this tool converts

This converter treats a UUID as the 128-bit value it really is and keeps the
common representations in sync. Paste a UUID, Base64 value, hexadecimal string,
decimal integer, octal value, or binary value, and the other formats update
locally in your browser.

## How to read the formats

The UUID field shows the canonical hyphenated form. Hexadecimal is the same 16
bytes as 32 lowercase hex digits. Base64 is standard padded Base64 for the raw
16 bytes, not Base64 for the text characters of the UUID. Decimal, octal, and
binary show the UUID as one unsigned 128-bit integer; the binary output is
left-padded to all 128 bits so leading zeroes stay visible.

## What to watch for

Values outside the 128-bit UUID range are rejected. Base64 input must decode to
exactly 16 bytes. The converter accepts common pasted variants such as
uppercase UUIDs, `urn:uuid:` prefixes, braces, compact 32-hex UUIDs, whitespace
around long numeric values, and URL-safe Base64. Nothing is uploaded while you
convert or generate the sample UUID.
