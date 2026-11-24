## Lag en SQLite-database av CSV- og Excel-filer

Legg til én eller flere CSV- eller Excel-filer (.xlsx eller .xls). Hver CSV-fil og hvert Excel-regneark med data blir en egen tabell i samme database. Sjekk kolonnene i forhåndsvisningen, og gi tabellene nye navn ved behov. Velg deretter **Opprett SQLite-database**. Konverteringen skjer i nettleseren, og filene blir på enheten din.

## Slik blir regnearkdata til tabeller

Som standard brukes den første raden som kolonnenavn. Slå av **Bruk første rad som kolonnenavn** for en tabell hvis raden skal importeres som data. Kolonnene får da navn som `column_1`. Tabell- og kolonnenavn som forekommer flere ganger, får et nummer til slutt. Legger du til en fil til med samme navn, blir dermed begge tabellene beholdt.

Konvertereren gjenkjenner kolonner med tall og beholder innledende nuller i tekstkoder som `00123`. Tomme celler får SQL-verdien `NULL`. Datoer fra Excel lagres som tekst i ISO-format, med eller uten klokkeslett. For celler med formler brukes resultatet som er lagret i arbeidsboken. Hvis resultatene som vises, må beregnes på nytt, lagrer du arbeidsboken på nytt i Excel først.

## Kjør SQL-spørringer mot databasen

Velg **Åpne i SQLite-viseren** for å bla gjennom tabellene og kjøre en spørring. Du kan også laste ned `.sqlite`-filen og åpne den via kommandolinjeverktøyet til SQLite, i Python eller i en annen SQLite-app. Konverter for eksempel `orders.csv` og en Excel-arbeidsbok med et regneark som heter `customers`. Denne spørringen teller hvor mange bestillinger hver kunde har:

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Bruk tabell- og kolonnenavnene fra din egen forhåndsvisning når du tilpasser eksemplet.
