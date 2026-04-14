## What It Does

Zdekoduj nagłówek HTTP Basic Authorization, aby wyodrębnić nazwę użytkownika i hasło z Base64. Przydatne do debugowania i testowania API.

## Accepted Input

Wklej coś w rodzaju: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
