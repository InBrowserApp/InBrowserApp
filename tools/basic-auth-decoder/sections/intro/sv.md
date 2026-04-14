## What It Does

Avkoda HTTP Basic Authorization-rubriken för att extrahera användarnamn och lösenord från Base64. Användbart för felsökning och API-testning.

## Accepted Input

Klistra in något som: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
