## Utforsk SQLite-databaser i nettleseren

Åpne en SQLite 3-database for å bla gjennom tabeller og visninger, undersøke kolonner, indekser, fremmednøkler og CREATE-setninger eller kjøre en SQL-spørring med kun lesetilgang. Prøv eksempeldatabasen for å utforske arbeidsområdet. Filen behandles lokalt og endres aldri.

## Kjør spørringer og eksporter resultater

Velg en tabell eller visning for å laste inn radene, og rediger deretter SQL-koden for å filtrere, sortere eller koble sammen data. Kjør én SELECT-, WITH- eller EXPLAIN-setning med **Kjør spørring** eller **Ctrl/⌘ + Enter**. Klikk på en celle for å undersøke og kopiere hele verdien.

Velg en resultatgrense på 100, 1000 eller 10 000 rader, og bla gjennom resultatet med 50 rader per side. Spørringer har en grense på 10 sekunder, og resultatstørrelsen er begrenset til 5 MiB. CSV- og JSON-eksporter inkluderer alle innlastede rader fra alle sider.

JSON bruker separate kolonnenavn og radmatriser for å bevare dupliserte navn og NULL-verdier. Heltall er nøyaktige desimalstrenger, og BLOB-er inneholder en heksadesimal `$blob`-verdi. CSV inkluderer en overskriftsrad, bruker tomme felt for NULL og setter en apostrof foran tekst som ligner formler.

## Støttede SQLite-filer

Åpne en ukryptert `.db`-, `.sqlite`- eller `.sqlite3`-fil på opptil 50 MiB. For en database som bruker WAL, lag en kopi etter et sjekkpunkt før du åpner den; tilhørende WAL- og journalfiler lastes ikke inn. Egendefinerte SQLite-utvidelser støttes ikke. Filer og spørringer lagres ikke automatisk.
