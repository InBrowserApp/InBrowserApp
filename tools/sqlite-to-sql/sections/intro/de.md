## SQLite als SQL-Datei exportieren

Öffnen Sie eine SQLite-3-Datenbankdatei mit der Endung `.db`, `.sqlite` oder `.sqlite3` oder ziehen Sie sie in den Dateibereich. Das Tool erstellt den SQL-Dump automatisch. Aktivieren Sie **Nur Schema**, um die Datenbankstruktur ohne Tabellenzeilen zu exportieren. Mit **.sql-Datei herunterladen** speichern Sie das vollständige Skript. Probieren Sie die Beispieldatenbank aus, um sich das Ergebnis anzusehen.

## Was enthält ein SQLite-Dump?

Ein SQL-Dump ist ein Skript, mit dem Sie eine Datenbank neu erstellen können. Er enthält `CREATE`-Anweisungen für Tabellen, Indizes, Ansichten und Trigger. Beim vollständigen Export kommen `INSERT`-Anweisungen für die Tabellenzeilen hinzu. So können Sie Schemaänderungen in Git nachvollziehen, eine lesbare Sicherung speichern oder eine Datenbank in eine andere SQLite-Umgebung übertragen.

Die Quelldatei bleibt auf Ihrem Gerät. Wenn die Datenbank ein Write-Ahead Log (WAL) verwendet, exportieren Sie zunächst eine eigenständige Datenbankkopie. Nutzen Sie dafür die ursprüngliche Anwendung oder den Sicherungsbefehl von SQLite. So enthält die Kopie auch die bereits bestätigten Änderungen aus dem Protokoll.

## Datenbank aus dem SQL-Dump wiederherstellen

Mit diesem Befehl importieren Sie das Skript in eine neue SQLite-Datenbank.

```sh
sqlite3 restored.sqlite < database.sql
```

Ersetzen Sie `database.sql` durch den Namen der heruntergeladenen Datei. Das Skript verwendet SQLite-Syntax. Wenn Ihre Datenbank virtuelle Tabellen oder Erweiterungen verwendet, benötigen Sie zur Wiederherstellung eine SQLite-Installation mit den entsprechenden Modulen.

Im [SQLite-Betrachter](../sqlite-viewer/) können Sie Tabellen ansehen und Abfrageergebnisse als CSV oder JSON exportieren. Wenn Sie aus Tabellendateien eine Datenbank erstellen möchten, nutzen Sie [CSV und Excel in SQLite umwandeln](../csv-excel-to-sqlite/).
