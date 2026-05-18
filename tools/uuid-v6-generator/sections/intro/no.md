UUID v6-generatoren lager tidsbaserte UUID-er som beholder den kjente UUID-formen, samtidig som tidsstempelet plasseres først for naturlig leksikalsk sortering. Den kjører helt i nettleseren din, så genererte identifikatorer og valgfrie nodeverdier forlater aldri siden.

## Når UUID v6 er nyttig

Bruk UUID v6 når du trenger identifikatorer som fortsatt er bredt kompatible med UUID-verktøy, men som også sorteres nær opprettelsesrekkefølgen i logger, databaseindekser, hendelsesstrømmer eller migreringsskript. UUID v6 ligger semantisk nærmest UUID v1: den bruker et gregoriansk tidsstempel, en klokkesekvens og et 48-biters nodefelt, men omorganiserer tidsstempelbitene slik at nyere ID-er sorteres etter eldre ID-er.

## Node-ID-er og personvern

Klassiske UUID v1-generatorer bruker ofte en ekte MAC-adresse som nodefelt. Dette verktøyet bruker som standard en tilfeldig, lokalt administrert node-ID for hver genererte UUID, slik at det ikke eksponerer en maskinvareadresse. Bytt bare til en egendefinert node når du bevisst trenger v1-kompatible resultater for testdata, interoperabilitetssjekker eller kontrollerte systemer.

## Klokkesekvens og egendefinert tid

Klokkesekvensen bidrar til å unngå kollisjoner når tidsstempler gjentas eller klokker går bakover. Den tilfeldige standardsekvensen er tryggest for normal bruk. Egendefinerte tidsstempler, node-ID-er og klokkesekvenser er nyttige for deterministiske eksempler, men gjentatte egendefinerte verdier bør brukes med forsiktighet i produksjonsdata.
