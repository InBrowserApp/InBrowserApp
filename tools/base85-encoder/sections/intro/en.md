## Why Base85 is used

Base85 packs four bytes into five printable characters, which makes it denser than hexadecimal while still being easy to move through logs, documents, PDF/PostScript streams, and debugging tools.

## What this encoder helps with

This tool encodes browser text or uploaded files as Base85 using the ASCII85 or Z85 variants. You can switch variants before encoding, confirm which output a target system expects, and export the result without sending data to a server.

## When to use it

Use it when you need a text-safe representation of binary data, want to verify whether a workflow expects ASCII85 or Z85, or need to prepare payloads for copy-paste, documentation, and offline utilities.
