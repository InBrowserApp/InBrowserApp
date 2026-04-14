## What It Does

Decode HTTP Basic Authorization header to extract username and password from Base64. Useful for debugging and API testing.

## Accepted Input

Paste header like: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
