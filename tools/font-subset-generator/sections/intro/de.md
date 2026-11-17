## Was ist eine Schrift-Teilmenge?

Eine Schrift-Teilmenge enthält die Zeichen, die für einen bestimmten Text
benötigt werden, sowie die zusätzlichen Glyphen, die zu ihrer Darstellung
erforderlich sind. Das Entfernen ungenutzter Glyphen kann Schrift-Downloads
erheblich verkleinern, insbesondere bei großen chinesischen, japanischen und
koreanischen Schriften oder für eine feste Überschrift, ein Logo oder eine
Kampagnenseite.

## So verwendest du dieses Tool

Wähle eine TTF-, OTF-, WOFF- oder WOFF2-Datei und füge den gesamten Text ein,
der sie verwenden soll. Wähle WOFF2 für die Bereitstellung im Web oder
TTF / OTF für eine unkomprimierte Schrift und erstelle dann die Teilmenge.
Vergleiche die Größen, prüfe die Vorschau und lade die Schrift mit dem
passenden CSS herunter. Die Schriftverarbeitung erfolgt lokal in einem Web Worker.

## Was bleibt erhalten?

HarfBuzz behält die Glyphenabhängigkeiten und OpenType-Layout-Funktionen bei,
die für Ligaturen, Kerning, kombinierende Zeichen und komplexe Schriftsysteme
benötigt werden. Hinting und variable Schriftachsen bleiben erhalten.
Kanonisch äquivalente zusammengesetzte und zerlegte Textformen werden
einbezogen, sofern die Ausgangsschrift sie unterstützt. Die Vorschau verwendet
die erstellte Schrift; fehlende Zeichen der Ausgangsschrift werden gesondert
aufgeführt.

## Praktische Tipps

- Berücksichtige Leerzeichen, Satzzeichen, Zahlen und alle benötigten
  übersetzten Texte. Füge die lateinische Zeichenvorgabe hinzu, wenn dein Text
  auch grundlegende lateinische Zeichen enthalten wird.
- Erstelle die Teilmenge bei jeder Textänderung neu. Eine feste Teilmenge eignet
  sich am besten für bekannte Inhalte; verwende für nutzergenerierte Texte eine
  größere Zeichenauswahl.
- Die Teilmengenbildung kann keine Zeichen ergänzen, die in der Originalschrift
  fehlen. Hinterlege eine CSS-Ersatzschrift für Zeichen außerhalb der Teilmenge.
- Verwende eine Schrift, deren Lizenz Änderungen und die Einbettung im Web
  erlaubt. Schriftsammlungen (`.ttc` / `.otc`) müssen zuerst als einzelne
  Schriften exportiert werden.
- Kleine oder bereits reduzierte Schriften werden möglicherweise nicht kleiner.
  WOFF2 liefert meist den kleinsten Download fürs Web; die Glyphenanzahl
  umfasst auch unterstützende Glyphen.
