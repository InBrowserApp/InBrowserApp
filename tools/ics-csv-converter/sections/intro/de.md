## ICS-Kalendertermine als CSV exportieren

Wählen Sie **ICS in CSV**, öffnen Sie eine iCalendar-Datei oder fügen Sie ihren Inhalt ein und wählen Sie **Konvertieren**. Pro gespeichertem Termineintrag gibt es eine Tabellenzeile mit Titel, Beginn, Ende, Ort, Beschreibung und gegebenenfalls Wiederholungsregel. Laden Sie die CSV-Datei herunter, um die Einträge in Excel oder Google Tabellen zu prüfen oder zu bearbeiten. Bei ganztägigen Terminen steht nur das Datum in der Tabelle. Der Endtag zählt nicht mit. Belegt ein Termin den 12. Mai, endet er in der Tabelle am 13. Mai.

## Eine ICS-Datei aus CSV-Zeilen erstellen

Wählen Sie **CSV in ICS** und sehen Sie unter **Beispiel ausprobieren** nach, wie die Spalten heißen. Geben Sie mindestens die Spalten `Title` und `Start` an. Verwenden Sie `2026-05-12` für einen ganztägigen Termin, `2026-05-12T09:00:00` für eine Ortszeit oder `2026-05-12T09:00:00Z` für UTC. Der Konverter erkennt auch Überschriften aus Google Kalender wie `Subject`, `Start Date`, `Start Time` und `All Day Event`. Laden Sie die ICS-Datei herunter, um die Termine in Ihren Kalender zu importieren.

## Das Kalenderoriginal als vollständige Sicherung behalten

CSV speichert Termindaten in Tabellenzeilen. Terminserien erscheinen als Wiederholungsregeln. Einzelne Wiederholungstermine werden nicht erzeugt. Eingebettete Zeitzonendefinitionen bleiben erhalten. Anhänge, Erinnerungen, Teilnehmende, ausgelassene Wiederholungstermine und der Absagestatus bleiben in der ursprünglichen Kalenderdatei. Die Konvertierung erfolgt in Ihrem Browser.
