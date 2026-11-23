## Einen JSON Patch anwenden

Fügen Sie das ursprüngliche JSON-Dokument in den ersten Editor und das JSON-Patch-Array nach RFC 6902 in den zweiten ein. Wählen Sie **Patch anwenden**, um das aktualisierte JSON anzuzeigen und zu kopieren. Um einen Patch zu erzeugen, vergleichen Sie das ursprüngliche und das geänderte Dokument im [JSON-Diff-Pfad](../json-diff-path/) und kopieren Sie die Ausgabe unter **JSON Patch**. Wenden Sie den Patch auf dasselbe ursprüngliche Dokument an.

## Beispiel für einen JSON Patch

Das ursprüngliche Dokument enthält einen Status und ein Schlagwort.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Der Patch prüft den ursprünglichen Status, aktualisiert ihn und hängt ein Schlagwort an.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

Das Ergebnis lautet `{"status":"published","tags":["api","release"]}`.

## Unterstützte Operationen und JSON-Pointer-Syntax

- `add` legt einen Objekteintrag an oder überschreibt ihn, fügt ein Array-Element ein oder ersetzt das gesamte Dokument, wenn der Pfad auf die Wurzel zeigt.
- `remove` löscht einen vorhandenen Wert. `replace` ersetzt einen vorhandenen Wert.
- `move` entnimmt einen vorhandenen Wert am Quellpfad `from` und fügt ihn an der Position `path` ein. `copy` fügt eine unabhängige Kopie ein.
- `test` prüft, ob der Wert an der Position `path` dem angegebenen `value` entspricht. Das Dokument bleibt dabei unverändert.

Pfade folgen der JSON-Pointer-Syntax nach RFC 6901. Array-Indizes beginnen bei null. `/tags/0` verweist daher auf das erste Schlagwort. `/tags/-` hängt einen Wert an, wenn die Operation ein Element in dieses Array einfügt. Schreiben Sie `~1` für einen Schrägstrich und `~0` für eine Tilde in einem Objektschlüssel. So verweist beispielsweise `/a~1b` auf den Schlüssel `a/b`. Ein leerer Pfad `""` verweist auf das gesamte Dokument, während `/` auf einen Eintrag mit leerem Schlüssel verweist.

## Warum eine JSON-Patch-Operation fehlschlägt

Die Operationen werden in der Reihenfolge des Arrays ausgeführt. Jede Operation verwendet den Stand nach den vorangegangenen Änderungen. Fehlt ein Ziel, liegt ein Array-Index außerhalb des gültigen Bereichs oder weicht ein mit `test` geprüfter Wert ab, markiert das Werkzeug die erste fehlgeschlagene Operation und bricht ab. Die JSON-Vorschau erscheint nur, wenn der gesamte Patch erfolgreich ist. Ein leeres Patch-Array `[]` gibt das ursprüngliche Dokument zurück.

Der Browser wendet den Patch lokal an. Das ursprüngliche JSON und der Patch bleiben in Ihrem Browser.
