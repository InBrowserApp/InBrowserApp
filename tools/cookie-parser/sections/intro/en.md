## What does this tool parse?

Paste either a Cookie request header or one or more Set-Cookie response headers. The parser extracts cookie names, values, and malformed fragments into structured JSON so you can inspect them quickly.

## Cookie vs. Set-Cookie

Use Cookie for the header a browser sends back to a server. Use Set-Cookie for response headers that define attributes such as Path, Max-Age, SameSite, Secure, or HttpOnly.

## Tips for cleaner results

- You can paste full header lines or raw cookie pairs.
- Multiple Set-Cookie lines are supported.
- Invalid fragments are listed separately so malformed pairs are easy to spot.
