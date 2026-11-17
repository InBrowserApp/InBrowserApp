## SQLite-Dateien lokal prüfen

Öffnen Sie eine SQLite-3-Datenbank, um Tabellen und Ansichten zu durchsuchen, Spaltendefinitionen, Indizes, Fremdschlüssel und CREATE-Anweisungen zu prüfen oder eine schreibgeschützte SQL-Abfrage auszuführen. Probieren Sie die Beispieldatenbank aus, um den Arbeitsbereich ohne eigene Datei zu erkunden. Dateien und Abfragen bleiben in Ihrem Browser und werden nicht automatisch gespeichert.

## Ergebnisse abfragen und exportieren

Wählen Sie eine Tabelle, um ihre Zeilen anzuzeigen. Bearbeiten Sie die SQL-Abfrage und verwenden Sie **Abfrage ausführen** oder **Strg/⌘ + Eingabe**, um eine SELECT-, WITH- oder EXPLAIN-Anweisung auszuführen. Das Ergebnislimit begrenzt die Anzahl geladener Zeilen; die Seitenansicht zeigt jeweils 50 Zeilen. Eine Abfrage kann auch beim Erreichen des Ergebnisbudgets von 5 MiB oder nach 10 Sekunden stoppen. Beim Abbrechen bleibt die Oberfläche bedienbar und die Datenbank-Momentaufnahme wird bei der nächsten Abfrage neu geladen.

CSV- und JSON-Exporte enthalten das geladene Ergebnis einschließlich der Zeilen auf anderen Seiten. JSON speichert Spaltennamen und Zeilenarrays getrennt, wodurch doppelte Namen und NULL-Werte erhalten bleiben. SQLite-Ganzzahlen werden zu exakten Dezimalzeichenfolgen und BLOBs zu Objekten mit einem hexadezimalen `$blob`-Wert. CSV verwendet leere Felder für NULL, setzt Sonderzeichen in Anführungszeichen und stellt formelähnlichem Text für eine sicherere Verwendung in Tabellenkalkulationen ein Apostroph voran.

## Unterstützte Datenbanken und Grenzen

Öffnen Sie eine unverschlüsselte `.db`-, `.sqlite`- oder `.sqlite3`-Datei bis 50 MiB. Die Originaldatei wird niemals verändert. Dieses Werkzeug lädt eine Momentaufnahme in den Arbeitsspeicher; der Speicherbedarf kann daher die Dateigröße übersteigen. WAL- und Journal-Begleitdateien werden nicht importiert. Erstellen Sie vor dem Öffnen hier mit Ihrer Datenbankanwendung eine saubere Kopie nach einem Checkpoint. Verschlüsselte Datenbanken, benutzerdefinierte SQLite-Erweiterungen und das Bearbeiten von Datenbanken werden nicht unterstützt.
