## Hva er en UUID-validator?

En UUID-validator sjekker om en identifikator er skrevet i den standardiserte UUID-formen med 36 tegn, for eksempel `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Den er nyttig når du må verifisere ID-er kopiert fra logger, API-er, databaser, testdata eller brukerinndata før du stoler på dem i kode.

### Støttet inndata

Dette verktøyet validerer kanonisk UUID-tekst med fem heksadesimale grupper i `8-4-4-4-12`-oppsettet. Store bokstaver godtas og normaliseres til små bokstaver. Nil-UUID-en (`00000000-0000-0000-0000-000000000000`) og max-UUID-en (`ffffffff-ffff-ffff-ffff-ffffffffffff`) behandles som gyldige spesialverdier.

### Valideringsdetaljer

For standard-UUID-er sjekker validatoren versjonsnibbelen og variantbitene. Versjon 1 til 8 gjenkjennes, inkludert eldre RFC 4122 UUID-er og nyere RFC 9562-oppsett som UUID v6, v7 og v8. Resultatpanelet deler også UUID-en inn i de fem segmentene, slik at du kan inspisere de eksakte byteverdiene som valideres.

### Personvern

Valideringen kjøres helt og holdent i nettleseren din. UUID-en du limer inn, lastes ikke opp, så verktøyet er trygt å bruke med interne identifikatorer, databasenøkler og eksempler fra produksjonslogger som bør forbli lokale.
