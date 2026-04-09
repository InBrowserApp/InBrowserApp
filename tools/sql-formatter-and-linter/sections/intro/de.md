## Was ist SQL Formatter & Linter?

SQL Formatter & Linter formatiert SQL-Abfragen direkt im Browser und prüft sie gleichzeitig auf eine kleine Auswahl aussagekräftiger Probleme. Das ist nützlich, wenn du ein saubereres Query-Layout, einheitliche Groß- und Kleinschreibung bei Schlüsselwörtern und schnelles Feedback zu riskanten Mustern wie `SELECT *` oder `UPDATE`-Anweisungen ohne `WHERE`-Klausel möchtest.

## Wann Sollte Man Es Verwenden?

Verwende dieses Tool, wenn du handgeschriebenes SQL überprüfst, eingefügte Abfragen vor dem Teilen bereinigst oder Formatierungen zwischen verschiedenen SQL-Dialekten vergleichst. Es eignet sich gut für die ad hoc Abfrageprüfung, das Aufräumen in Pull Requests und browserbasierte Formatierung, ohne dein SQL an einen Server zu senden.

## Was Wird Geprüft?

Dieser Rewrite hält Formatter und Linter getrennt, aber aufeinander abgestimmt. Die Formatierung nutzt `sql-formatter` mit layoutbezogenen Optionen für den jeweiligen Dialekt, während das Linting Parse-Fehler, fehlende Semikolons, breit angelegte `SELECT *`-Verwendung, unsichere Mutationen, lange Zeilen und Abweichungen bei der Groß-/Kleinschreibung von Schlüsselwörtern aufzeigt.
