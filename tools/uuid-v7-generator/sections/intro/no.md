UUID v7 er et moderne UUID-format som plasserer et Unix-tidsstempel i millisekunder først i identifikatoren og fyller de resterende bitene med tilfeldighet. Dette gjør verdiene globalt unike i praksis, samtidig som de naturlig kan sorteres etter opprettelsestidspunkt.

## Hva dette verktøyet gjør

Denne generatoren oppretter UUID v7-verdier helt i nettleseren. Du kan generere én enkelt identifikator eller en gruppe på opptil 100, og deretter kopiere listen eller laste den ned som en tekstfil for startdata, databaseposter, hendelsesfiksturer eller testnyttelaster.

## Når UUID v7 hjelper

UUID v7 er nyttig når du vil ha ikke-beskrivende identifikatorer som fortsatt sorteres godt i databaser, logger, køer og distribuerte hendelsesstrømmer. Sammenlignet med tilfeldige UUID v4-verdier reduserer UUID v7 omorganisering i indekser fordi nyere poster vanligvis havner nær slutten av et sortert nøkkelrom.

## Merknader om sorterbarhet og sikkerhet

Tidsstempeldelen registrerer millisekunder, ikke en privat eller hemmelig verdi. Hvis en identifikator ikke bør avsløre omtrentlig opprettelsestidspunkt, bør du bruke et helt tilfeldig format i stedet. Innenfor én generert gruppe holder dette verktøyet verdiene monotone for samme millisekund, samtidig som UUID v7-versjons- og variantbitene bevares.
