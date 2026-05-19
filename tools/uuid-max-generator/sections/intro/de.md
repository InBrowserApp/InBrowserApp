## Was ist eine Max UUID?

Eine Max UUID ist die standardisierte UUID, bei der alle 128 Bits auf eins gesetzt sind. Ihre kanonische Textform ist `ffffffff-ffff-ffff-ffff-ffffffffffff`, und sie wird oft verwendet, um den höchstmöglichen UUID-Wert zu bezeichnen.

## Wann sollte sie verwendet werden?

Verwende eine Max UUID, wenn eine API, eine Datenbankabfrage, ein Fixture oder eine Bereichsprüfung eine UUID-förmige obere Grenze oder einen Sentinel-Wert benötigt. Sie ist nützlich in Tests, Migrationsskripten, Paginierungs-Cursorn und Protokollen, die einen expliziten maximalen UUID-Wert definieren.

## Worauf ist zu achten?

Behandle die Max UUID nicht als erzeugten eindeutigen Bezeichner. Sie ist jedes Mal derselbe Wert. Wenn du sie dort speicherst, wo eine echte Objekt-ID erwartet wird, kann das Sentinel-Logik verdecken, Eindeutigkeitsannahmen brechen oder Datensätze unerwartet ans Ende sortieren.
