Generer UUID v1-identifikatorer lokalt i nettleseren når du trenger verdier som inneholder opprettelsestid og en nodeidentifikator. Dette verktøyet er nyttig for eldre integrasjoner, databaseimport, sorterte testdata og systemer som fortsatt forventer RFC 4122 versjon 1 UUID-er.

## Når UUID v1 hjelper

UUID v1 lagrer et tidsstempel, en klokkesekvens og en 48-biters nodeverdi i en standard UUID-streng på 36 tegn. Det gjør genererte ID-er omtrent sorterbare etter opprettelsestid, samtidig som de fortsatt passer i systemer som godtar vanlige UUID-kolonner, URL-er, logger og API-nyttelaster.

## Personvern og nodeidentifikatorer

Klassisk UUID v1-generering brukte en ekte MAC-adresse fra et nettverkskort, noe som kan eksponere maskinvareinformasjon. Dette verktøyet starter i stedet med en lokalt administrert tilfeldig MAC-adresse. Du kan angi en bestemt nodeverdi når du skal matche et eldre system, men unngå å bruke ekte maskinvareadresser i offentlige eksempler eller delte data.

## Klokkesekvens og partigenerering

Klokkesekvensen er en 14-biters verdi som bidrar til å unngå kollisjoner når samme node genererer ID-er omtrent samtidig. Partigenerering holder alle ID-er i samme millisekund og øker 100-nanosekund-tikken for hver rad, slik at hver verdi i resultatet forblir unik.
