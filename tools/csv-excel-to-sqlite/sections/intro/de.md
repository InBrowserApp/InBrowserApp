## Aus CSV- und Excel-Dateien eine SQLite-Datenbank erstellen

Fügen Sie eine oder mehrere CSV- oder Excel-Dateien (.xlsx oder .xls) hinzu. Aus jeder CSV-Datei und jedem Excel-Arbeitsblatt mit Daten entsteht eine eigene Tabelle in derselben Datenbank. Prüfen Sie die Spalten in der Vorschau und passen Sie bei Bedarf die Tabellennamen an. Wählen Sie anschließend **SQLite-Datenbank erstellen**. Die Umwandlung läuft im Browser und Ihre Dateien bleiben auf Ihrem Gerät.

## Wie aus den Daten SQLite-Tabellen entstehen

Standardmäßig liefert die erste Zeile die Spaltennamen. Deaktivieren Sie für eine Tabelle **Erste Zeile als Spaltennamen verwenden**, um diese Zeile als Daten zu importieren. Die Spalten erhalten dann Namen wie `column_1`. Doppelte Tabellen- oder Spaltennamen erhalten nummerierte Zusätze. Wenn Sie also eine weitere Datei mit demselben Namen hinzufügen, bleiben beide Tabellen erhalten.

Der Konverter erkennt numerische Spalten und behält dabei führende Nullen in Kennungen wie `00123` bei. Leere Zellen werden zu SQL-`NULL`-Werten. Excel-Datumswerte werden als Text im ISO-Format gespeichert, je nach Wert mit oder ohne Uhrzeit. Bei Formelzellen wird das in der Arbeitsmappe gespeicherte Ergebnis übernommen. Wenn die angezeigten Ergebnisse neu berechnet werden müssen, speichern Sie die Arbeitsmappe vorher erneut in Excel.

## Das Ergebnis mit SQL abfragen

Wählen Sie **Im SQLite-Betrachter öffnen**, um die Tabellen anzusehen und eine Abfrage auszuführen. Sie können die `.sqlite`-Datei auch herunterladen und sie mit dem SQLite-Kommandozeilenprogramm, Python oder einer anderen SQLite-Anwendung öffnen. Wandeln Sie zum Beispiel `orders.csv` und eine Excel-Arbeitsmappe mit einem Arbeitsblatt namens `customers` um. Diese Abfrage zählt die Bestellungen je Kunde:

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Wenn Sie das Beispiel anpassen, übernehmen Sie die Tabellen- und Spaltennamen aus Ihrer eigenen Vorschau.
