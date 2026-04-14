## What It Does

Dekodieren Sie den HTTP Basic Authorization Header, um Benutzername und Passwort aus Base64 zu extrahieren. Nützlich zum Debuggen und API-Tests.

## Accepted Input

Füge ein wie: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
