## SQLite exporteren naar een SQL-bestand

Open of sleep een SQLite 3-databasebestand, zoals een `.db`-, `.sqlite`- of `.sqlite3`-bestand. De tool maakt automatisch een SQL-dump. Schakel **Alleen het schema** in om de structuur zonder de tabelrijen te exporteren. Kies vervolgens **.sql downloaden** om het volledige script op te slaan. Probeer de voorbeelddatabase om de uitvoer te bekijken.

## Wat staat er in een SQLite SQL-dump?

Een SQL-dump is een tekstscript waarmee je een database opnieuw kunt opbouwen. De dump bevat `CREATE`-instructies voor tabellen, indexen, views en triggers. Bij een volledige export komen er `INSERT`-instructies voor de tabelrijen bij. Je kunt wijzigingen in het schema bekijken in Git, een leesbare back-up bewaren of de database overzetten naar een andere SQLite-omgeving.

Het bronbestand blijft op je apparaat. Gebruikt de database een write-ahead log (WAL)? Exporteer dan een zelfstandige kopie. Gebruik de oorspronkelijke toepassing of de back-upopdracht van SQLite om ook de vastgelegde wijzigingen uit het logboek op te nemen.

## De SQL-dump herstellen

Voer deze opdracht uit om het script in een nieuwe SQLite-database te importeren.

```sh
sqlite3 restored.sqlite < database.sql
```

Vervang `database.sql` door de naam van het gedownloade bestand. Het script gebruikt SQLite-syntaxis. Voor databases met virtuele tabellen of extensies heb je bij het herstellen een SQLite-installatie met de benodigde modules nodig.

Open de [SQLite-viewer](../sqlite-viewer/) om tabellen te bekijken of queryresultaten te exporteren als CSV of JSON. Gebruik [CSV en Excel naar SQLite converteren](../csv-excel-to-sqlite/) om een database te maken van spreadsheets.
