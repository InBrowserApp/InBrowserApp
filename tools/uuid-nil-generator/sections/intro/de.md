## Was ist eine Nil-UUID?

Eine Nil-UUID ist die standardisierte UUID, deren 128 Bits alle null sind. Ihre kanonische Textform ist `00000000-0000-0000-0000-000000000000`, und sie wird häufig verwendet, um auszudrücken, dass noch keine UUID zugewiesen wurde.

## Wann sollte sie verwendet werden?

Verwende eine Nil-UUID, wenn eine API, Datenbankspalte, Fixture oder Konfigurationsdatei einen UUID-förmigen Wert erfordert, der echte Bezeichner aber absichtlich fehlt. Sie ist nützlich als Platzhalter in Tests, Importvorlagen, Migrationsskripten und Protokollen, die einen explizit leeren UUID-Wert definieren.

## Worauf ist zu achten?

Behandle die Nil-UUID nicht als generierten eindeutigen Bezeichner. Sie ist jedes Mal derselbe Wert. Wird sie dort gespeichert, wo eine echte Objekt-ID erwartet wird, kann sie fehlende Daten verbergen, Annahmen zur Eindeutigkeit brechen oder Datensätze verbunden erscheinen lassen, obwohl sie es nicht sind.
