## JSON in eine Excel-Tabelle umwandeln

Fügen Sie ein JSON-Array ein oder öffnen Sie eine lokale `.json`-Datei. Prüfen Sie die Tabellenvorschau und wählen Sie **XLSX herunterladen**. Der Konverter erstellt ein Arbeitsblatt mit einer Kopfzeile. Jedes Objekt wird zu einer Zeile, und jedes Feld, das im Array vorkommt, erhält eine eigene Spalte. So können Sie API-Datensätze, Produktlisten oder Datenexporte in Excel weiterverarbeiten. Wenn die API-Antwort die Datensätze in einem Feld wie `data` enthält, fügen Sie das Array aus diesem Feld ein.

## Verschachtelte JSON-Felder in Spalten aufteilen

Die Option **Verschachtelte Felder aufteilen** ist standardmäßig aktiviert. Aus den beiden Datensätzen im Beispiel entstehen die Spalten `name`, `contact.city` und `tags`.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Bei deaktivierter Option bleibt `contact` als JSON-Text wie `{"city":"Oslo"}` in einer einzigen Spalte. Arrays bleiben in beiden Modi in einer Zelle, sodass `tags` keine weiteren Zeilen erzeugt. Fehlende Felder und Felder mit dem Wert `null` erscheinen als leere Zellen.

## Welche Werte Excel aus dem JSON übernimmt

Zahlen und boolesche Werte werden normalerweise als Zahlen und Wahrheitswerte in Excel übernommen. Zahlen außerhalb der Genauigkeitsgrenzen oder des Wertebereichs von Excel werden als Text gespeichert, damit alle Ziffern erhalten bleiben. JSON-Zeichenfolgen bleiben Text. Dadurch behalten Kennungen wie `"00123"`, als Text geschriebene Datumsangaben und Text, der mit `=` beginnt, ihre ursprünglichen Zeichen.

## Vorschau und Download im Browser

Die Vorschau zeigt den Anfang des Arbeitsblatts. Der XLSX-Download enthält sämtliche Datensätze und Spalten. Die Umwandlung läuft im Browser, und Ihre JSON-Daten bleiben auf Ihrem Gerät. Für einen Export als reinen Text verwenden Sie den [JSON → CSV Konverter](../json-to-csv-converter/).
