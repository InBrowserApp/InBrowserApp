UUID v1 und UUID v6 enthalten dieselben Kerninformationen: einen Zeitstempel, eine Clock Sequence und eine Node-Kennung. UUID v1 speichert den Zeitstempel in der historischen UUID-Feldreihenfolge, während UUID v6 diese Zeitstempel-Bits so neu anordnet, dass eine einfache lexikografische Sortierung natürlicher der Erstellungszeit folgt.

Verwende diesen Konverter, wenn du Kennungen zwischen Systemen übertragen musst, die unterschiedliche zeitbasierte UUID-Anordnungen erwarten. Füge eine UUID v1 ein, um das entsprechende UUID-v6-Äquivalent zu erhalten, oder füge eine UUID v6 ein, um die UUID-v1-Darstellung wiederherzustellen. Die Konvertierung ist deterministisch und lässt Clock Sequence sowie Node-Bytes unverändert.

## Wann du ihn verwendest

- Migration von Datensätzen aus älterer UUID-v1-Speicherung zu UUID v6, während Identitätsmetadaten erhalten bleiben.
- Fehlersuche in Datenbanken, Protokollen oder Warteschlangen, die UUID-v1- und UUID-v6-Werte mischen.
- Prüfen, ob ein UUID-v6-Wert auf den UUID-v1-Wert zurückgeführt werden kann, den eine ältere Integration erwartet.

## Eingabeformat

Der Konverter akzeptiert kanonische UUID-Zeichenfolgen mit Bindestrichen, kompakte 32-stellige UUID-Zeichenfolgen, UUIDs in Großschreibung, `urn:uuid:`-Werte und UUIDs in geschweiften Klammern. Ergebnisse werden immer in die kanonische UUID-Form mit Kleinbuchstaben normalisiert.

## Hinweise zu Datenschutz und Kompatibilität

UUID v1 und UUID v6 können Erstellungszeit und Node-Informationen codieren. Behandle sie als operative Kennungen, nicht als Geheimnisse, und vermeide ihre Offenlegung, wenn Zeitstempel- oder Node-Metadaten sensibel sein könnten. Dieser Konverter läuft lokal in deinem Browser und lädt deine UUIDs nicht hoch.
