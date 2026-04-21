## What It Does

This tool parses raw Cookie and Set-Cookie headers into structured JSON directly in your browser. You can paste a single header line, multiple lines, or plain values without the usual prefixes.

## Cookie Vs. Set-Cookie

A Cookie header usually contains multiple name/value pairs sent by the client. A Set-Cookie header usually defines one cookie plus attributes such as Path, Secure, HttpOnly, SameSite, Expires, or Max-Age.

## Notes

The parser runs locally and does not upload headers to a server. Invalid segments stay in a separate list so you can spot malformed cookie strings quickly.
