## SQLite-Datenbanken im Browser erkunden

Öffnen Sie eine SQLite-3-Datenbank, um Tabellen und Ansichten zu durchsuchen, Spalten, Indizes, Fremdschlüssel und CREATE-Anweisungen zu prüfen oder eine schreibgeschützte SQL-Abfrage auszuführen. Probieren Sie die Beispieldatenbank aus, um den Arbeitsbereich zu erkunden. Ihre Datei wird lokal verarbeitet und niemals verändert.

## Ergebnisse abfragen und exportieren

Wählen Sie eine Tabelle oder Ansicht, um ihre Zeilen zu laden. Bearbeiten Sie anschließend die SQL-Abfrage, um Daten zu filtern, zu sortieren oder zu verknüpfen. Führen Sie eine SELECT-, WITH- oder EXPLAIN-Anweisung mit **Abfrage ausführen** oder **Strg/⌘ + Eingabe** aus. Klicken Sie auf eine Zelle, um ihren vollständigen Wert zu prüfen und zu kopieren.

Wählen Sie ein Ergebnislimit von 100, 1.000 oder 10.000 Zeilen und durchsuchen Sie das Ergebnis mit jeweils 50 Zeilen pro Seite. Für Abfragen gelten ein Zeitlimit von 10 Sekunden und ein Ergebnisgrößenlimit von 5 MiB. CSV- und JSON-Exporte enthalten alle geladenen Zeilen über alle Seiten hinweg.

JSON verwendet getrennte Spaltennamen und Zeilenarrays, um doppelte Namen und NULL-Werte zu erhalten. Ganzzahlen sind exakte Dezimalzeichenfolgen und BLOBs enthalten einen `$blob`-Hexwert. CSV enthält eine Kopfzeile, verwendet leere Felder für NULL und stellt formelähnlichem Text ein Apostroph voran.

## Unterstützte SQLite-Dateien

Öffnen Sie eine unverschlüsselte `.db`-, `.sqlite`- oder `.sqlite3`-Datei bis 50 MiB. Erstellen Sie bei einer Datenbank mit WAL vor dem Öffnen eine Kopie nach einem Checkpoint; WAL- und Journal-Begleitdateien werden nicht geladen. Benutzerdefinierte SQLite-Erweiterungen werden nicht unterstützt. Dateien und Abfragen werden nicht automatisch gespeichert.
