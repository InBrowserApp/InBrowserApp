## Eine Wavefront-OBJ-Datei in STL umwandeln

Wähle **Datei öffnen** oder ziehe eine `.obj`-Datei in den Konverter. Mit **Beispiel ausprobieren** kannst du zuerst einen kleinen Montagewinkel konvertieren. Der Konverter zerlegt die Polygonflächen in Dreiecke. Mit **STL herunterladen** speicherst du eine binäre `.stl`-Datei. Die Umwandlung läuft auf deinem Gerät.

## Was sich beim Export nach STL ändert

STL speichert eine aus Dreiecken aufgebaute Oberfläche. Materialien, Texturbilder, UV-Koordinaten sowie einzelne Linien und Punkte werden beim Export weggelassen. Der Konverter behält die Achsen und den Maßstab bei. Binäre STL-Dateien speichern Koordinaten als 32-Bit-Gleitkommazahlen. Bei sehr großen Koordinaten können feine Details durch Rundung verloren gehen. Wähle vor dem Drucken die vorgesehene Einheit im Slicer. Eine Ausdehnung von 40 Koordinateneinheiten in der OBJ-Datei entspricht beispielsweise 40 Koordinateneinheiten in der STL-Datei.

Dateien lassen sich auch konvertieren, wenn das Netz Löcher oder andere Geometrieprobleme hat. Prüfe das Ergebnis vor dem Drucken im Slicer.

## Ergebnis ansehen oder zurückkonvertieren

Öffne die heruntergeladene Datei im [STL-Betrachter](../stl-viewer/) oder sieh dir das Original mit den zugehörigen Materialien im [OBJ-Betrachter](../obj-viewer/) an. Für die umgekehrte Richtung nutze den [STL-zu-OBJ-Konverter](../stl-to-obj-converter/).
