## Wat deze tool doet

Decodeer de HTTP Basic Authorization-header om gebruikersnaam en wachtwoord uit Base64 te halen. Handig voor debuggen en API-tests.

## Geaccepteerde invoer

Plak iets als: Basic dXNlcjpwYXNz
Deze tool accepteert ook een volledige `Authorization: Basic ...`-regel.

## Opmerkingen

- Base64 codeert alleen inloggegevens; het beschermt ze niet.
- De decoder splitst op de eerste `:` en houdt de rest in het wachtwoord.
- Alles draait lokaal in je browser.
