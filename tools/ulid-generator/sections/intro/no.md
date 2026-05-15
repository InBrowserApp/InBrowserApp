Generer ULID-er lokalt i nettleseren for poster, hendelser, logger, fiksturer og distribuerte systemer som trenger kompakte identifikatorer med tidssorterbare prefikser. Hver verdi opprettes på denne enheten og kan kopieres eller lastes ned uten å sende batchen til en annen tjeneste.

## Hvorfor bruke ULID

ULID står for Universally Unique Lexicographically Sortable Identifier. Den kombinerer et 48-biters Unix-millisekund-tidsstempel med 80 biter tilfeldighet, og koder deretter resultatet som en Crockford Base32-streng på 26 tegn. Denne formen gjør ULID-er URL-sikre, databasevennlige og naturlig sorterbare etter opprettelsestid.

## Gjeldende eller egendefinert tid

Bruk gjeldende tid for vanlige programposter, importnøkler og testdata som skal gjenspeile når de ble opprettet. Bytt til et egendefinert tidsstempel når du trenger deterministisk utseende eksempler, tilbakefylte rader, avspilte hendelser eller fiksturer som skal sorteres rundt et bestemt tidspunkt.

## Monotone batcher

Når monoton batchmodus er aktivert, øker ID-er som genereres for samme millisekund det tilfeldige segmentet, slik at batchen forblir leksikografisk sortert fra topp til bunn. Deaktiver den når du vil at hver rad skal bruke et nytt tilfeldig segment i stedet. Begge moduser holder tidsstempelet synlig i de ti første tegnene.
