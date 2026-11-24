## Eksporter SQLite til en SQL-fil

Åpne eller slipp en SQLite 3-databasefil, for eksempel `.db`, `.sqlite` eller `.sqlite3`. Verktøyet genererer en SQL-dump automatisk. Slå på **Bare skjema** hvis du vil eksportere strukturen uten tabellrader. Velg deretter **Last ned .sql** for å lagre hele skriptet. Prøv eksempeldatabasen for å se hvordan resultatet ser ut.

## Hva en SQL-dump fra SQLite inneholder

En SQL-dump er et tekstskript som gjenskaper en database. Den inneholder `CREATE`-setninger for tabeller, indekser, visninger og triggere. En fullstendig eksport inneholder også `INSERT`-setninger for tabellradene. Bruk dumpen til å gjennomgå skjemaendringer i Git, ta en lesbar sikkerhetskopi eller flytte databasen til et annet SQLite-miljø.

Kildefilen blir på enheten din. Hvis databasen bruker WAL (write-ahead logging), eksporter en frittstående kopi med programmet som opprettet databasen, eller med SQLite-kommandoen for sikkerhetskopiering. Da kommer også bekreftede endringer fra loggen med i kopien.

## Gjenopprett databasen fra SQL-dumpen

Kjør denne kommandoen for å importere skriptet til en ny SQLite-database.

```sh
sqlite3 restored.sqlite < database.sql
```

Bytt ut `database.sql` med navnet på filen du lastet ned. Skriptet bruker SQLite-syntaks. Hvis databasen bruker virtuelle tabeller eller utvidelser, gjenopprett den i en SQLite-installasjon som har de nødvendige modulene.

Åpne [SQLite-viseren](../sqlite-viewer/) for å bla gjennom tabeller eller eksportere spørringsresultater som CSV eller JSON. Bruk [Konverter CSV og Excel til SQLite](../csv-excel-to-sqlite/) for å lage en database fra regneark.
