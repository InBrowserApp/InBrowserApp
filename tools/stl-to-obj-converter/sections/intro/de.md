## Eine STL-Datei in Wavefront OBJ umwandeln

Wähle **Datei öffnen** oder ziehe eine `.stl`-Datei in den Konverter. Er liest ASCII- und binäre STL-Dateien und bereitet den Download als `.obj` im Browser vor. Mit **Beispiel ausprobieren** kannst du zuerst einen kleinen Montagewinkel konvertieren. Wähle danach **OBJ herunterladen**, um die Datei zu speichern.

## Prüfen, was in der OBJ-Datei steckt

Die Konvertierung schreibt die ursprünglichen Oberflächendreiecke in eine Wavefront-OBJ-Datei. Die Koordinatenachsen und die Größe des Netzes bleiben erhalten. STL speichert standardmäßig keine Maßeinheit. Ist eine Kante in der Quelldatei 40 Einheiten lang, misst sie in der OBJ-Datei ebenfalls 40 Koordinateneinheiten. Wähle beim Import in ein anderes Programm die vorgesehene Einheit.

Der Download enthält die Netzgeometrie. Materialbibliotheken und Texturen gehören nicht zum STL-Standard und sind daher nicht im Ergebnis enthalten.

## Ergebnis ansehen oder zurückkonvertieren

Öffne deine heruntergeladene Datei im [OBJ-Betrachter](../obj-viewer/). Die Quelldatei kannst du im [STL-Betrachter](../stl-viewer/) ansehen. Für die umgekehrte Richtung nutze den [OBJ-zu-STL-Konverter](../obj-to-stl-converter/).
