## What It Does

Dekodér HTTP Basic Authorization-headeren for å hente brukernavn og passord fra Base64. Nyttig for feilsøking og API-testing.

## Accepted Input

Lim inn noe som: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
