## Text mit Trennzeichen in Excel konvertieren

Öffnen Sie eine lokale CSV- oder TSV-Datei oder legen Sie sie hier ab, prüfen Sie die Zellen und laden Sie eine XLSX-Arbeitsmappe mit einem Arbeitsblatt namens Sheet1 herunter. Wählen Sie das Trennzeichen und die Textkodierung, falls die automatische Erkennung nicht zur Datei passt. TSV-Dateien verwenden standardmäßig Tabulatoren. Das Vorschaufenster begrenzt die exportierten Daten nicht.

## Kennungen und ursprünglichen Text erhalten

CSV und TSV speichern keine Datentypen für Tabellenzellen. Dieser Konverter behält jedes Feld als Text bei, einschließlich führender Nullen, langer Kennungen, dezimal aussehender Zahlen, Datumsangaben und Text, der mit einem Gleichheitszeichen beginnt. Er erkennt Zahlen oder Datumsangaben nicht automatisch und führt keine Formeln aus. Trennzeichen in Anführungszeichen, maskierte Anführungszeichen, Unicode, Zeilenumbrüche innerhalb von Feldern, leere Felder und leere Datensätze bleiben erhalten. Kürzere Zeilen lassen Zellen leer. Ein abschließender Zeilenumbruch beendet den letzten Datensatz, statt eine weitere Zeile hinzuzufügen.

Die Einstellung für die erste Zeile bietet normale Daten oder eine Kopfzeile mit Excel-Filtern. Beide Optionen behalten die Zeile unverändert bei, einschließlich doppelter oder leerer Überschriften. Die automatische Kodierung unterstützt UTF-8 und UTF-16 mit Byte-Reihenfolge-Markierung. Andere Kodierungen können manuell ausgewählt werden. Eine führende sep=-Anweisung wird nur weggelassen, wenn die automatische Trennzeichenerkennung ausgewählt ist oder ihr Trennzeichen dem ausgewählten Trennzeichen entspricht.

Fehlerhaft in Anführungszeichen gesetzte Felder, ungültige Textkodierung und Daten, die die Excel-Grenzen für Zeilen, Spalten oder Zelltext überschreiten, führen zu einer Fehlermeldung statt zu einer gekürzten Arbeitsmappe. Prüfen Sie wichtige Werte nach dem Herunterladen in einer Tabellenkalkulation.

## Lokale Verarbeitung

Die Konvertierung erfolgt in diesem Browser, ohne die Datei hochzuladen. Wenn Sie die Importeinstellungen ändern oder die Datei ersetzen oder schließen, wird das vorherige Ergebnis verworfen. Ein Abbruch beendet den Hintergrundprozess. Es gibt keine feste Obergrenze für die Dateigröße; welche Dateien verarbeitet werden können, hängt vom verfügbaren Arbeitsspeicher des Browsers ab.

Öffnen Sie den [Tabellenbetrachter](../xlsx-viewer/), um Tabellendateien zu durchsuchen.
