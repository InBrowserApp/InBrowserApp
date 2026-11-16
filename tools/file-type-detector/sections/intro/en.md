## How File Type Detection Works

This tool reads up to the first 64 KiB of a local file and checks its binary
signature with [file-type](https://github.com/sindresorhus/file-type). The result
includes a detected MIME type, expected extensions, and a preview of the first
256 bytes in hexadecimal and ASCII. Nothing is uploaded.

## Why an Extension Can Disagree

Renaming a file changes its name, not its content. A PNG named photo.jpg still
has a PNG signature. Common aliases such as .jpg and .jpeg are accepted.
Browser-reported MIME is shown separately because it often follows the filename
instead of inspecting the bytes.

## Detection Limits

Signatures are hints, not proof that a file is valid or safe. Text formats such
as TXT, CSV, and SVG may be unrecognized. A short sample may identify ZIP or
another container without confirming its subtype, such as an Office document.
The hex preview is raw file content, not a cryptographic checksum.
