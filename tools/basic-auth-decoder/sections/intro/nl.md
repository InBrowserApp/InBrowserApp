## What It Does

Decodeer de HTTP Basic Authorization-header om gebruikersnaam en wachtwoord uit Base64 te halen. Handig voor debuggen en API-tests.

## Accepted Input

Plak iets als: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
