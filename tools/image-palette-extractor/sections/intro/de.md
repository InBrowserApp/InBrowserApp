## Was dieses Tool macht

Der Bildpaletten-Extraktor findet die dominanten Farben in einem Bild direkt in
deinem Browser. Er wertet das Bild aus, gruppiert visuell ähnliche Pixel und
gibt eine praktische Palette mit HEX-, RGB-, HSL- und Prozentwerten für jede
Farbe zurück.

## Gute Anwendungsfälle

- Marken- oder Produktfarben aus einem Screenshot, Logo, Foto oder Mockup ziehen.
- Schnell eine CSS-Palette für eine Landingpage, ein Thumbnail oder eine
  Designübergabe erstellen.
- Vergleichen, wie stark ein Bild von einer dominanten Farbe im Verhältnis zu
  unterstützenden Akzenten geprägt ist.
- Mit privaten Bildern arbeiten, ohne die Datei an einen Server zu senden.

## Exportoptionen

Das Ergebnis kann als einfache HEX-Liste, CSS Custom Properties oder JSON
kopiert werden. Das CSS-Format ist nützlich, wenn du Variablen wie
`--palette-1` verwenden möchtest, während JSON die Farbformate und den
Dominanzanteil für Skripte oder Designautomatisierung zusammenhält.

## Worauf du achten solltest

- Die Palettenextraktion ist eine Annäherung. Sie soll nützliche visuelle
  Gruppen erzeugen, keine vollständige Bestandsaufnahme jeder Pixelfarbe.
- Transparente Pixel werden standardmäßig ignoriert, damit Icons und Freisteller
  die Palette nicht verfälschen; schalte das aus, wenn Transparenz selbst Teil
  der Gestaltung ist.
- Die präzise Qualitätseinstellung wertet mehr Pixel aus und kann bei sehr
  großen Bildern langsamer sein.
