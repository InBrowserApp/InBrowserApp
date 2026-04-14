## What It Does

Nyahkod pengepala HTTP Basic Authorization untuk mengekstrak nama pengguna dan kata laluan daripada Base64. Berguna untuk penyahpepijatan dan ujian API.

## Accepted Input

Tampal sesuatu seperti: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
