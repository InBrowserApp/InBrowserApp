## OpenDocument-Tabellen in Excel konvertieren

Öffnen Sie eine lokale ODS-Datei oder legen Sie sie hier ab, prüfen Sie ihre Zellen und laden Sie eine XLSX-Arbeitsmappe herunter. Arbeitsblattnamen und -reihenfolge, ausgeblendete Arbeitsblätter, Text, Zahlen, boolesche Werte, Datumsangaben, gespeicherte Formelergebnisse und verbundene Zellen werden übernommen. Leere Arbeitsblätter und Lücken zwischen Zellen bleiben erhalten. Das Vorschaufenster begrenzt die exportierten Daten nicht.

## Gespeicherte Werte und Kompatibilität

Formeln werden durch ihre gespeicherten Werte ersetzt, nicht durch Excel-Formeln. Bei fehlenden gespeicherten Ergebnissen bleiben die Zellen leer, und ein Hinweis wird angezeigt. Der Browser berechnet Formeln nicht neu und aktualisiert keine externen Daten. Fehlerergebnisse werden zu allgemeinen Tabellenfehlern. Als Text gespeicherte Inhalte bleiben Text. Das gilt auch für Kennungen mit führenden Nullen, nicht lateinische Zeichen und Text, der mit einem Gleichheitszeichen beginnt.

Datumsangaben verwenden ein Standardformat für Datum und Uhrzeit; bei explizit angegebenen Zeitzonen werden sie in UTC umgerechnet. Zeitdauern bleiben als Anzahl von Tagen erhalten, und Prozentwerte verwenden ein einfaches Prozentformat. Bei Währungswerten bleibt die Zahl ohne Währungsbezeichnung oder ursprüngliche Formatierung erhalten. Formatierungen, Zeilenhöhen und Spaltenbreiten, Diagramme, Bilder, Kommentare, Links, Makros und Arbeitsmappeneinstellungen werden nicht nachgebildet.

Verschlüsselte Dateien, ungültige Archive, nicht unterstützte Daten sowie Werte oder Arbeitsblattnamen außerhalb der von Excel unterstützten Grenzen führen zu einer eindeutigen Fehlermeldung. Flache OpenDocument-Dateien (.fods) werden von diesem Konverter nicht akzeptiert. Prüfen Sie wichtige Ergebnisse nach dem Herunterladen in Ihrer Tabellenkalkulation.

## Lokale Verarbeitung

Die Konvertierung erfolgt in diesem Browser, ohne das Dokument hochzuladen. Wenn Sie die Datei ersetzen oder schließen, wird das vorherige Ergebnis zum Herunterladen verworfen; ein Abbruch beendet den Hintergrundprozess. Es gibt keine feste Obergrenze für die Dateigröße oder die Anzahl der Arbeitsblätter. Welche Arbeitsmappen verarbeitet werden können, hängt weiterhin vom verfügbaren Arbeitsspeicher des Browsers ab.

Öffnen Sie den [Tabellenbetrachter](../xlsx-viewer/), um ODS und andere Tabellenformate zu durchsuchen.
