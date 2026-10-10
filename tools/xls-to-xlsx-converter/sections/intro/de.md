## Ältere Excel-Arbeitsmappen im Browser konvertieren

Öffnen Sie eine lokale XLS-Datei oder legen Sie sie hier ab. Wählen Sie ein Arbeitsblatt, prüfen Sie seine Zelldaten und laden Sie eine XLSX-Arbeitsmappe herunter. Sie können durch die Vorschau navigieren oder die Adresse der Zelle oben links eingeben, um zu einem anderen Bereich zu springen. Das Vorschaufenster begrenzt den Export nicht: Alle Arbeitsblätter und ihre importierten Zellen sind enthalten.

Namen und Reihenfolge der Arbeitsblätter, leere Blätter, der Ausblendstatus von Blättern, Text, Zahlen, boolesche Werte, Tabellenfehler, unterstützte Zahlenformate, verbundene Zellen, Zeilenhöhen, Spaltenbreiten sowie ausgeblendete Zeilen und Spalten bleiben erhalten, soweit der Parser für das Quellformat sie unterstützt. Kennungen im Textformat behalten ihre führenden Nullen. Datumsangaben behalten die Excel-Serienwerte und das Datumssystem der Arbeitsmappe.

## Formeln und Kompatibilität

Unterstützte Formelausdrücke und ihre gespeicherten Ergebnisse bleiben erhalten. Der Browser berechnet Formeln nicht neu und aktualisiert keine externen Daten. Eine Formel ohne gespeichertes Ergebnis erscheint in der Vorschau mit einem Hinweis; ihr Ausdruck bleibt in der Ausgabe erhalten, damit eine Tabellenkalkulation ihn berechnen kann. Nicht unterstützte Formelausdrücke oder externe Verweise werden bei der Konvertierung möglicherweise nicht korrekt übernommen.

Dies ist eine Datenkonvertierung, keine originalgetreue Nachbildung aller Funktionen einer Arbeitsmappe. Diagramme, Bilder, Makros, Pivot-Funktionen und erweiterte Formatierungen bleiben nicht erhalten. Die Vorschau bildet die Anordnung verbundener Zellen und Formatierungen nicht nach. Prüfen Sie die heruntergeladene Arbeitsmappe in Ihrer Tabellenkalkulation, insbesondere wenn Formeln oder das Layout wichtig sind. Makroblätter, Diagrammblätter, verschlüsselte oder beschädigte Dateien sowie Dateien, die lediglich in .xls umbenannt wurden, werden nicht unterstützt.

## Lokale Verarbeitung

Ihre Arbeitsmappe wird in diesem Browser verarbeitet, ohne ihren Inhalt hochzuladen. Makros werden nicht ausgeführt und verknüpfte Ressourcen nicht abgerufen. Beim Ersetzen oder Schließen der Arbeitsmappe wird das Ergebnis verworfen; ein Abbruch stoppt die Konvertierung. Es gibt keine feste Obergrenze für die Dateigröße oder die Anzahl der Arbeitsblätter, große Arbeitsmappen sind jedoch weiterhin vom verfügbaren Arbeitsspeicher des Browsers abhängig.

Öffnen Sie den [Tabellenbetrachter](../xlsx-viewer/), um andere Tabellenformate zu durchsuchen.
