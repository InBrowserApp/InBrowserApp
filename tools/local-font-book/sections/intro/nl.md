## Wat is Local Font Access?

Local Font Access is een browser-API die lokaal geïnstalleerde lettertypen opsomt.

Met deze tool kun je door de resultaten zoeken, verwante varianten vergelijken en een CSS-fragment voor het gekozen lettertype kopiëren.

Werkt alleen in veilige contexten en ondersteunde browsers, met gebruikersrechten (local-fonts).

De API retourneert FontData met family, fullName, postscriptName en style.

### Belangrijke punten

- Gebruik dit om de exacte namen te bevestigen die je nodig hebt voor een CSS-`font-family`-stack op het huidige apparaat.
- Aanroepen moeten door een gebruikersactie worden gestart.
- Permissions Policy kan toegang blokkeren op sommige sites.
- Deze tool blijft lokaal en uploadt geen lettertypen.
