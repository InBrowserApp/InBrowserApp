## What It Does

Décode l'en-tête HTTP Basic Authorization pour extraire le nom d'utilisateur et le mot de passe depuis Base64. Utile pour le débogage et les tests d'API.

## Accepted Input

Collez quelque chose comme : Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.
