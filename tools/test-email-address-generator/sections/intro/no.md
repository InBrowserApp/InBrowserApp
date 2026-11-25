## Generer flere e-postadresser til testing

Velg et domene, angi antallet og klikk på **Generer**. Velg **Tilfeldig eksempeldomene** for å blande domener i samme liste. Hver adresse vises bare én gang per liste. Kopier adressene til et skjema eller regneark, eller last ned en UTF-8-tekstfil med én adresse per linje til bruk som testdata.

## Hvilke e-postdomener kan jeg bruke?

Faker.js genererer adresser på domenene `example.com`, `example.net` og `example.org`. Disse [reserverte eksempeldomenene](https://www.iana.org/help/example-domains) brukes i dokumentasjon og eksempeldata. I adressen `alex.morgan42@example.com` står den lokale delen før `@`. `example.com` er domenet. Bruk ett domene hvis testen krever en fast verdi, eller bland domener for å teste filtrering og import.

## Hva kan jeg teste med disse adressene?

Bruk eksempeladressene til å teste registreringsskjemaer, e-postadresseformater, kontolister eller fjerning av duplikater i en database. Generatoren lager adressene som tekst uten å opprette innbokser. Bruk en innboks du har kontroll over, eller et e-posttestmiljø for utvikling, når du skal teste levering eller bekreftelseslenker.
