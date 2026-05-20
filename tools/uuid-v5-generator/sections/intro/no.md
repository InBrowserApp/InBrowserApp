Generer UUID v5-identifikatorer fra en namespace-UUID og et navn uten å sende noen av verdiene til en server. UUID v5 er nyttig når du trenger en stabil identifikator som kan gjenskapes senere fra samme inndata, for eksempel en ID for et domenenavn, en URL, en objektsti, et kontonavn eller en testpost.

## Slik Fungerer UUID v5

UUID v5 kombinerer en namespace-UUID med en navnestreng, hasher disse bytene med SHA-1 og bruker deretter versjons- og variantbitene fra RFC 4122. Fordi inndataene er deterministiske, produserer `example.com` i DNS-namespace alltid samme UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Velge Et Namespace

Bruk `ns:DNS` for domenenavn, `ns:URL` for URL-er, `ns:OID` for objektidentifikatorer og `ns:X.500 DN` for X.500 distinguished names. Du kan også lime inn ditt eget UUID-namespace når applikasjonen din trenger identifikatorer avgrenset til et produkt, en tenant, et datasett eller en migrering.

## Når Du Bør Bruke Det

Velg UUID v5 når reproduserbarhet er viktigere enn tilfeldighet. Det passer godt for deterministiske importer, testdata, namespacede poster og systemer som trenger at samme logiske element får samme ID på tvers av kjøringer. For hemmelige tokens eller uforutsigbare offentlige ID-er bør du bruke en tilfeldig generator i stedet.
