## What It Does

Decodifica l'intestazione HTTP Basic Authorization per estrarre nome utente e password da Base64. Utile per il debugging e i test API.

## Accepted Input

Incolla qualcosa come: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
