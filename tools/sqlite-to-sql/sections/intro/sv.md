## Exportera SQLite till en SQL-fil

Öppna eller släpp en SQLite 3-databasfil, till exempel `.db`, `.sqlite` eller `.sqlite3`. Verktyget skapar en SQL-dump automatiskt. Slå på **Endast schema** om du vill exportera strukturen utan tabellrader. Välj sedan **Ladda ned .sql** för att spara hela skriptet. Prova exempeldatabasen för att se hur resultatet ser ut.

## Vad en SQL-dump från SQLite innehåller

En SQL-dump är ett textskript som återskapar en databas. Den innehåller `CREATE`-satser för tabeller, index, vyer och utlösare. En fullständig export innehåller även `INSERT`-satser för tabellraderna. Använd dumpen för att granska schemaändringar i Git, spara en läsbar säkerhetskopia eller flytta databasen till en annan SQLite-miljö.

Källfilen stannar på din enhet. Om databasen använder WAL (write-ahead logging), exportera en fristående kopia med programmet som skapade databasen eller med SQLites säkerhetskopieringskommando. Då följer även bekräftade ändringar i loggen med i kopian.

## Återställa databasen från SQL-dumpen

Kör följande kommando för att importera skriptet till en ny SQLite-databas.

```sh
sqlite3 restored.sqlite < database.sql
```

Byt ut `database.sql` mot namnet på filen du laddade ned. Skriptet använder SQLite-syntax. Om databasen använder virtuella tabeller eller tillägg, återställ den i en SQLite-installation som har de moduler som behövs.

Öppna [SQLite-visaren](../sqlite-viewer/) för att bläddra bland tabeller eller exportera frågeresultat som CSV eller JSON. Använd [Konvertera CSV och Excel till SQLite](../csv-excel-to-sqlite/) för att skapa en databas från kalkylblad.
