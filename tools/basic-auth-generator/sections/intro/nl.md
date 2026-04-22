## Wat is Basic Auth?

Basic Auth zet `username:password` in de `Authorization`-header nadat het met Base64 is gecodeerd. Het is eenvoudig en breed ondersteund, maar Base64 is alleen codering en geen versleuteling.

## Wat deze tool genereert

- Een `Authorization: Basic ...`-header om in API-clients te plakken.
- Een direct bruikbaar `curl`-voorbeeld voor snelle tests.
- Alles draait lokaal in de browser.

## Wat je moet onthouden

- Gebruik altijd HTTPS wanneer je Basic Auth-gegevens verstuurt.
- Iedereen die de header ziet, kan de oorspronkelijke gebruikersnaam en het wachtwoord decoderen.
- Basic Auth is handig voor interne tools, stagingomgevingen en snelle API-controles.
