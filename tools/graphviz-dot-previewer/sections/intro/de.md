## Graphviz-DOT-Graphen online in der Vorschau ansehen

Füge DOT-Quelltext aus einer Datei, einem Skript oder einer Dokumentation in **DOT-Code** ein. Der Graph aktualisiert sich schon beim Tippen. Verwende `digraph` und `->` für gerichtete Kanten oder `graph` und `--` für ungerichtete Kanten. Die integrierten Beispiele zeigen, wie du Abhängigkeiten, Netzwerke und Cluster beschreibst.

## Eine Graphviz-Layout-Engine auswählen

Beginne mit `dot` für Graphen mit Ebenen, etwa für Build-Abhängigkeiten. Probiere `neato` oder `fdp` für die freie Anordnung eines ungerichteten Netzwerks, `sfdp` für größere Netzwerke, `circo` für kreisförmige Layouts oder `twopi` für einen radialen Baum aus. Graphviz bietet auch `osage` für Graphen mit Clustern und `patchwork` für Treemaps an. Der DOT-Code bleibt beim Wechseln der Engine im Editor.

## Layout-Hinweise und Syntaxfehler verstehen

Graphviz kann einen Fehler melden, wenn der Kantenoperator nicht zum Graphentyp passt oder wenn eine Klammer oder ein Anführungszeichen fehlt. Prüfe die angegebene und die vorherige Zeile. Graphviz kann auch eine Vorschau zusammen mit Hinweisen zu Attributen anzeigen, die nicht angewendet werden konnten. Wenn der Graph ein eigenes `layout`-Attribut festlegt, verwendet Graphviz die dort angegebene Engine. Details findest du in der [DOT-Sprachreferenz](https://graphviz.org/doc/info/lang.html) und in der [Graphviz-Layout-Übersicht](https://graphviz.org/docs/layouts/).
