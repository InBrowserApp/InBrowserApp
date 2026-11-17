## Undersøk SQLite-filer lokalt

Åpne en SQLite 3-database for å bla gjennom tabeller og visninger, undersøke kolonnedefinisjoner, indekser, fremmednøkler og CREATE-setninger eller kjøre en SQL-spørring med kun lesetilgang. Prøv eksempeldatabasen for å utforske arbeidsområdet uten å velge en fil. Filer og spørringer blir i nettleseren og lagres ikke automatisk.

## Kjør spørringer og eksporter resultater

Velg en tabell for å forhåndsvise radene. Rediger SQL-koden og bruk **Kjør spørring** eller **Ctrl/⌘ + Enter** for å kjøre én SELECT-, WITH- eller EXPLAIN-setning. Resultatgrensen begrenser antallet innlastede rader; hver side viser 50 rader. En spørring kan også stoppe når resultatene når 5 MiB eller etter 10 sekunder. Avbryting holder grensesnittet responsivt og laster inn databasens øyeblikksbilde på nytt ved neste spørring.

CSV- og JSON-eksporter inneholder det innlastede resultatet, inkludert rader på andre sider. JSON lagrer kolonnenavn og radmatriser hver for seg, slik at dupliserte navn og NULL-verdier bevares. SQLite-heltall blir nøyaktige desimalstrenger, og BLOB-er blir objekter med en heksadesimal `$blob`-verdi. CSV bruker tomme felt for NULL, setter anførselstegn rundt spesialtegn og setter en apostrof foran tekst som ligner formler, for tryggere bruk i regneark.

## Støttede databaser og begrensninger

Åpne en ukryptert `.db`-, `.sqlite`- eller `.sqlite3`-fil på opptil 50 MiB. Originalfilen endres aldri. Verktøyet laster inn et øyeblikksbilde i minnet, så minnebruken kan overstige filstørrelsen. Tilhørende WAL- og journalfiler importeres ikke; lag en ren kopi etter et sjekkpunkt i databaseprogrammet før du åpner den her. Krypterte databaser, egendefinerte SQLite-utvidelser og redigering av databaser støttes ikke.
