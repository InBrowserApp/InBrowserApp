## Van spreadsheets naar een SQLite-database

Voeg een of meer CSV- of Excel-bestanden (.xlsx of .xls) toe. Elk CSV-bestand en elk Excel-werkblad met gegevens wordt een aparte tabel in dezelfde database. Controleer de kolommen in het voorbeeld en pas zo nodig de tabelnamen aan. Kies daarna **SQLite-database maken**. Je browser voert de conversie uit en je bestanden blijven op je apparaat.

## Hoe spreadsheetgegevens in tabellen terechtkomen

Standaard bevat de eerste rij de kolomnamen. Schakel voor een tabel **Eerste rij gebruiken als kolomnamen** uit om die rij als gegevens te importeren. De kolommen krijgen dan namen zoals `column_1`. Dubbele tabel- of kolomnamen krijgen een nummer achter hun naam. Als je nog een bestand met dezelfde naam toevoegt, blijven beide tabellen behouden.

De converter herkent numerieke kolommen en behoudt voorloopnullen in tekstcodes zoals `00123`. Lege cellen worden SQL-`NULL`-waarden. Excel-datums worden opgeslagen als tekst in ISO-notatie, met of zonder tijd. Voor formules neemt de converter de resultaten over die in de werkmap zijn opgeslagen. Sla de werkmap eerst opnieuw op in Excel als de weergegeven resultaten opnieuw moeten worden berekend.

## Het resultaat opvragen met SQL

Kies **Openen in SQLite-viewer** om de tabellen te bekijken en een query uit te voeren. Je kunt het `.sqlite`-bestand ook downloaden en openen via de SQLite-opdrachtregel, met Python of in een andere SQLite-app. Converteer bijvoorbeeld `orders.csv` en een Excel-werkmap met een werkblad met de naam `customers`. Met deze query tel je het aantal bestellingen per klant:

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Gebruik bij het aanpassen van dit voorbeeld de tabel- en kolomnamen uit je eigen voorbeeldweergave.
