## Überblick

JSON Diff Path vergleicht zwei JSON-Dokumente und wandelt jede strukturelle Änderung in einen lesbaren Pfadeintrag mit JSONPath- und JSON-Pointer-Ausgabe um.

## Wann es sinnvoll ist

Verwenden Sie es, wenn Sie API-Payload-Änderungen prüfen, Konfigurationsmigrationen untersuchen oder RFC-6902-JSON-Patch-Operationen für Automatisierungen erzeugen müssen.

## So funktioniert es

Das Tool analysiert beide JSON-Eingaben, ermittelt `add`-, `remove`- und `replace`-Änderungen und lässt Sie dann diese Operationen filtern sowie im selben Ergebnisbereich zwischen einer Pfadliste und JSON-Patch-Ausgabe wechseln.
