## Hva er Basic Auth?

Basic Auth legger `username:password` i `Authorization`-headeren etter Base64-koding. Det er enkelt og bredt støttet, men Base64 er bare koding og ikke kryptering.

## Hva dette verktøyet genererer

- En `Authorization: Basic ...`-header du kan lime inn i API-klienter.
- Et klart `curl`-eksempel for raske tester.
- Alt kjører lokalt i nettleseren.

## Hva du bør huske på

- Bruk alltid HTTPS når du sender Basic Auth-legitimasjon.
- Alle som ser headeren kan dekode det opprinnelige brukernavnet og passordet.
- Basic Auth passer godt for interne verktøy, stagingmiljøer og raske API-sjekker.
