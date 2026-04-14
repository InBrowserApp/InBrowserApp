## What It Does

Dekode header HTTP Basic Authorization untuk mengekstrak nama pengguna dan kata sandi dari Base64. Berguna untuk debugging dan pengujian API.

## Accepted Input

Tempelkan sesuatu seperti: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
