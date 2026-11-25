## Zufällige Kalenderdaten in einem Zeitraum generieren

Gib ein **Startdatum** und ein **Enddatum** ein, wähle ein Ausgabeformat und dann **Generieren**. Beide Grenzen sind eingeschlossen: Der Zeitraum von `2024-02-28` bis `2024-03-01` kann also auch den Schalttag `2024-02-29` ergeben. Dasselbe Datum kann mehrfach in einer Ausgabe vorkommen. Kopiere die Ergebnisse oder lade eine `UTF-8`-Textdatei mit einem Datum pro Zeile herunter.

## ISO oder ein lokalisiertes Datum wählen

Verwende **ISO (YYYY-MM-DD)** für Testdaten, Tabellenimporte oder Datumswerte, die als Text chronologisch sortiert werden sollen. Mit **Lokalisiertes Datum** wird das Datum des gregorianischen Kalenders in der Sprache der Seite angezeigt. So erscheint `2024-02-29` auf der englischen Seite als `Feb 29, 2024` und auf der deutschen Seite als `29.02.2024`.

## Denselben Kalendertag über Zeitzonen hinweg verwenden

Der Zeitraum verwendet UTC-Tagesgrenzen. Ein Datum an einer der beiden Grenzen bleibt derselbe Kalendertag, unabhängig davon, wo der Generator angezeigt wird. Wenn Start- und Enddatum gleich sind, wird nur dieses Datum generiert. Das ist nützlich, um Schalttage oder den ersten oder letzten Tag eines Monats zu testen.
