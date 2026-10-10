## Ein Arbeitsblatt in ein übertragbares Format exportieren

Öffnen Sie eine lokale .xlsx-, .xlsm-, .xltx- oder .xltm-Datei oder ziehen Sie sie in den Exporter. Wählen Sie ein Arbeitsblatt anhand seines ursprünglichen Namens aus, einschließlich ausgeblendeter Arbeitsblätter, und wählen Sie CSV, TSV, JSON oder Markdown. Sehen Sie die Ausgabe an, kopieren Sie sie oder laden Sie eine UTF-8-Datei herunter, die nach Arbeitsmappe und Arbeitsblatt benannt ist. Wenn Sie die Datei ersetzen oder schließen, werden laufende Vorgänge abgebrochen und bisherige Downloads entfernt. Der XLSX-Betrachter bietet für das aktuelle Blatt ebenfalls die Aktion „Arbeitsblatt exportieren“.

Der Standardzellbereich ist das kleinste Rechteck, das gespeicherte Werte oder Formeln enthält. Leere Zellen und Zeilen innerhalb dieses Rechtecks bleiben in der Ausgabe erhalten. Sie können einen anderen Bereich eingeben, etwa A1:D20, und „Bereich anwenden“ wählen. Ein leeres Blatt erzeugt eine leere Textdatei oder ein leeres JSON-Array, sofern Sie keinen Bereich ausdrücklich auswählen.

## Darstellung von Werten und Kopfzeilen wählen

Formatierter Text folgt unterstützten Zahlenformaten und erhält angezeigte Datumsangaben und Zahlenformate mit führenden Nullen, soweit verfügbar. Gebietsschemaabhängige Formate können von Excel abweichen. Gespeicherte Werte behalten Zahlen und boolesche Werte bei; Datumsangaben bleiben Excel-Seriennummern, ohne eine Zeitzone zu erhalten. Textzellen behalten ihren Text in beiden Modi. Formeln verwenden ihre gespeicherten Ergebnisse ohne Neuberechnung. Ein fehlendes gespeichertes Ergebnis wird zu einer leeren Zelle, mit einem Hinweis in der Oberfläche. Tabellenfehler bleiben lesbare Zeichenfolgen wie #DIV/0!.

CSV und TSV setzen Felder mit Trennzeichen, Anführungszeichen oder Zeilenumbrüchen in Anführungszeichen. JSON ist ein Array aus Zeilen-Arrays: Die erste Zeile bleibt Teil der Daten, doppelte oder leere Kopfzeilen werden nicht zu Objektschlüsseln, und leere Zellen verwenden null. Markdown kann die erste Zeile als Kopfzeile behandeln oder über allen Datenzeilen eine leere Kopfzeile hinzufügen. Markdown-Satzzeichen, HTML, senkrechte Striche und Zeilenumbrüche in Zellen werden maskiert oder sicher dargestellt. Downloads verwenden UTF-8 ohne Byte-Reihenfolge-Markierung; wählen Sie beim Import in eine andere Anwendung UTF-8.

## Lokale Verarbeitung und Kompatibilität

Ihre Arbeitsmappe bleibt in diesem Browser und wird vom Tool weder hochgeladen noch gespeichert. Makros, Skripte und externe Datenverbindungen werden weder ausgeführt noch aktualisiert. Ausgeblendete Zeilen und Spalten innerhalb des ausgewählten Bereichs werden einbezogen. Verbundene Zellen werden nicht in wiederholte Werte aufgeteilt. Diagramme, Bilder, Kommentare und die Formatierung der Arbeitsmappe gehören nicht zu diesen Textformaten.

Bei verschlüsselten, beschädigten oder nicht unterstützten Arbeitsmappen erscheint eine eindeutige Fehlermeldung. Es gibt keine festen Grenzen für Dateigröße, Arbeitsblätter, Zeilen oder Spalten; ein großer Export kann jedoch den verfügbaren Arbeitsspeicher des Browsers überschreiten. Es werden gespeicherte Daten exportiert; die Arbeitsmappe wird nicht bearbeitet, und es wird nicht garantiert, dass eine andere Tabellenkalkulation reine Textfelder auf dieselbe Weise interpretiert.
