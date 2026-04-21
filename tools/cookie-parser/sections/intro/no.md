## Hva parser dette verktøyet?

Lim inn en Cookie-header fra en forespørsel eller én eller flere Set-Cookie-linjer fra et svar. Parseren trekker ut navn, verdier og ugyldige fragmenter som strukturert JSON for rask inspeksjon.

## Cookie kontra Set-Cookie

Bruk Cookie for headeren som nettleseren sender tilbake til serveren. Bruk Set-Cookie for responshoder som definerer attributter som Path, Max-Age, SameSite, Secure eller HttpOnly.

## Tips for renere resultater

- Du kan lime inn hele headerlinjer eller bare rå cookie-par.
- Flere Set-Cookie-linjer støttes.
- Ugyldige fragmenter listes separat slik at feilaktige par eller attributter blir lette å oppdage.
