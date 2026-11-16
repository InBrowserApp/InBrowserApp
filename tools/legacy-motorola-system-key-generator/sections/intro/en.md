## What is a legacy Motorola system key?

A software system key is a `.KEY` file used by compatible Motorola programming software to enable editing of protected trunking-system settings. This generator reproduces the legacy BatLabs-derived format for a System ID. A system key is different from a radio traffic encryption key and does not by itself grant access to a radio network.

## How to use this generator

1. Enter a System ID using 1–4 hexadecimal digits (`0–9`, `A–F`), without a `0x` prefix. Lowercase letters are accepted, and short IDs are padded with leading zeros: `ab` becomes `00AB`.
2. Check the normalized ID, filename, and hexadecimal preview.
3. Download the binary `.KEY` file and load it in compatible legacy programming software. The file is 27 bytes; System ID `1234` produces `SYS01234.KEY`.

## Compatibility limits

This tool follows a published legacy format; compatibility depends on the programming software. It does not support ASTRO 25 Portable CPS (including XTS5000), APX CPS, or Advanced System Keys (ASK). Matching the reference byte format does not verify compatibility with a particular radio or CPS version.

## Privacy

Generation, validation, and file previews run locally in your browser. Your System ID and generated key are not sent to a server.
