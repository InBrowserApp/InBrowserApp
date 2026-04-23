## What is a User-Agent?

A User-Agent (UA) string identifies the browser or app making a request and usually includes browser, OS, device, and engine details. Because UA strings can be spoofed, treat them as hints rather than security signals.

### What this parser shows

This tool parses a pasted UA string locally in your browser and groups the result into browser, operating system, engine, device, CPU, and JSON output. Nothing is uploaded.

### Example

Paste a common Chrome on Windows string like this:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36
```

The parsed result should identify Chrome 115 on Windows 10 with the Blink engine and amd64 CPU architecture.

### Important note

Modern browsers increasingly rely on Client Hints, so a copied UA string may not reveal everything a website can learn during a live request.
